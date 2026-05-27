import { NextRequest, NextResponse } from "next/server";
import { isFeaturedModel } from "@/lib/models";
import { getApiConfig } from "@/lib/convex";

export async function POST(req: NextRequest) {
  try {
    const { messages, model } = await req.json();

    if (!model) {
      return NextResponse.json({ error: "Model is required" }, { status: 400 });
    }

    const isFeatured = isFeaturedModel(model);
    const mode = isFeatured ? "featured" : "all";
    
    // Fetch configuration from Convex DB
    const config = await getApiConfig(mode);
    
    // Fallbacks to env if DB isn't seeded or available yet
    const key = config?.apiKey || process.env.OPENROUTER_API_KEY || "";
    const apiBase = config?.baseUrl || (isFeatured ? "https://openrouter.ai/api/v1" : "https://ai.hackclub.com/proxy/v1");

    const upstream = await fetch(`${apiBase}/chat/completions`, {
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
