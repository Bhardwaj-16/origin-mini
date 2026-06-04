import { mutation } from "./_generated/server";

async function hashPassword(password: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const setup = mutation({
  args: {},
  handler: async (ctx) => {
    const anyUser = await ctx.db.query("users").first();
    if (!anyUser) {
      await ctx.db.insert("users", {
        email: "admin@origin.local",
        passwordHash: await hashPassword("admin123"),
        isAdmin: true,
      });
    }

    const featured = await ctx.db.query("apiConfigs").withIndex("by_mode", q => q.eq("mode", "featured")).first();
    if (!featured) {
      await ctx.db.insert("apiConfigs", {
        mode: "featured",
        apiProvider: "openrouter",
        apiKey: process.env.OPENROUTER_API_KEY || "",
        baseUrl: "https://openrouter.ai/api/v1",
      });
    }

    const all = await ctx.db.query("apiConfigs").withIndex("by_mode", q => q.eq("mode", "all")).first();
    if (!all) {
      await ctx.db.insert("apiConfigs", {
        mode: "all",
        apiProvider: "hackclub",
        apiKey: process.env.HACKCLUB_API_KEY || "",
        baseUrl: "https://ai.hackclub.com/proxy/v1",
      });
    }
  }
});
