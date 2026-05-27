import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

async function checkAdmin(ctx: any, token?: string) {
  if (!token) throw new Error("Unauthorized");
  const session = await ctx.db
    .query("sessions")
    .withIndex("by_token", (q: any) => q.eq("token", token))
    .first();
  if (!session || session.expiresAt < Date.now()) throw new Error("Unauthorized");
  
  const user = await ctx.db.get(session.userId);
  if (!user || !user.isAdmin) throw new Error("Forbidden");
}

export const getApiConfigs = query({
  args: { token: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await checkAdmin(ctx, args.token);
    return await ctx.db.query("apiConfigs").collect();
  },
});

export const getApiConfigByMode = query({
  args: { mode: v.string() },
  handler: async (ctx, args) => {
    const config = await ctx.db
      .query("apiConfigs")
      .withIndex("by_mode", (q) => q.eq("mode", args.mode))
      .first();
    return config;
  },
});

export const setApiConfig = mutation({
  args: {
    token: v.string(),
    mode: v.string(),
    apiProvider: v.string(),
    apiKey: v.string(),
    baseUrl: v.string(),
  },
  handler: async (ctx, args) => {
    await checkAdmin(ctx, args.token);

    const existing = await ctx.db
      .query("apiConfigs")
      .withIndex("by_mode", (q) => q.eq("mode", args.mode))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        apiProvider: args.apiProvider,
        apiKey: args.apiKey,
        baseUrl: args.baseUrl,
      });
    } else {
      await ctx.db.insert("apiConfigs", {
        mode: args.mode,
        apiProvider: args.apiProvider,
        apiKey: args.apiKey,
        baseUrl: args.baseUrl,
      });
    }
  },
});
