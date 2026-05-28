export interface AIModel {
  name: string;
  id: string;
  contextLength: string;
  provider: string;
  isFree?: boolean;
  tags?: string[];
}

export const OPENROUTER_FREE_MODEL_IDS: string[] = [
  "openrouter/owl-alpha",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "poolside/laguna-m.1:free",
  "openai/gpt-oss-120b:free",
  "z-ai/glm-4.5-air:free",
  "poolside/laguna-xs.2:free",
  "openai/gpt-oss-20b:free",
  "nvidia/nemotron-3-nano-30b-a3b:free",
  "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
  "google/gemma-4-31b-it:free",
  "deepseek/deepseek-v4-flash:free",
  "nvidia/nemotron-nano-9b-v2:free",
  "minimax/minimax-m2.5:free",
  "nvidia/nemotron-nano-12b-2-vl:free",
  "google/gemma-4-26b-a4b-it:free",
];

const OPENROUTER_FREE_MODEL_ID_SET = new Set(OPENROUTER_FREE_MODEL_IDS);

export function isOpenRouterFreeModel(modelId: string): boolean {
  return OPENROUTER_FREE_MODEL_ID_SET.has(modelId);
}

export const FEATURED_MODEL_IDS: string[] = [
// OpenAI
"openai/gpt-chat-latest",
"~openai/gpt-latest",
"openai/gpt-4o",
"openai/gpt-4o-mini",
"openai/o1",
"openai/o3-mini",

// Anthropic
"~anthropic/claude-sonnet-latest",
"~anthropic/claude-opus-latest",
"~anthropic/claude-haiku-latest",
"anthropic/claude-3.5-haiku",

// Google
"~google/gemini-pro-latest",
"~google/gemini-flash-latest",
"google/gemini-2.0-flash-001",

// DeepSeek
"deepseek/deepseek-r1",
"deepseek/deepseek-chat",

// Meta / Mistral / Qwen (popular open models)
"meta-llama/llama-3.3-70b-instruct",
"meta-llama/llama-3.3-70b-instruct:free",
"mistralai/mistral-medium-3-5",
"mistralai/mixtral-8x22b-instruct",
"qwen/qwen-2.5-coder-32b-instruct",

// Search / routing
"perplexity/sonar",
"openrouter/auto",

// OpenRouter Free
...OPENROUTER_FREE_MODEL_IDS,
];

const FEATURED_MODEL_ID_SET = new Set(FEATURED_MODEL_IDS);

export function isFeaturedModel(modelId: string): boolean {
  return FEATURED_MODEL_ID_SET.has(modelId);
}

export const MODELS: AIModel[] = [
  { name: "OpenRouter: Owl Alpha (free)", id: "openrouter/owl-alpha", contextLength: "1.05M", provider: "OpenRouter", isFree: true },
  { name: "NVIDIA: Nemotron 3 Super (free)", id: "nvidia/nemotron-3-super-120b-a12b:free", contextLength: "1.0M", provider: "NVIDIA", isFree: true },
  { name: "Poolside: Laguna M.1 (free)", id: "poolside/laguna-m.1:free", contextLength: "262K", provider: "Poolside", isFree: true },
  { name: "OpenAI: gpt-oss-120b (free)", id: "openai/gpt-oss-120b:free", contextLength: "131K", provider: "OpenAI", isFree: true },
  { name: "Z.ai: GLM 4.5 Air (free)", id: "z-ai/glm-4.5-air:free", contextLength: "131K", provider: "Z.ai", isFree: true },
  { name: "Poolside: Laguna XS.2 (free)", id: "poolside/laguna-xs.2:free", contextLength: "262K", provider: "Poolside", isFree: true },
  { name: "OpenAI: gpt-oss-20b (free)", id: "openai/gpt-oss-20b:free", contextLength: "131K", provider: "OpenAI", isFree: true },
  { name: "NVIDIA: Nemotron 3 Nano 30B A3B (free)", id: "nvidia/nemotron-3-nano-30b-a3b:free", contextLength: "256K", provider: "NVIDIA", isFree: true },
  { name: "NVIDIA: Nemotron 3 Nano Omni (free)", id: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free", contextLength: "256K", provider: "NVIDIA", isFree: true },
  { name: "Google: Gemma 4 31B (free)", id: "google/gemma-4-31b-it:free", contextLength: "262K", provider: "Google", isFree: true },
  { name: "DeepSeek: DeepSeek V4 Flash (free)", id: "deepseek/deepseek-v4-flash:free", contextLength: "1.05M", provider: "DeepSeek", isFree: true },
  { name: "NVIDIA: Nemotron Nano 9B V2 (free)", id: "nvidia/nemotron-nano-9b-v2:free", contextLength: "128K", provider: "NVIDIA", isFree: true },
  { name: "MiniMax: MiniMax M2.5 (free)", id: "minimax/minimax-m2.5:free", contextLength: "262K", provider: "MiniMax", isFree: true },
  { name: "NVIDIA: Nemotron Nano 12B 2 VL (free)", id: "nvidia/nemotron-nano-12b-2-vl:free", contextLength: "128K", provider: "NVIDIA", isFree: true },
  { name: "Google: Gemma 4 26B A4B (free)", id: "google/gemma-4-26b-a4b-it:free", contextLength: "262K", provider: "Google", isFree: true },
  { name: "Qwen: Qwen3.7 Max", id: "qwen/qwen3.7-max", contextLength: "1.0M", provider: "Qwen" },
  { name: "xAI: Grok Build 0.1", id: "x-ai/grok-build-0.1", contextLength: "256K", provider: "xAI" },
  { name: "Google: Gemini 3.5 Flash", id: "google/gemini-3.5-flash", contextLength: "1.0M", provider: "Google" },
  { name: "Anthropic: Claude Opus 4.7 (Fast)", id: "anthropic/claude-opus-4.7-fast", contextLength: "1.0M", provider: "Anthropic" },
  { name: "Google: Gemini 3.1 Flash Lite", id: "google/gemini-3.1-flash-lite", contextLength: "1.0M", provider: "Google" },
  { name: "OpenAI: GPT Chat Latest", id: "openai/gpt-chat-latest", contextLength: "400K", provider: "OpenAI" },
  { name: "xAI: Grok 4.3", id: "x-ai/grok-4.3", contextLength: "1.0M", provider: "xAI" },
  { name: "IBM: Granite 4.1 8B", id: "ibm-granite/granite-4.1-8b", contextLength: "131K", provider: "IBM" },
  { name: "Mistral: Mistral Medium 3.5", id: "mistralai/mistral-medium-3-5", contextLength: "262K", provider: "Mistral" },

  { name: "Anthropic Claude Haiku Latest", id: "~anthropic/claude-haiku-latest", contextLength: "200K", provider: "Anthropic" },
  { name: "OpenAI GPT Mini Latest", id: "~openai/gpt-mini-latest", contextLength: "400K", provider: "OpenAI" },
  { name: "Google Gemini Pro Latest", id: "~google/gemini-pro-latest", contextLength: "1.0M", provider: "Google" },
  { name: "MoonshotAI Kimi Latest", id: "~moonshotai/kimi-latest", contextLength: "262K", provider: "MoonshotAI" },
  { name: "Google Gemini Flash Latest", id: "~google/gemini-flash-latest", contextLength: "1.0M", provider: "Google" },
  { name: "Anthropic Claude Sonnet Latest", id: "~anthropic/claude-sonnet-latest", contextLength: "1.0M", provider: "Anthropic" },
  { name: "OpenAI GPT Latest", id: "~openai/gpt-latest", contextLength: "1.1M", provider: "OpenAI" },
  { name: "Qwen: Qwen3.6 Flash", id: "qwen/qwen3.6-flash", contextLength: "1.0M", provider: "Qwen" },
  { name: "Qwen: Qwen3.6 Max Preview", id: "qwen/qwen3.6-max-preview", contextLength: "262K", provider: "Qwen" },
  { name: "Qwen: Qwen3.6 27B", id: "qwen/qwen3.6-27b", contextLength: "262K", provider: "Qwen" },
  { name: "OpenAI: GPT-5.5 Pro", id: "openai/gpt-5.5-pro", contextLength: "1.1M", provider: "OpenAI" },
  { name: "OpenAI: GPT-5.5", id: "openai/gpt-5.5", contextLength: "1.1M", provider: "OpenAI" },
  { name: "DeepSeek: DeepSeek V4 Pro", id: "deepseek/deepseek-v4-pro", contextLength: "1.0M", provider: "DeepSeek" },
  { name: "DeepSeek: DeepSeek V4 Flash (free)", id: "deepseek/deepseek-v4-flash:free", contextLength: "1.0M", provider: "DeepSeek", isFree: true },
  { name: "DeepSeek: DeepSeek V4 Flash", id: "deepseek/deepseek-v4-flash", contextLength: "1.0M", provider: "DeepSeek" },
  { name: "Tencent: Hy3 preview", id: "tencent/hy3-preview", contextLength: "262K", provider: "Tencent" },
  { name: "Xiaomi: MiMo-V2.5-Pro", id: "xiaomi/mimo-v2.5-pro", contextLength: "1.0M", provider: "Xiaomi" },
  { name: "Xiaomi: MiMo-V2.5", id: "xiaomi/mimo-v2.5", contextLength: "1.0M", provider: "Xiaomi" },
  { name: "Anthropic: Claude Opus Latest", id: "~anthropic/claude-opus-latest", contextLength: "1.0M", provider: "Anthropic" },
  { name: "MoonshotAI: Kimi K2.6", id: "moonshotai/kimi-k2.6", contextLength: "262K", provider: "MoonshotAI" },
  { name: "Anthropic: Claude Opus 4.7", id: "anthropic/claude-opus-4.7", contextLength: "1.0M", provider: "Anthropic" },
  { name: "Anthropic: Claude Opus 4.6 (Fast)", id: "anthropic/claude-opus-4.6-fast", contextLength: "1.0M", provider: "Anthropic" },
  { name: "Z.ai: GLM 5.1", id: "z-ai/glm-5.1", contextLength: "203K", provider: "Z.ai" },
  { name: "Google: Gemma 4 31B", id: "google/gemma-4-31b-it", contextLength: "262K", provider: "Google" },
  { name: "Qwen: Qwen3.6 Plus", id: "qwen/qwen3.6-plus", contextLength: "1.0M", provider: "Qwen" },
  { name: "Arcee AI: Trinity Large Thinking (free)", id: "arcee-ai/trinity-large-thinking:free", contextLength: "262K", provider: "Arcee AI", isFree: true },
  { name: "Arcee AI: Trinity Large Thinking", id: "arcee-ai/trinity-large-thinking", contextLength: "262K", provider: "Arcee AI" },
  { name: "xAI: Grok 4.20 Multi-Agent", id: "x-ai/grok-4.20-multi-agent", contextLength: "2.0M", provider: "xAI" },
  { name: "xAI: Grok 4.20", id: "x-ai/grok-4.20", contextLength: "2.0M", provider: "xAI" },
  { name: "Kwaipilot: KAT-Coder-Pro V2", id: "kwaipilot/kat-coder-pro-v2", contextLength: "256K", provider: "Kwaipilot" },
  { name: "Xiaomi: MiMo-V2-Pro", id: "xiaomi/mimo-v2-pro", contextLength: "1.0M", provider: "Xiaomi" },
  { name: "MiniMax: MiniMax M2.7", id: "minimax/minimax-m2.7", contextLength: "205K", provider: "MiniMax" },
  { name: "OpenAI: GPT-5.4 Nano", id: "openai/gpt-5.4-nano", contextLength: "400K", provider: "OpenAI" },
  { name: "OpenAI: GPT-5.4 Mini", id: "openai/gpt-5.4-mini", contextLength: "400K", provider: "OpenAI" },
  { name: "Mistral: Mistral Small 4", id: "mistralai/mistral-small-2603", contextLength: "262K", provider: "Mistral" },
  { name: "NVIDIA: Nemotron 3 Super", id: "nvidia/nemotron-3-super-120b-a12b", contextLength: "1.0M", provider: "NVIDIA" },
  { name: "Qwen: Qwen3.5-9B", id: "qwen/qwen3.5-9b", contextLength: "262K", provider: "Qwen" },
  { name: "OpenAI: GPT-5.4 Pro", id: "openai/gpt-5.4-pro", contextLength: "1.1M", provider: "OpenAI" },
  { name: "OpenAI: GPT-5.4", id: "openai/gpt-5.4", contextLength: "1.1M", provider: "OpenAI" },
  { name: "Google: Gemini 3.1 Flash Lite Preview", id: "google/gemini-3.1-flash-lite-preview", contextLength: "1.0M", provider: "Google" },
  { name: "Qwen: Qwen3.5-35B-A3B", id: "qwen/qwen3.5-35b-a3b", contextLength: "262K", provider: "Qwen" },
  { name: "Qwen: Qwen3.5-27B", id: "qwen/qwen3.5-27b", contextLength: "262K", provider: "Qwen" },
  { name: "Qwen: Qwen3.5-122B-A10B", id: "qwen/qwen3.5-122b-a10b", contextLength: "262K", provider: "Qwen" },
  { name: "Google: Gemini 3.1 Pro Preview", id: "google/gemini-3.1-pro-preview", contextLength: "1.0M", provider: "Google" },
  { name: "Anthropic: Claude Sonnet 4.6", id: "anthropic/claude-sonnet-4.6", contextLength: "1.0M", provider: "Anthropic" },
  { name: "MiniMax: MiniMax M2.5", id: "minimax/minimax-m2.5", contextLength: "205K", provider: "MiniMax" },
  { name: "Qwen: Qwen3 Max Thinking", id: "qwen/qwen3-max-thinking", contextLength: "262K", provider: "Qwen", tags: ["reasoning"] },
  { name: "Anthropic: Claude Opus 4.6", id: "anthropic/claude-opus-4.6", contextLength: "1.0M", provider: "Anthropic" },
  { name: "Qwen: Qwen3 Coder Next", id: "qwen/qwen3-coder-next", contextLength: "262K", provider: "Qwen", tags: ["code"] },
  { name: "MoonshotAI: Kimi K2.5", id: "moonshotai/kimi-k2.5", contextLength: "262K", provider: "MoonshotAI" },
  { name: "Writer: Palmyra X5", id: "writer/palmyra-x5", contextLength: "1.0M", provider: "Writer" },
  { name: "OpenAI: GPT-5.2-Codex", id: "openai/gpt-5.2-codex", contextLength: "400K", provider: "OpenAI", tags: ["code"] },
  { name: "OpenAI: GPT-5.2 Pro", id: "openai/gpt-5.2-pro", contextLength: "400K", provider: "OpenAI" },
  { name: "OpenAI: GPT-5.2", id: "openai/gpt-5.2", contextLength: "400K", provider: "OpenAI" },
  { name: "Mistral: Devstral 2 2512", id: "mistralai/devstral-2512", contextLength: "262K", provider: "Mistral", tags: ["code"] },
  { name: "DeepSeek: DeepSeek V3.2", id: "deepseek/deepseek-v3.2", contextLength: "131K", provider: "DeepSeek" },
  { name: "Anthropic: Claude Opus 4.5", id: "anthropic/claude-opus-4.5", contextLength: "200K", provider: "Anthropic" },
  { name: "Deep Cogito: Cogito v2.1 671B", id: "deepcogito/cogito-v2.1-671b", contextLength: "128K", provider: "Deep Cogito", tags: ["reasoning"] },
  { name: "OpenAI: GPT-5.1", id: "openai/gpt-5.1", contextLength: "400K", provider: "OpenAI" },
  { name: "OpenAI: GPT-5.1-Codex", id: "openai/gpt-5.1-codex", contextLength: "400K", provider: "OpenAI", tags: ["code"] },
  { name: "OpenAI: GPT-5.1-Codex-Mini", id: "openai/gpt-5.1-codex-mini", contextLength: "400K", provider: "OpenAI", tags: ["code"] },
  { name: "MoonshotAI: Kimi K2 Thinking", id: "moonshotai/kimi-k2-thinking", contextLength: "262K", provider: "MoonshotAI", tags: ["reasoning"] },
  { name: "Perplexity: Sonar Pro Search", id: "perplexity/sonar-pro-search", contextLength: "200K", provider: "Perplexity", tags: ["search"] },
  { name: "MiniMax: MiniMax M2", id: "minimax/minimax-m2", contextLength: "205K", provider: "MiniMax" },
  { name: "Qwen: Qwen3 VL 32B Instruct", id: "qwen/qwen3-vl-32b-instruct", contextLength: "262K", provider: "Qwen" },
  { name: "OpenAI: GPT-5 Image Mini", id: "openai/gpt-5-image-mini", contextLength: "400K", provider: "OpenAI" },
  { name: "Anthropic: Claude Haiku 4.5", id: "anthropic/claude-haiku-4.5", contextLength: "200K", provider: "Anthropic" },
  { name: "OpenAI: GPT-5 Image", id: "openai/gpt-5-image", contextLength: "400K", provider: "OpenAI" },
  { name: "OpenAI: o3 Deep Research", id: "openai/o3-deep-research", contextLength: "200K", provider: "OpenAI", tags: ["reasoning"] },
  { name: "Google: Gemini 2.5 Flash Lite Preview 09-2025", id: "google/gemini-2.5-flash-lite-preview-09-2025", contextLength: "1.0M", provider: "Google" },
  { name: "Qwen: Qwen3 Max", id: "qwen/qwen3-max", contextLength: "262K", provider: "Qwen", tags: ["reasoning"] },
  { name: "Qwen: Qwen3 Coder Plus", id: "qwen/qwen3-coder-plus", contextLength: "1.0M", provider: "Qwen", tags: ["code"] },
  { name: "OpenAI: GPT-5 Codex", id: "openai/gpt-5-codex", contextLength: "400K", provider: "OpenAI", tags: ["code"] },
  { name: "Qwen: Qwen3 Coder Flash", id: "qwen/qwen3-coder-flash", contextLength: "1.0M", provider: "Qwen", tags: ["code"] },
  { name: "Qwen: Qwen3 Coder 480B A35B (free)", id: "qwen/qwen3-coder:free", contextLength: "1.0M", provider: "Qwen", isFree: true, tags: ["code"] },
  { name: "Qwen: Qwen3 Coder 480B A35B", id: "qwen/qwen3-coder", contextLength: "1.0M", provider: "Qwen", tags: ["code"] },
  { name: "Google: Gemini 2.5 Flash Lite", id: "google/gemini-2.5-flash-lite", contextLength: "1.0M", provider: "Google" },
  { name: "MoonshotAI: Kimi K2", id: "moonshotai/kimi-k2", contextLength: "131K", provider: "MoonshotAI" },
  { name: "Mistral: Devstral Medium", id: "mistralai/devstral-medium", contextLength: "131K", provider: "Mistral", tags: ["code"] },
  { name: "Mistral: Devstral Small 1.1", id: "mistralai/devstral-small", contextLength: "131K", provider: "Mistral", tags: ["code"] },
  { name: "Tencent: Hunyuan A13B Instruct", id: "tencent/hunyuan-a13b-instruct", contextLength: "131K", provider: "Tencent" },
  { name: "Baidu: ERNIE 4.5 300B A47B", id: "baidu/ernie-4.5-300b-a47b", contextLength: "131K", provider: "Baidu" },
  { name: "Mistral: Mistral Small 3.2 24B", id: "mistralai/mistral-small-3.2-24b-instruct", contextLength: "128K", provider: "Mistral" },
  { name: "MiniMax: MiniMax M1", id: "minimax/minimax-m1", contextLength: "1.0M", provider: "MiniMax" },
  { name: "Google: Gemini 2.5 Flash", id: "google/gemini-2.5-flash", contextLength: "1.0M", provider: "Google" },
  { name: "Google: Gemini 2.5 Pro", id: "google/gemini-2.5-pro", contextLength: "1.0M", provider: "Google", tags: ["reasoning"] },
  { name: "OpenAI: o3 Pro", id: "openai/o3-pro", contextLength: "200K", provider: "OpenAI", tags: ["reasoning"] },
  { name: "DeepSeek: R1 0528", id: "deepseek/deepseek-r1-0528", contextLength: "164K", provider: "DeepSeek", tags: ["reasoning"] },
  { name: "Anthropic: Claude Opus 4", id: "anthropic/claude-opus-4", contextLength: "200K", provider: "Anthropic", tags: ["reasoning"] },
  { name: "Anthropic: Claude Sonnet 4", id: "anthropic/claude-sonnet-4", contextLength: "1.0M", provider: "Anthropic" },
  { name: "Arcee AI: Maestro Reasoning", id: "arcee-ai/maestro-reasoning", contextLength: "131K", provider: "Arcee AI", tags: ["reasoning"] },
  { name: "Arcee AI: Coder Large", id: "arcee-ai/coder-large", contextLength: "33K", provider: "Arcee AI", tags: ["code"] },
  { name: "Qwen: Qwen3 30B A3B", id: "qwen/qwen3-30b-a3b", contextLength: "131K", provider: "Qwen" },
  { name: "Qwen: Qwen3 8B", id: "qwen/qwen3-8b", contextLength: "131K", provider: "Qwen" },
  { name: "Qwen: Qwen3 14B", id: "qwen/qwen3-14b", contextLength: "132K", provider: "Qwen" },
  { name: "Qwen: Qwen3 32B", id: "qwen/qwen3-32b", contextLength: "131K", provider: "Qwen" },
  { name: "Qwen: Qwen3 235B A22B", id: "qwen/qwen3-235b-a22b", contextLength: "131K", provider: "Qwen", tags: ["reasoning"] },
  { name: "OpenAI: o4 Mini High", id: "openai/o4-mini-high", contextLength: "200K", provider: "OpenAI", tags: ["reasoning"] },
  { name: "OpenAI: o3", id: "openai/o3", contextLength: "200K", provider: "OpenAI", tags: ["reasoning"] },
  { name: "OpenAI: o4 Mini", id: "openai/o4-mini", contextLength: "200K", provider: "OpenAI", tags: ["reasoning"] },
  { name: "OpenAI: GPT-4.1", id: "openai/gpt-4.1", contextLength: "1.0M", provider: "OpenAI" },
  { name: "OpenAI: GPT-4.1 Mini", id: "openai/gpt-4.1-mini", contextLength: "1.0M", provider: "OpenAI" },
  { name: "OpenAI: GPT-4.1 Nano", id: "openai/gpt-4.1-nano", contextLength: "1.0M", provider: "OpenAI" },
  { name: "Meta: Llama 4 Maverick", id: "meta-llama/llama-4-maverick", contextLength: "1.0M", provider: "Meta" },
  { name: "Meta: Llama 4 Scout", id: "meta-llama/llama-4-scout", contextLength: "10.0M", provider: "Meta" },
  { name: "DeepSeek: DeepSeek V3 0324", id: "deepseek/deepseek-chat-v3-0324", contextLength: "164K", provider: "DeepSeek" },
  { name: "Mistral: Mistral Small 3.1 24B", id: "mistralai/mistral-small-3.1-24b-instruct", contextLength: "128K", provider: "Mistral" },
  { name: "Google: Gemma 3 27B", id: "google/gemma-3-27b-it", contextLength: "131K", provider: "Google" },
  { name: "Perplexity: Sonar Reasoning Pro", id: "perplexity/sonar-reasoning-pro", contextLength: "128K", provider: "Perplexity", tags: ["reasoning", "search"] },
  { name: "Perplexity: Sonar Pro", id: "perplexity/sonar-pro", contextLength: "200K", provider: "Perplexity", tags: ["search"] },
  { name: "Perplexity: Sonar Deep Research", id: "perplexity/sonar-deep-research", contextLength: "128K", provider: "Perplexity", tags: ["search"] },
  { name: "Google: Gemini 2.0 Flash", id: "google/gemini-2.0-flash-001", contextLength: "1.0M", provider: "Google" },
  { name: "OpenAI: o3 Mini", id: "openai/o3-mini", contextLength: "200K", provider: "OpenAI", tags: ["reasoning"] },
  { name: "DeepSeek: R1 Distill Qwen 32B", id: "deepseek/deepseek-r1-distill-qwen-32b", contextLength: "128K", provider: "DeepSeek", tags: ["reasoning"] },
  { name: "DeepSeek: R1 Distill Llama 70B", id: "deepseek/deepseek-r1-distill-llama-70b", contextLength: "131K", provider: "DeepSeek", tags: ["reasoning"] },
  { name: "DeepSeek: R1", id: "deepseek/deepseek-r1", contextLength: "164K", provider: "DeepSeek", tags: ["reasoning"] },
  { name: "DeepSeek: DeepSeek V3", id: "deepseek/deepseek-chat", contextLength: "164K", provider: "DeepSeek" },
  { name: "OpenAI: o1", id: "openai/o1", contextLength: "200K", provider: "OpenAI", tags: ["reasoning"] },
  { name: "Meta: Llama 3.3 70B Instruct (free)", id: "meta-llama/llama-3.3-70b-instruct:free", contextLength: "131K", provider: "Meta", isFree: true },
  { name: "Meta: Llama 3.3 70B Instruct", id: "meta-llama/llama-3.3-70b-instruct", contextLength: "131K", provider: "Meta" },
  { name: "OpenAI: GPT-4o (2024-11-20)", id: "openai/gpt-4o-2024-11-20", contextLength: "128K", provider: "OpenAI" },
  { name: "Qwen2.5 Coder 32B Instruct", id: "qwen/qwen-2.5-coder-32b-instruct", contextLength: "128K", provider: "Qwen", tags: ["code"] },
  { name: "Anthropic: Claude 3.5 Haiku", id: "anthropic/claude-3.5-haiku", contextLength: "200K", provider: "Anthropic" },
  { name: "OpenAI: GPT-4o-mini", id: "openai/gpt-4o-mini", contextLength: "128K", provider: "OpenAI" },
  { name: "OpenAI: GPT-4o", id: "openai/gpt-4o", contextLength: "128K", provider: "OpenAI" },
  { name: "Meta: Llama 3 70B Instruct", id: "meta-llama/llama-3-70b-instruct", contextLength: "8K", provider: "Meta" },
  { name: "Mistral: Mixtral 8x22B Instruct", id: "mistralai/mixtral-8x22b-instruct", contextLength: "66K", provider: "Mistral" },
  { name: "OpenAI: GPT-4 Turbo", id: "openai/gpt-4-turbo", contextLength: "128K", provider: "OpenAI" },
  { name: "Anthropic: Claude 3 Haiku", id: "anthropic/claude-3-haiku", contextLength: "200K", provider: "Anthropic" },
  { name: "Auto Router", id: "openrouter/auto", contextLength: "2.0M", provider: "OpenRouter" },
  { name: "OpenAI: GPT-3.5 Turbo", id: "openai/gpt-3.5-turbo", contextLength: "16K", provider: "OpenAI" },
  { name: "OpenAI: GPT-4", id: "openai/gpt-4", contextLength: "8K", provider: "OpenAI" },
  { name: "Nous: Hermes 4 70B", id: "nousresearch/hermes-4-70b", contextLength: "131K", provider: "Nous" },
  { name: "Nous: Hermes 4 405B", id: "nousresearch/hermes-4-405b", contextLength: "131K", provider: "Nous" },
  { name: "Perplexity: Sonar", id: "perplexity/sonar", contextLength: "127K", provider: "Perplexity", tags: ["search"] },
];

export const FEATURED_MODELS: AIModel[] = MODELS.filter((m) => isFeaturedModel(m.id));

export const OPENROUTER_FREE_MODELS: AIModel[] = MODELS.filter((m) => isOpenRouterFreeModel(m.id));

export const PROVIDER_COLORS: Record<string, string> = {
  OpenAI: "#10a37f",
  Anthropic: "#cc785c",
  Google: "#4285f4",
  DeepSeek: "#0066cc",
  Qwen: "#6366f1",
  Meta: "#0668e1",
  Mistral: "#ff7000",
  xAI: "#1da1f2",
  Perplexity: "#20b2aa",
  NVIDIA: "#76b900",
  MoonshotAI: "#7c3aed",
  MiniMax: "#ec4899",
  OpenRouter: "#ef4444",
  Default: "#6b7280",
};

export function getProviderColor(provider: string): string {
  return PROVIDER_COLORS[provider] ?? PROVIDER_COLORS.Default;
}

// Models specifically good for reasoning/debate
export const REASONING_MODELS = MODELS.filter(m => m.tags?.includes("reasoning")).slice(0, 5);

// Default 5 models for initial state
export const DEFAULT_MODELS = [
  MODELS.find(m => m.id === "openrouter/owl-alpha") ?? MODELS[0],
  MODELS.find(m => m.id === "nvidia/nemotron-3-super-120b-a12b:free") ?? MODELS[1],
  MODELS.find(m => m.id === "openai/gpt-oss-120b:free") ?? MODELS[3],
  MODELS.find(m => m.id === "deepseek/deepseek-v4-flash:free") ?? MODELS[10],
  MODELS.find(m => m.id === "google/gemma-4-31b-it:free") ?? MODELS[9],
];
