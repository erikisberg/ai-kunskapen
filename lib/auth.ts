// Auth is optional — only active when DATABASE_URL + EMAIL_SERVER are configured
// For v1 demo, auth is disabled. Enable by setting env vars.

export async function auth(): Promise<null> {
  return null;
}

export const handlers = {
  GET: () => new Response("Auth not configured yet", { status: 503 }),
  POST: () => new Response("Auth not configured yet", { status: 503 }),
};

export async function signIn() {}
export async function signOut() {}
