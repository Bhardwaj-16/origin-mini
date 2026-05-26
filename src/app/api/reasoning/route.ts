import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://ai.hackclub.com/proxy/v1";

// Default top 3 reasoning models for the debate
const DEFAULT_DEBATE_MODELS = [
  "anthropic/claude-opus-4",
  "openai/o4-mini",
  "google/gemini-2.5-pro",
];

const RESTRUCTURE_MODEL = "qwen/qwen3-max";

async function callModel(
  model: string,
  messages: { role: string; content: string }[],
  apiKey: string,
  maxTokens = 2048
): Promise<string> {
  const res = await fetch(`${API_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://origin-mini.app",
      "X-Title": "ORIGIN Mini",
    },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Model ${model} failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, debateModels } = await req.json();
    const key = process.env.OPENROUTER_API_KEY || "";
    const models: string[] = debateModels ?? DEFAULT_DEBATE_MODELS;

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const send = (event: string, data: unknown) => {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ event, data })}\n\n`)
          );
        };

        try {
          // ── Step 1: Restructure the prompt ──────────────────
          send("step", { step: 1, label: "Restructuring prompt with Qwen…", total: 4 });

          const restructured = await callModel(
            RESTRUCTURE_MODEL,
            [
              {
                role: "system",
                content:
                  "You are a prompt engineer. Rewrite the given user prompt to be maximally clear, specific, and structured for AI reasoning. Keep the core intent, but make it precise and unambiguous. Return only the improved prompt.",
              },
              { role: "user", content: prompt },
            ],
            key,
            512
          );

          send("step", {
            step: 1,
            label: "Prompt restructured",
            restructuredPrompt: restructured,
          });

          // ── Step 2: Parallel first-round answers ───────────
          send("step", { step: 2, label: `Getting initial answers from ${models.length} models…`, total: 4 });

          const initialAnswers = await Promise.allSettled(
            models.map(model =>
              callModel(
                model,
                [
                  {
                    role: "system",
                    content:
                      "You are an expert AI assistant. Answer the following question clearly, accurately and thoroughly. Do not hedge unnecessarily.",
                  },
                  { role: "user", content: restructured || prompt },
                ],
                key
              ).then(content => ({ model, content }))
            )
          );

          const answers = initialAnswers
            .filter((r): r is PromiseFulfilledResult<{ model: string; content: string }> => r.status === "fulfilled")
            .map(r => r.value);

          send("step", {
            step: 2,
            label: "Initial answers received",
            answers,
          });

          if (answers.length === 0) {
            throw new Error("All models failed to respond in the debate round.");
          }

          // ── Step 3: Critique & debate ──────────────────────
          send("step", { step: 3, label: "Models are critiquing each other's answers…", total: 4 });

          const debateContext = answers
            .map((a, i) => `### Model ${i + 1} (${a.model}):\n${a.content}`)
            .join("\n\n---\n\n");

          const critiques = await Promise.allSettled(
            answers.map(a =>
              callModel(
                a.model,
                [
                  {
                    role: "system",
                    content:
                      "You are a critical AI evaluator. You will be given multiple answers to a question. Identify the strongest points from each, call out any factual errors or logical flaws, and state what the ideal answer should incorporate.",
                  },
                  {
                    role: "user",
                    content: `Original question:\n${restructured || prompt}\n\nAnswers from different models:\n\n${debateContext}\n\nProvide your critical analysis and what the ideal answer should include.`,
                  },
                ],
                key,
                1024
              ).then(content => ({ model: a.model, critique: content }))
            )
          );

          const critiqueResults = critiques
            .filter((r): r is PromiseFulfilledResult<{ model: string; critique: string }> => r.status === "fulfilled")
            .map(r => r.value);

          send("step", {
            step: 3,
            label: "Critiques complete",
            critiques: critiqueResults,
          });

          // ── Step 4: Final synthesis ────────────────────────
          send("step", { step: 4, label: "Synthesizing final answer…", total: 4 });

          const critiqueContext = critiqueResults
            .map((c, i) => `### Critique ${i + 1}:\n${c.critique}`)
            .join("\n\n---\n\n");

          const finalAnswer = await callModel(
            RESTRUCTURE_MODEL,
            [
              {
                role: "system",
                content:
                  "You are an expert synthesizer. You will receive multiple AI answers and their cross-critiques. Produce one final, definitive, accurate, and well-structured answer that incorporates the strongest elements and corrects any errors. Be authoritative and thorough.",
              },
              {
                role: "user",
                content: `Question:\n${restructured || prompt}\n\nInitial answers:\n\n${debateContext}\n\nCritiques:\n\n${critiqueContext}\n\nNow produce the final, best possible answer:`,
              },
            ],
            key,
            4096
          );

          send("done", {
            finalAnswer,
            restructuredPrompt: restructured,
            models: answers.map(a => a.model),
            answers,
            critiques: critiqueResults,
          });
        } catch (err) {
          send("error", { message: (err as Error).message });
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (err) {
    console.error("Reasoning API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
