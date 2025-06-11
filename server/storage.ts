import { 
  users, type User, type InsertUser,
  courses, type Course, type InsertCourse,
  modules, type Module, type InsertModule,
  projects, type Project, type InsertProject,
  documents, type Document, type InsertDocument,
  documentCategories, type DocumentCategory, type InsertDocumentCategory,
  documentTags, type DocumentTag, type InsertDocumentTag,
  documentTagRelations, type DocumentTagRelation, type InsertDocumentTagRelation,
  mediaContent, type MediaContent, type InsertMediaContent,
  magazines, type Magazine, type InsertMagazine,
  articles, type Article, type InsertArticle,
  articleContents, type ArticleContent, type InsertArticleContent,
  workshops, type Workshop, type InsertWorkshop,
  workshopContents, type WorkshopContent, type InsertWorkshopContent,
  slides, type Slide, type InsertSlide
} from "@shared/schema";
import { db } from "./db";
import { eq, asc, like, and, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: any): Promise<User>;

  // Course methods
  getCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourseProgress(id: number, progress: number): Promise<Course | undefined>;

  // Module methods
  getModulesByCourseId(courseId: number): Promise<Module[]>;
  getModule(id: number): Promise<Module | undefined>;
  createModule(module: InsertModule): Promise<Module>;

  // Project methods
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;

  // Document Category methods
  getDocumentCategories(): Promise<DocumentCategory[]>;
  getDocumentCategory(id: number): Promise<DocumentCategory | undefined>;
  createDocumentCategory(category: InsertDocumentCategory): Promise<DocumentCategory>;
  updateDocumentCategory(id: number, category: Partial<InsertDocumentCategory>): Promise<DocumentCategory | undefined>;
  deleteDocumentCategory(id: number): Promise<boolean>;

  // Document Tag methods
  getAllDocumentTags(): Promise<DocumentTag[]>;
  getDocumentTag(id: number): Promise<DocumentTag | undefined>;
  createDocumentTag(tag: InsertDocumentTag): Promise<DocumentTag>;
  updateDocumentTag(id: number, tag: Partial<InsertDocumentTag>): Promise<DocumentTag | undefined>;
  deleteDocumentTag(id: number): Promise<boolean>;

  // Document methods
  getDocuments(): Promise<Document[]>;
  getDocumentsByCategory(categoryId: number): Promise<Document[]>;
  getDocumentsByTag(tagId: number): Promise<Document[]>;
  getFeaturedDocuments(): Promise<Document[]>;
  searchDocuments(query: string): Promise<Document[]>;
  getDocument(id: number): Promise<Document | undefined>;
  getDocumentBySlug(slug: string): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document | undefined>;
  deleteDocument(id: number): Promise<boolean>;
  incrementDownloadCount(id: number): Promise<void>;
  incrementViewCount(id: number): Promise<void>;

  // Document Tag Relations
  addTagToDocument(documentId: number, tagId: number): Promise<DocumentTagRelation>;
  removeTagFromDocument(documentId: number, tagId: number): Promise<boolean>;
  getDocumentTagsByDocument(documentId: number): Promise<DocumentTag[]>;

  // Media content methods
  getMediaContent(id: number): Promise<MediaContent | undefined>;
  createMediaContent(content: InsertMediaContent): Promise<MediaContent>;

  // Magazine methods
  getMagazines(): Promise<Magazine[]>;
  getMagazine(id: number): Promise<Magazine | undefined>;
  createMagazine(magazine: InsertMagazine): Promise<Magazine>;
  updateMagazine(id: number, magazine: Partial<InsertMagazine>): Promise<Magazine | undefined>;
  deleteMagazine(id: number): Promise<boolean>;

  // Article methods
  getArticles(): Promise<Article[]>;
  getArticlesByMagazineId(magazineId: number): Promise<Article[]>;
  getArticle(id: number): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: number): Promise<boolean>;

  // Article content methods
  getArticleContents(articleId: number): Promise<ArticleContent[]>;
  createArticleContent(content: InsertArticleContent): Promise<ArticleContent>;
  updateArticleContent(id: number, content: Partial<InsertArticleContent>): Promise<ArticleContent | undefined>;
  deleteArticleContent(id: number): Promise<boolean>;

  // Workshop methods
  getWorkshops(): Promise<Workshop[]>;
  getWorkshop(id: number): Promise<Workshop | undefined>;
  createWorkshop(workshop: InsertWorkshop): Promise<Workshop>;
  updateWorkshop(id: number, workshop: Partial<InsertWorkshop>): Promise<Workshop | undefined>;
  deleteWorkshop(id: number): Promise<boolean>;

  // Workshop content methods
  getWorkshopContents(workshopId: number): Promise<WorkshopContent[]>;
  createWorkshopContent(content: InsertWorkshopContent): Promise<WorkshopContent>;
  updateWorkshopContent(id: number, content: Partial<InsertWorkshopContent>): Promise<WorkshopContent | undefined>;
  deleteWorkshopContent(id: number): Promise<boolean>;

  // Slide methods
  getSlides(): Promise<Slide[]>;
  getActiveSlides(): Promise<Slide[]>;
  getSlide(id: number): Promise<Slide | undefined>;
  createSlide(slide: InsertSlide): Promise<Slide>;
  updateSlide(id: number, slide: Partial<InsertSlide>): Promise<Slide | undefined>;
  deleteSlide(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async upsertUser(userData: any): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        id: userData.id,
        username: userData.username || `user_${userData.id}`,
        password: 'temp_password',
        name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || null,
        role: userData.role || 'user'
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || null,
          role: userData.role || 'user'
        },
      })
      .returning();
    return user;
  }

  // Course methods
  async getCourses(): Promise<Course[]> {
    return await db.select().from(courses);
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const [course] = await db
      .insert(courses)
      .values(insertCourse)
      .returning();
    return course;
  }

  async updateCourseProgress(id: number, progress: number): Promise<Course | undefined> {
    const [course] = await db
      .update(courses)
      .set({ progress })
      .where(eq(courses.id, id))
      .returning();
    return course;
  }

  // Module methods
  async getModulesByCourseId(courseId: number): Promise<Module[]> {
    return await db.select().from(modules).where(eq(modules.courseId, courseId));
  }

  async getModule(id: number): Promise<Module | undefined> {
    const [module] = await db.select().from(modules).where(eq(modules.id, id));
    return module;
  }

  async createModule(insertModule: InsertModule): Promise<Module> {
    const [module] = await db
      .insert(modules)
      .values(insertModule)
      .returning();
    return module;
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(insertProject)
      .returning();
    return project;
  }



  // Media content methods
  async getMediaContent(id: number): Promise<MediaContent | undefined> {
    const [media] = await db.select().from(mediaContent).where(eq(mediaContent.id, id));
    return media;
  }

  async createMediaContent(insertMediaContent: InsertMediaContent): Promise<MediaContent> {
    const [media] = await db
      .insert(mediaContent)
      .values(insertMediaContent)
      .returning();
    return media;
  }

  // Magazine methods
  async getMagazines(): Promise<Magazine[]> {
    return await db.select().from(magazines);
  }

  async getMagazine(id: number): Promise<Magazine | undefined> {
    const [magazine] = await db.select().from(magazines).where(eq(magazines.id, id));
    return magazine;
  }

  async createMagazine(magazine: InsertMagazine): Promise<Magazine> {
    const [newMagazine] = await db
      .insert(magazines)
      .values({
        ...magazine,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return newMagazine;
  }

  async updateMagazine(id: number, magazine: Partial<InsertMagazine>): Promise<Magazine | undefined> {
    const [updatedMagazine] = await db
      .update(magazines)
      .set({
        ...magazine,
        updatedAt: new Date()
      })
      .where(eq(magazines.id, id))
      .returning();
    return updatedMagazine;
  }

  async deleteMagazine(id: number): Promise<boolean> {
    const result = await db.delete(magazines).where(eq(magazines.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Article methods
  async getArticles(): Promise<Article[]> {
    return await db.select().from(articles);
  }

  async getArticlesByMagazineId(magazineId: number): Promise<Article[]> {
    return await db.select().from(articles).where(eq(articles.magazineId, magazineId));
  }

  async getArticle(id: number): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    return article;
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const [newArticle] = await db
      .insert(articles)
      .values({
        ...article,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return newArticle;
  }

  async updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article | undefined> {
    const [updatedArticle] = await db
      .update(articles)
      .set({
        ...article,
        updatedAt: new Date()
      })
      .where(eq(articles.id, id))
      .returning();
    return updatedArticle;
  }

  async deleteArticle(id: number): Promise<boolean> {
    const result = await db.delete(articles).where(eq(articles.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Article content methods
  async getArticleContents(articleId: number): Promise<ArticleContent[]> {
    return await db.select().from(articleContents).where(eq(articleContents.articleId, articleId));
  }

  async createArticleContent(content: InsertArticleContent): Promise<ArticleContent> {
    const [newContent] = await db
      .insert(articleContents)
      .values({
        ...content,
        createdAt: new Date()
      })
      .returning();
    return newContent;
  }

  async updateArticleContent(id: number, content: Partial<InsertArticleContent>): Promise<ArticleContent | undefined> {
    const [updatedContent] = await db
      .update(articleContents)
      .set(content)
      .where(eq(articleContents.id, id))
      .returning();
    return updatedContent;
  }

  async deleteArticleContent(id: number): Promise<boolean> {
    const result = await db.delete(articleContents).where(eq(articleContents.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Workshop methods
  async getWorkshops(): Promise<Workshop[]> {
    return await db.select().from(workshops);
  }

  async getWorkshop(id: number): Promise<Workshop | undefined> {
    const [workshop] = await db.select().from(workshops).where(eq(workshops.id, id));
    return workshop;
  }

  async createWorkshop(workshop: InsertWorkshop): Promise<Workshop> {
    const [newWorkshop] = await db
      .insert(workshops)
      .values({
        ...workshop,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return newWorkshop;
  }

  async updateWorkshop(id: number, workshop: Partial<InsertWorkshop>): Promise<Workshop | undefined> {
    const [updatedWorkshop] = await db
      .update(workshops)
      .set({
        ...workshop,
        updatedAt: new Date()
      })
      .where(eq(workshops.id, id))
      .returning();
    return updatedWorkshop;
  }

  async deleteWorkshop(id: number): Promise<boolean> {
    const result = await db.delete(workshops).where(eq(workshops.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Workshop content methods
  async getWorkshopContents(workshopId: number): Promise<WorkshopContent[]> {
    return await db.select().from(workshopContents).where(eq(workshopContents.workshopId, workshopId));
  }

  async createWorkshopContent(content: InsertWorkshopContent): Promise<WorkshopContent> {
    const [newContent] = await db
      .insert(workshopContents)
      .values({
        ...content,
        createdAt: new Date()
      })
      .returning();
    return newContent;
  }

  async updateWorkshopContent(id: number, content: Partial<InsertWorkshopContent>): Promise<WorkshopContent | undefined> {
    const [updatedContent] = await db
      .update(workshopContents)
      .set(content)
      .where(eq(workshopContents.id, id))
      .returning();
    return updatedContent;
  }

  async deleteWorkshopContent(id: number): Promise<boolean> {
    const result = await db.delete(workshopContents).where(eq(workshopContents.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Slide methods
  async getSlides(): Promise<Slide[]> {
    return await db.select().from(slides).orderBy(asc(slides.order));
  }

  async getActiveSlides(): Promise<Slide[]> {
    return await db.select().from(slides).where(eq(slides.isActive, true)).orderBy(asc(slides.order));
  }

  async getSlide(id: number): Promise<Slide | undefined> {
    const [slide] = await db.select().from(slides).where(eq(slides.id, id));
    return slide;
  }

  async createSlide(slide: InsertSlide): Promise<Slide> {
    const [newSlide] = await db
      .insert(slides)
      .values({
        ...slide,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return newSlide;
  }

  async updateSlide(id: number, slide: Partial<InsertSlide>): Promise<Slide | undefined> {
    const [updatedSlide] = await db
      .update(slides)
      .set({
        ...slide,
        updatedAt: new Date()
      })
      .where(eq(slides.id, id))
      .returning();
    return updatedSlide;
  }

  async deleteSlide(id: number): Promise<boolean> {
    const result = await db.delete(slides).where(eq(slides.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Document Category methods
  async getDocumentCategories(): Promise<DocumentCategory[]> {
    return await db.select().from(documentCategories).where(eq(documentCategories.isActive, true)).orderBy(asc(documentCategories.order));
  }

  async getDocumentCategory(id: number): Promise<DocumentCategory | undefined> {
    const [category] = await db.select().from(documentCategories).where(eq(documentCategories.id, id));
    return category;
  }

  async createDocumentCategory(category: InsertDocumentCategory): Promise<DocumentCategory> {
    const [newCategory] = await db
      .insert(documentCategories)
      .values({
        ...category,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return newCategory;
  }

  async updateDocumentCategory(id: number, category: Partial<InsertDocumentCategory>): Promise<DocumentCategory | undefined> {
    const [updatedCategory] = await db
      .update(documentCategories)
      .set({
        ...category,
        updatedAt: new Date()
      })
      .where(eq(documentCategories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteDocumentCategory(id: number): Promise<boolean> {
    const result = await db.delete(documentCategories).where(eq(documentCategories.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Document Tag methods
  async getAllDocumentTags(): Promise<DocumentTag[]> {
    return await db.select().from(documentTags);
  }

  async getDocumentTag(id: number): Promise<DocumentTag | undefined> {
    const [tag] = await db.select().from(documentTags).where(eq(documentTags.id, id));
    return tag;
  }

  async createDocumentTag(tag: InsertDocumentTag): Promise<DocumentTag> {
    const [newTag] = await db
      .insert(documentTags)
      .values({
        ...tag,
        createdAt: new Date()
      })
      .returning();
    return newTag;
  }

  async updateDocumentTag(id: number, tag: Partial<InsertDocumentTag>): Promise<DocumentTag | undefined> {
    const [updatedTag] = await db
      .update(documentTags)
      .set(tag)
      .where(eq(documentTags.id, id))
      .returning();
    return updatedTag;
  }

  async deleteDocumentTag(id: number): Promise<boolean> {
    const result = await db.delete(documentTags).where(eq(documentTags.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Document methods
  async getDocuments(): Promise<Document[]> {
    return await db.select().from(documents).orderBy(asc(documents.createdAt));
  }

  async getDocumentsByCategory(categoryId: number): Promise<Document[]> {
    return await db.select().from(documents).where(eq(documents.categoryId, categoryId));
  }

  async getDocumentsByTag(tagId: number): Promise<Document[]> {
    const results = await db
      .select({ document: documents })
      .from(documents)
      .innerJoin(documentTagRelations, eq(documents.id, documentTagRelations.documentId))
      .where(eq(documentTagRelations.tagId, tagId));
    return results.map(r => r.document);
  }

  async getFeaturedDocuments(): Promise<Document[]> {
    return await db.select().from(documents).where(eq(documents.isFeatured, true));
  }

  async searchDocuments(query: string): Promise<Document[]> {
    return await db.select().from(documents).where(
      // Simple text search - در production از full-text search استفاده کنید
      eq(documents.title, query)
    );
  }

  async getDocument(id: number): Promise<Document | undefined> {
    const [document] = await db.select().from(documents).where(eq(documents.id, id));
    return document;
  }

  async getDocumentBySlug(slug: string): Promise<Document | undefined> {
    const [document] = await db.select().from(documents).where(eq(documents.slug, slug));
    return document;
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const [newDocument] = await db
      .insert(documents)
      .values({
        ...document,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date()
      })
      .returning();
    return newDocument;
  }

  async updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document | undefined> {
    const [updatedDocument] = await db
      .update(documents)
      .set({
        ...document,
        updatedAt: new Date()
      })
      .where(eq(documents.id, id))
      .returning();
    return updatedDocument;
  }

  async deleteDocument(id: number): Promise<boolean> {
    const result = await db.delete(documents).where(eq(documents.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async incrementDownloadCount(id: number): Promise<void> {
    await db
      .update(documents)
      .set({
        downloadCount: sql`${documents.downloadCount} + 1`
      })
      .where(eq(documents.id, id));
  }

  async incrementViewCount(id: number): Promise<void> {
    await db
      .update(documents)
      .set({
        viewCount: sql`${documents.viewCount} + 1`
      })
      .where(eq(documents.id, id));
  }

  // Document Tag Relations
  async addTagToDocument(documentId: number, tagId: number): Promise<DocumentTagRelation> {
    const [relation] = await db
      .insert(documentTagRelations)
      .values({
        documentId,
        tagId,
        createdAt: new Date()
      })
      .returning();
    return relation;
  }

  async removeTagFromDocument(documentId: number, tagId: number): Promise<boolean> {
    const result = await db
      .delete(documentTagRelations)
      .where(
        eq(documentTagRelations.documentId, documentId) && eq(documentTagRelations.tagId, tagId)
      );
    return (result.rowCount ?? 0) > 0;
  }

  async getDocumentTagsByDocument(documentId: number): Promise<DocumentTag[]> {
    const results = await db
      .select({ tag: documentTags })
      .from(documentTags)
      .innerJoin(documentTagRelations, eq(documentTags.id, documentTagRelations.tagId))
      .where(eq(documentTagRelations.documentId, documentId));
    return results.map(r => r.tag);
  }
}

export const storage = new DatabaseStorage();