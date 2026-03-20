import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getDb } from "./db";
import * as schema from "./schema";

// Lazy-init auth — DATABASE_URL may not be set during build
function createAuth() {
  return NextAuth({
    adapter: DrizzleAdapter(getDb(), {
      usersTable: schema.users,
      accountsTable: schema.accounts,
      sessionsTable: schema.sessions,
      verificationTokensTable: schema.verificationTokens,
    }),
    session: { strategy: "jwt" },
    pages: {
      signIn: "/login",
      error: "/login",
    },
    callbacks: {
      jwt({ token, user }) {
        if (user) {
          token.id = user.id;
        }
        return token;
      },
      session({ session, token }) {
        if (session.user && token.id) {
          session.user.id = token.id as string;
        }
        return session;
      },
    },
    providers: [],
  });
}

// Export lazy wrappers that only init when called at runtime
export async function auth() {
  if (!process.env.DATABASE_URL) return null;
  const { auth: authFn } = createAuth();
  return authFn();
}

export const handlers = {
  GET: async (...args: any[]) => {
    if (!process.env.DATABASE_URL) {
      return new Response("Auth not configured", { status: 503 });
    }
    const { handlers: h } = createAuth();
    return (h.GET as Function)(...args);
  },
  POST: async (...args: any[]) => {
    if (!process.env.DATABASE_URL) {
      return new Response("Auth not configured", { status: 503 });
    }
    const { handlers: h } = createAuth();
    return (h.POST as Function)(...args);
  },
};

export async function signIn(...args: Parameters<typeof import("next-auth")["default"]>) {
  if (!process.env.DATABASE_URL) return;
  const { signIn: fn } = createAuth();
  return (fn as Function)(...args);
}

export async function signOut() {
  if (!process.env.DATABASE_URL) return;
  const { signOut: fn } = createAuth();
  return (fn as Function)();
}
