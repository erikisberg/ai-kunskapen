import { auth } from "./auth";
import { eq } from "drizzle-orm";
import { db } from "./db";
import * as schema from "./schema";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim()).filter(Boolean);

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, session.user.id))
    .limit(1);

  if (!user) return null;

  // Admin if: role is admin OR email is in ADMIN_EMAILS env var
  if (user.role !== "admin" && !ADMIN_EMAILS.includes(user.email)) {
    return null;
  }

  return user;
}
