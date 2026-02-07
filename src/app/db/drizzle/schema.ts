import { pgTable, text, timestamp, uuid, jsonb, boolean, pgEnum, integer } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['student', 'mentor', 'admin']);
export const ticketStatusEnum = pgEnum('ticket_status', ['open', 'pending', 'resolved']);

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    role: userRoleEnum('role').default('student'),
    bio: text('bio'),
    educationLevel: text('education_level'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const ticketPriorityEnum = pgEnum('ticket_priority', ['low', 'medium', 'high']);
export const ticketInputTypeEnum = pgEnum('ticket_input_type', ['text', 'audio', 'image', 'document']);

export const tickets = pgTable('tickets', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    status: ticketStatusEnum('status').default('open'),
    priority: ticketPriorityEnum('priority').default('medium'),
    inputType: ticketInputTypeEnum('input_type').default('text'),
    contentUrl: text('content_url'),
    aiMetadata: jsonb('ai_metadata'), // Stores depth estimation, object detection, etc.
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// ... existing users/tickets tables ...

export const courses = pgTable('courses', {
    id: text('id').primaryKey(), // slug like 'calculus', 'linear-algebra'
    title: text('title').notNull(),
    description: text('description').notNull(),
    iconName: text('icon_name').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const modules = pgTable('modules', {
    id: uuid('id').primaryKey().defaultRandom(),
    courseId: text('course_id').references(() => courses.id).notNull(),
    title: text('title').notNull(),
    orderIndex: integer('order_index').notNull(),
    contentMarkdown: text('content_markdown'),
    youtubeUrl: text('youtube_url'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const quizzes = pgTable('quizzes', {
    id: uuid('id').primaryKey().defaultRandom(),
    moduleId: uuid('module_id').references(() => modules.id).notNull(),
    question: text('question').notNull(),
    options: jsonb('options').notNull(), // Array of strings
    correctAnswer: text('correct_answer').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const resources = pgTable('resources', {
    id: uuid('id').primaryKey().defaultRandom(),
    courseId: text('course_id').references(() => courses.id), // Optional link to a specific course
    title: text('title').notNull(),
    type: text('type').notNull(), // 'video', 'article', 'pdf'
    url: text('url').notNull(),
    subject: text('subject').notNull(),
    contentSummary: text('content_summary'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const conversations = pgTable('conversations', {
    id: uuid('id').primaryKey().defaultRandom(),
    ticketId: uuid('ticket_id').references(() => tickets.id),
    mentorId: uuid('mentor_id').references(() => users.id),
    studentId: uuid('student_id').references(() => users.id),
    createdAt: timestamp('created_at').defaultNow(),
});

export const messages = pgTable('messages', {
    id: uuid('id').primaryKey().defaultRandom(),
    conversationId: uuid('conversation_id').references(() => conversations.id).notNull(),
    senderId: uuid('sender_id').references(() => users.id).notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});
