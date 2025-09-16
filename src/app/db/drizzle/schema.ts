// src/lib/schema.ts
import { pgTable, serial, text, integer, boolean, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum('status', ['open', 'closed', 'in_progress', 'resolved']);

export const helpRequests = pgTable("help_requests", {
    id: serial("id").primaryKey(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    course: text("course").notNull(),
    description: text("message").notNull(),
    status: statusEnum("status", { length: 16 }).notNull().default("open"), // open|closed|in_progress|resolved
    createdAt: timestamp("created_at").defaultNow(),
});


