import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  progress: integer("progress").default(0),
  membershipType: text("membership_type").default("Basic"),
  role: text("role").default("user"), // admin, user, premium
  subscriptionStatus: text("subscription_status").default("free"), // free, premium, vip
  subscriptionExpiry: timestamp("subscription_expiry"),
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
  accessLevel: text("access_level").default("free"), // free, premium, vip
  price: integer("price").default(0), // price in tomans
  isLocked: boolean("is_locked").default(false),
  // Content Protection Settings
  allowDownload: boolean("allow_download").default(true),
  allowScreenshot: boolean("allow_screenshot").default(true),
  allowCopy: boolean("allow_copy").default(true),
  allowPrint: boolean("allow_print").default(true),
  watermarkText: text("watermark_text"),
  protectionLevel: text("protection_level").default("none"), // none, basic, strict
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
  difficulty: text("difficulty"),
  estimatedHours: integer("estimated_hours"),
  // Content Protection Settings
  allowDownload: boolean("allow_download").default(true),
  allowScreenshot: boolean("allow_screenshot").default(true),
  allowCopy: boolean("allow_copy").default(true),
  allowPrint: boolean("allow_print").default(true),
  watermarkText: text("watermark_text"),
  protectionLevel: text("protection_level").default("none"), // none, basic, strict
});

export const documentCategories = pgTable("document_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  parentId: integer("parent_id"),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const documentTags = pgTable("document_tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  color: text("color").default("#6B7280"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content"),
  excerpt: text("excerpt"),
  author: text("author"),
  featuredImageUrl: text("featured_image_url"),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size"),
  totalPages: integer("total_pages"),
  categoryId: integer("category_id").references(() => documentCategories.id),
  status: text("status").default("published"), // published, draft, private
  allowDownload: boolean("allow_download").default(true),
  downloadCount: integer("download_count").default(0),
  viewCount: integer("view_count").default(0),
  isFeatured: boolean("is_featured").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  // Enhanced Content Protection Settings
  allowScreenshot: boolean("allow_screenshot").default(true),
  allowCopy: boolean("allow_copy").default(true),
  allowPrint: boolean("allow_print").default(true),
  watermarkText: text("watermark_text"),
  protectionLevel: text("protection_level").default("none"), // none, basic, strict
});

export const documentTagRelations = pgTable("document_tag_relations", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").notNull().references(() => documents.id),
  tagId: integer("tag_id").notNull().references(() => documentTags.id),
  createdAt: timestamp("created_at").defaultNow(),
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
  // Content Protection Settings
  allowDownload: boolean("allow_download").default(true),
  allowScreenshot: boolean("allow_screenshot").default(true),
  allowCopy: boolean("allow_copy").default(true),
  allowPrint: boolean("allow_print").default(true),
  watermarkText: text("watermark_text"),
  protectionLevel: text("protection_level").default("none"), // none, basic, strict
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

// مدل‌های نوشته‌ها (مشابه وردپرس)
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(), // HTML content
  excerpt: text("excerpt"), // خلاصه نوشته
  authorId: integer("author_id").notNull(),
  authorName: text("author_name").notNull(),
  status: text("status").notNull().default("draft"), // draft, published, scheduled
  visibility: text("visibility").default("public"), // public, private, password
  featuredImage: text("featured_image"),
  categories: text("categories").array(), // دسته‌بندی‌ها
  tags: text("tags").array(), // برچسب‌ها
  publishedAt: timestamp("published_at"),
  scheduledAt: timestamp("scheduled_at"), // برای نوشته‌های زمان‌بندی شده
  viewCount: integer("view_count").default(0),
  likesCount: integer("likes_count").default(0),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  allowComments: boolean("allow_comments").default(true),
  isPinned: boolean("is_pinned").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// جدول رسانه برای کتابخانه رسانه مثل وردپرس
export const mediaLibrary = pgTable("media_library", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  fileSize: integer("file_size").notNull(), // اندازه فایل به بایت
  width: integer("width"), // برای تصاویر
  height: integer("height"), // برای تصاویر
  url: text("url").notNull(),
  altText: text("alt_text"), // متن جایگزین برای تصاویر
  caption: text("caption"),
  description: text("description"),
  uploadedBy: integer("uploaded_by").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
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
  level: text("level"), // مبتدی، متوسط، پیشرفته
  category: text("category"),
  isActive: boolean("is_active").default(true),
  registrationOpen: boolean("registration_open").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  // Content Protection Settings
  allowDownload: boolean("allow_download").default(true),
  allowScreenshot: boolean("allow_screenshot").default(true),
  allowCopy: boolean("allow_copy").default(true),
  allowPrint: boolean("allow_print").default(true),
  watermarkText: text("watermark_text"),
  protectionLevel: text("protection_level").default("none"), // none, basic, strict
});

export const workshopSections = pgTable("workshop_sections", {
  id: serial("id").primaryKey(),
  workshopId: integer("workshop_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content"),
  videoUrl: text("video_url"),
  presentationUrl: text("presentation_url"),
  documentUrl: text("document_url"),
  order: integer("order").notNull(),
  isLocked: boolean("is_locked").default(false),
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



// Workshop registrations table
export const workshopRegistrations = pgTable("workshop_registrations", {
  id: serial("id").primaryKey(),
  workshopId: integer("workshop_id").notNull(),
  userEmail: text("user_email").notNull(),
  userName: text("user_name").notNull(),
  userPhone: text("user_phone"),
  status: text("status").notNull().default("pending"), // pending, confirmed, cancelled
  registrationDate: timestamp("registration_date").defaultNow(),
  notes: text("notes"),
});

// Slides table for homepage carousel
export const slides = pgTable("slides", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  buttonText: text("button_text"),
  buttonUrl: text("button_url"),
  secondButtonText: text("second_button_text"),
  secondButtonUrl: text("second_button_url"),
  showButtons: boolean("show_buttons").default(true),
  showIcon: boolean("show_icon").default(true),
  isActive: boolean("is_active").default(true),
  order: integer("order").default(0),
  gradientFrom: text("gradient_from"),
  gradientTo: text("gradient_to"),
  iconName: text("icon_name"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Quick Access Menu Items
export const quickAccessItems = pgTable("quick_access_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  iconUrl: text("icon_url"), // URL to custom icon/image
  iconSvg: text("icon_svg"), // SVG code for icon
  iconType: text("icon_type").notNull().default("svg"), // "svg", "image", or "lucide"
  iconName: text("icon_name"), // Lucide icon name if using lucide
  backgroundColor: text("background_color").default("hsl(270, 60%, 95%)"),
  iconColor: text("icon_color").default("hsl(270, 70%, 60%)"),
  linkUrl: text("link_url"),
  isActive: boolean("is_active").default(true),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertCourseSchema = createInsertSchema(courses).omit({ id: true });
export const insertModuleSchema = createInsertSchema(modules).omit({ id: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true });
export const insertDocumentCategorySchema = createInsertSchema(documentCategories).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDocumentTagSchema = createInsertSchema(documentTags).omit({ id: true, createdAt: true });
export const insertDocumentSchema = createInsertSchema(documents).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDocumentTagRelationSchema = createInsertSchema(documentTagRelations).omit({ id: true, createdAt: true });
export const insertMediaContentSchema = createInsertSchema(mediaContent).omit({ id: true });
export const insertMagazineSchema = createInsertSchema(magazines).omit({ id: true, createdAt: true, updatedAt: true });
export const insertArticleSchema = createInsertSchema(articles).omit({ id: true, createdAt: true, updatedAt: true });
export const insertArticleContentSchema = createInsertSchema(articleContents).omit({ id: true, createdAt: true });
export const insertWorkshopSchema = createInsertSchema(workshops).omit({ id: true, createdAt: true, updatedAt: true });
export const insertWorkshopSectionSchema = createInsertSchema(workshopSections).omit({ id: true, createdAt: true, updatedAt: true });
export const insertWorkshopContentSchema = createInsertSchema(workshopContents).omit({ id: true, createdAt: true });
export const insertPostSchema = createInsertSchema(posts).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMediaLibrarySchema = createInsertSchema(mediaLibrary).omit({ id: true, uploadedAt: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

export type InsertModule = z.infer<typeof insertModuleSchema>;
export type Module = typeof modules.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertDocumentCategory = z.infer<typeof insertDocumentCategorySchema>;
export type DocumentCategory = typeof documentCategories.$inferSelect;

export type InsertDocumentTag = z.infer<typeof insertDocumentTagSchema>;
export type DocumentTag = typeof documentTags.$inferSelect;

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

export type InsertDocumentTagRelation = z.infer<typeof insertDocumentTagRelationSchema>;
export type DocumentTagRelation = typeof documentTagRelations.$inferSelect;

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

export type InsertWorkshopSection = z.infer<typeof insertWorkshopSectionSchema>;
export type WorkshopSection = typeof workshopSections.$inferSelect;

export type InsertWorkshopContent = z.infer<typeof insertWorkshopContentSchema>;
export type WorkshopContent = typeof workshopContents.$inferSelect;

export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;

export type InsertMediaLibrary = z.infer<typeof insertMediaLibrarySchema>;
export type MediaLibrary = typeof mediaLibrary.$inferSelect;

export const insertSlideSchema = createInsertSchema(slides).omit({ id: true, createdAt: true, updatedAt: true });
export const insertQuickAccessItemSchema = createInsertSchema(quickAccessItems).omit({ id: true, createdAt: true, updatedAt: true });
export const insertWorkshopRegistrationSchema = createInsertSchema(workshopRegistrations).omit({ id: true, registrationDate: true });

// Slide Types
export type InsertSlide = z.infer<typeof insertSlideSchema>;
export type Slide = typeof slides.$inferSelect;

// Quick Access Types
export type InsertQuickAccessItem = z.infer<typeof insertQuickAccessItemSchema>;
export type QuickAccessItem = typeof quickAccessItems.$inferSelect;

// Workshop Registration Types
export const insertWorkshopRegistrationSchema = createInsertSchema(workshopRegistrations).omit({ id: true, registeredAt: true });
export type InsertWorkshopRegistration = z.infer<typeof insertWorkshopRegistrationSchema>;
export type WorkshopRegistration = typeof workshopRegistrations.$inferSelect;

// User Course Access Table
export const userCourseAccess = pgTable("user_course_access", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  courseId: integer("course_id").notNull(),
  accessType: text("access_type").notNull(), // purchased, granted, trial
  purchaseDate: timestamp("purchase_date").defaultNow(),
  expiryDate: timestamp("expiry_date"),
  isActive: boolean("is_active").default(true),
});

export const insertUserCourseAccessSchema = createInsertSchema(userCourseAccess).omit({ id: true, purchaseDate: true });
export type InsertUserCourseAccess = z.infer<typeof insertUserCourseAccessSchema>;
export type UserCourseAccess = typeof userCourseAccess.$inferSelect;