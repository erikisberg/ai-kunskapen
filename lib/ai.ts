import { gateway } from "ai";

// AI Gateway — uses AI_GATEWAY_API_KEY env var automatically
export const exerciseModel = gateway("anthropic/claude-haiku-4.5");

export const MAX_MESSAGES_DEFAULT = 10;

export const RATE_LIMIT = {
  maxRequests: 20,
  windowMs: 10 * 60 * 1000,
};
