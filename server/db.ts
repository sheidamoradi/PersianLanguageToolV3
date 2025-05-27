import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { pgTable, serial, integer, varchar, text, timestamp, boolean } from "drizzle-orm/pg-core";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const articleContents = pgTable("article_contents", {
  id: serial("id").primaryKey(),
  articleId: integer("article_id").references(() => articles.id),
  contentType: varchar("content_type", { length: 50 }), // 'text', 'image', 'video'
  content: text("content"),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const slides = pgTable("slides", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  imageUrl: varchar("image_url", { length: 500 }),
  buttonText: varchar("button_text", { length: 100 }),
  buttonUrl: varchar("button_url", { length: 500 }),
  isActive: boolean("is_active").default(true),
  order: integer("order").default(0),
  gradientFrom: varchar("gradient_from", { length: 50 }),
  gradientTo: varchar("gradient_to", { length: 50 }),
  iconName: varchar("icon_name", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});