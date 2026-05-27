import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

let convexClient: ConvexHttpClient | null = null;

export function getConvexClient() {
  if (!convexClient) {
    if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
      throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
    }
    convexClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
  }
  return convexClient;
}

export async function getApiConfig(mode: "featured" | "all") {
  const client = getConvexClient();
  try {
    const config = await client.query(api.config.getApiConfigByMode, { mode });
    return config;
  } catch (error) {
    console.error("Failed to fetch API config from Convex:", error);
    return null;
  }
}
