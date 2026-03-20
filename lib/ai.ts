// AI Gateway model — routes through Vercel AI Gateway automatically
// No API keys needed with OIDC auth (vercel env pull provisions credentials)
export const EXERCISE_MODEL = "anthropic/claude-haiku-4-5";

// Default max messages per chat exercise (overridable per slide in CMS)
export const MAX_MESSAGES_DEFAULT = 10;

// Rate limit: max requests per IP within the time window
export const RATE_LIMIT = {
  maxRequests: 20,
  windowMs: 10 * 60 * 1000, // 10 minutes
};
