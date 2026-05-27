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
        apiKey: "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",
        baseUrl: "https://openrouter.ai/api/v1",
      });
    }

    const all = await ctx.db.query("apiConfigs").withIndex("by_mode", q => q.eq("mode", "all")).first();
    if (!all) {
      await ctx.db.insert("apiConfigs", {
        mode: "all",
        apiProvider: "hackclub",
        apiKey: "sk-hc-v1-fa4270e627b64d6bbcdf3a35db9802f5e377037bad1f48dfabb1342a7cd1206b",
        baseUrl: "https://ai.hackclub.com/proxy/v1",
      });
    }
  }
});
