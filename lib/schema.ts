import {
  pgTable,
  text,
  timestamp,
  uuid,
  primaryKey,
  integer,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

// --- Enums ---

export const invitationStatusEnum = pgEnum("invitation_status", [
  "pending",
  "accepted",
  "expired",
]);

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

// --- Organizations ---

export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logoUrl: text("logo_url"),
  industry: text("industry"),           // "Bygg", "Vård", "IT", etc.
  description: text("description"),      // Kort om vad företaget gör
  employeeCount: integer("employee_count"),
  aiContext: text("ai_context"),         // Extra kontext för LLM-prompter
  charityName: text("charity_name"),
  pricePerUser: integer("price_per_user").default(20000), // öre (200 kr)
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

// --- Auth.js required tables ---

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  name: text("name"),
  image: text("image"),
  orgId: uuid("org_id").references(() => organizations.id),
  role: userRoleEnum("role").default("user").notNull(),
  onboarded: boolean("onboarded").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ]
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
);

// --- Invitations ---

export const invitations = pgTable("invitations", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  status: invitationStatusEnum("status").default("pending").notNull(),
  sentAt: timestamp("sent_at", { mode: "date" }),
  acceptedAt: timestamp("accepted_at", { mode: "date" }),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

// --- App tables ---

export const progress = pgTable("progress", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  courseSlug: text("course_slug").notNull(),
  moduleSlug: text("module_slug").notNull(),
  completedAt: timestamp("completed_at", { mode: "date" }).defaultNow().notNull(),
});

export const anonymousStats = pgTable("anonymous_stats", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseSlug: text("course_slug").notNull(),
  moduleSlug: text("module_slug").notNull(),
  eventType: text("event_type").notNull(), // 'module_started' | 'module_completed'
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});
