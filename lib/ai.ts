import { gateway } from "ai";

// AI Gateway — uses API key if available, falls back to OIDC
export const exerciseModel = gateway("anthropic/claude-haiku-4.5", {
  apiKey: process.env.AI_GATEWAY_API_KEY,
});

export const MAX_MESSAGES_DEFAULT = 10;

export const RATE_LIMIT = {
  maxRequests: 20,
  windowMs: 10 * 60 * 1000,
};
