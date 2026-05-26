import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://ai.hackclub.com/proxy/v1";

export async function POST(req: NextRequest) {
  try {
    const { messages, model } = await req.json();

    if (!model) {
      return NextResponse.json({ error: "Model is required" }, { status: 400 });
    }

    const key = process.env.OPENROUTER_API_KEY || "";

    const upstream = await fetch(`${API_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://origin-mini.app",
        "X-Title": "ORIGIN Mini",
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        max_tokens: 4096,
      }),
    });

    if (!upstream.ok) {
      const errText = await upstream.text();
      return NextResponse.json(
        { error: `Upstream error: ${upstream.status} ${errText}` },
        { status: upstream.status }
      );
    }

    // Pass through the SSE stream directly
    return new NextResponse(upstream.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
