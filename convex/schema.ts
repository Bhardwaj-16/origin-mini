import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    passwordHash: v.string(), 
    isAdmin: v.boolean(),
  }).index("by_email", ["email"]),
  
  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
  }).index("by_token", ["token"]),

  apiConfigs: defineTable({
    mode: v.string(), // "featured" or "all"
    apiProvider: v.string(), // "openrouter" or "hackclub"
    apiKey: v.string(),
    baseUrl: v.string(),
  }).index("by_mode", ["mode"]),
});
