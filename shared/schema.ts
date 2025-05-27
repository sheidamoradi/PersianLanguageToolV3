import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  progress: integer("progress").default(0),
  membershipType: text("membership_type").default("Basic"),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  progress: integer("progress").default(0),
  totalModules: integer("total_modules").default(0),
  completedModules: integer("completed_modules").default(0),
  category: text("category"),
  level: text("level"),
  isNew: boolean("is_new").default(false),
  isPopular: boolean("is_popular").default(false),
});

export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  title: text("title").notNull(),
  duration: text("duration"),
  type: text("type").notNull(), // video, pdf, etc.
  contentUrl: text("content_url"),
  isLocked: boolean("is_locked").default(false),
  order: integer("order").notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  type: text("type").notNull(), // "project" or "magazine"
  dueDate: text("due_date"),
  pages: integer("pages"),
  contentUrl: text("content_url"),
  isLocked: boolean("is_locked").default(false),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(),
  totalPages: integer("total_pages"),
  lastUpdated: text("last_updated"),
  allowDownload: boolean("allow_download").default(true),
});

export const mediaContent = pgTable("media_content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  contentUrl: text("content_url").notNull(),
  duration: text("duration"),
  instructorName: text("instructor_name"),
  instructorTitle: text("instructor_title"),
  instructorAvatar: text("instructor_avatar"),
});

// مدل‌های داده برای مجلات و مقالات
export const magazines = pgTable("magazines", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  coverImageUrl: text("cover_image_url"),
  issueNumber: integer("issue_number"),
  publishDate: text("publish_date"),
  season: text("season"),
  year: integer("year"),
  totalPages: integer("total_pages").default(0),
  pdfUrl: text("pdf_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author"),
  summary: text("summary"),
  publishDate: text("publish_date"),
  content: text("content"),
  featuredImageUrl: text("featured_image_url"),
  thumbnailUrl: text("thumbnail_url"),
  readTime: integer("read_time").default(0),
  magazineId: integer("magazine_id").notNull(),
  pdfUrl: text("pdf_url"),
  order: integer("order").default(0),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const articleContents = pgTable("article_contents", {
  id: serial("id").primaryKey(),
  articleId: integer("article_id").notNull(),
  contentType: text("content_type").notNull(), // text, image, video
  content: text("content").notNull(),
  caption: text("caption"),
  order: integer("order").notNull(),
  style: jsonb("style"), // برای ذخیره استایل‌های مربوط به محتوا
  createdAt: timestamp("created_at").defaultNow(),
});

// مدل‌های داده‌ برای کارگاه‌های آموزشی
export const workshops = pgTable("workshops", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  posterUrl: text("poster_url"),
  eventDate: text("event_date"),
  location: text("location"),
  instructor: text("instructor"),
  duration: text("duration"),
  capacity: integer("capacity"),
  registrationOpen: boolean("registration_open").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const workshopContents = pgTable("workshop_contents", {
  id: serial("id").primaryKey(),
  workshopId: integer("workshop_id").notNull(),
  contentType: text("content_type").notNull(), // text, image, video, presentation
  title: text("title"),
  content: text("content").notNull(),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertCourseSchema = createInsertSchema(courses).omit({ id: true });
export const insertModuleSchema = createInsertSchema(modules).omit({ id: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true });
export const insertDocumentSchema = createInsertSchema(documents).omit({ id: true });
export const insertMediaContentSchema = createInsertSchema(mediaContent).omit({ id: true });
export const insertMagazineSchema = createInsertSchema(magazines).omit({ id: true, createdAt: true, updatedAt: true });
export const insertArticleSchema = createInsertSchema(articles).omit({ id: true, createdAt: true, updatedAt: true });
export const insertArticleContentSchema = createInsertSchema(articleContents).omit({ id: true, createdAt: true });
export const insertWorkshopSchema = createInsertSchema(workshops).omit({ id: true, createdAt: true, updatedAt: true });
export const insertWorkshopContentSchema = createInsertSchema(workshopContents).omit({ id: true, createdAt: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

export type InsertModule = z.infer<typeof insertModuleSchema>;
export type Module = typeof modules.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

export type InsertMediaContent = z.infer<typeof insertMediaContentSchema>;
export type MediaContent = typeof mediaContent.$inferSelect;

export type InsertMagazine = z.infer<typeof insertMagazineSchema>;
export type Magazine = typeof magazines.$inferSelect;

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

export type InsertArticleContent = z.infer<typeof insertArticleContentSchema>;
export type ArticleContent = typeof articleContents.$inferSelect;

export type InsertWorkshop = z.infer<typeof insertWorkshopSchema>;
export type Workshop = typeof workshops.$inferSelect;

export type InsertWorkshopContent = z.infer<typeof insertWorkshopContentSchema>;
export type WorkshopContent = typeof workshopContents.$inferSelect;
