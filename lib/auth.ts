import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getDb } from "./db";
import * as schema from "./schema";

// Cache the auth instance — must be same instance across requests
let _authInstance: ReturnType<typeof NextAuth> | null = null;

function getAuth() {
  if (!_authInstance) {
    _authInstance = NextAuth({
      adapter: DrizzleAdapter(getDb(), {
        usersTable: schema.users,
        accountsTable: schema.accounts,
        sessionsTable: schema.sessions,
        verificationTokensTable: schema.verificationTokens,
      }),
      session: { strategy: "jwt" },
      secret: process.env.AUTH_SECRET,
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
  return _authInstance;
}

export async function auth() {
  if (!process.env.DATABASE_URL) return null;
  try {
    const { auth: authFn } = getAuth();
    return await authFn();
  } catch {
    return null;
  }
}

export const handlers = {
  GET: async (...args: any[]) => {
    if (!process.env.DATABASE_URL) {
      return new Response("Auth not configured", { status: 503 });
    }
    const { handlers: h } = getAuth();
    return (h.GET as Function)(...args);
  },
  POST: async (...args: any[]) => {
    if (!process.env.DATABASE_URL) {
      return new Response("Auth not configured", { status: 503 });
    }
    const { handlers: h } = getAuth();
    return (h.POST as Function)(...args);
  },
};

export async function signIn(...args: any[]) {
  if (!process.env.DATABASE_URL) return;
  const { signIn: fn } = getAuth();
  return (fn as Function)(...args);
}

export async function signOut() {
  if (!process.env.DATABASE_URL) return;
  const { signOut: fn } = getAuth();
  return (fn as Function)();
}
