// src/lib/schema.ts
import { pgTable, serial, text, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: varchar("id", { length: 36 }).primaryKey(),        // supabase auth uid
    role: varchar("role", { length: 16 }).notNull().default("student"), // student|mentor|admin
    createdAt: timestamp("created_at").defaultNow(),
});

export const courses = pgTable("courses", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    slug: varchar("slug", { length: 120 }).notNull().unique(),
    lang: varchar("lang", { length: 5 }).notNull().default("en"), // en|fr|ar
    published: boolean("published").notNull().default(false),
    createdBy: varchar("created_by", { length: 36 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});
export const modules = pgTable("modules", {
    id: serial("id").primaryKey(),
    courseId: integer("course_id").notNull(),
    title: text("title").notNull(),
    order: integer("order").notNull().default(0),
});

export const lessons = pgTable("lessons", {
    id: serial("id").primaryKey(),
    moduleId: integer("module_id").notNull(),
    title: text("title").notNull(),
    content: text("content").notNull(), // markdown/portable text
    order: integer("order").notNull().default(0),
});

export const quizzes = pgTable("quizzes", {
    id: serial("id").primaryKey(),
    lessonId: integer("lesson_id").notNull(),
    question: text("question").notNull(),
    options: text("options").notNull(),   // JSON stringified
    answerIndex: integer("answer_index").notNull(),
});

export const progress = pgTable("progress", {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 36 }).notNull(),
    lessonId: integer("lesson_id").notNull(),
    completed: boolean("completed").notNull().default(false),
    score: integer("score"),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const helpRequests = pgTable("help_requests", {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 36 }).notNull(),
    courseId: integer("course_id").notNull(),
    message: text("message").notNull(),
    status: varchar("status", { length: 16 }).notNull().default("open"), // open|claimed|done
    createdAt: timestamp("created_at").defaultNow(),
});
