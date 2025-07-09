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
  workshopRegistrations, type WorkshopRegistration, type InsertWorkshopRegistration,
  webinars, type Webinar, type InsertWebinar,
  webinarSections, type WebinarSection, type InsertWebinarSection,
  slides, type Slide, type InsertSlide,
  quickAccessItems, type QuickAccessItem, type InsertQuickAccessItem,
  userCourseAccess, type UserCourseAccess, type InsertUserCourseAccess,
  educationalVideos, type EducationalVideo, type InsertEducationalVideo,
  aboutUs, type AboutUs, type InsertAboutUs,
  subsidiaryCompanies, type SubsidiaryCompany, type InsertSubsidiaryCompany,
  contactUs, type ContactUs, type InsertContactUs
} from "@shared/schema";
import { db } from "./db";
import { eq, asc, like, and, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
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
  getDocumentTags(): Promise<DocumentTag[]>;
  getDocumentTag(id: number): Promise<DocumentTag | undefined>;
  createDocumentTag(tag: InsertDocumentTag): Promise<DocumentTag>;
  updateDocumentTag(id: number, tag: Partial<InsertDocumentTag>): Promise<DocumentTag | undefined>;
  deleteDocumentTag(id: number): Promise<boolean>;

  // Document methods
  getDocuments(): Promise<Document[]>;
  getDocumentsByCategory(category: string): Promise<Document[]>;
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

  // Workshop registration methods
  getWorkshopRegistrations(): Promise<WorkshopRegistration[]>;
  getWorkshopRegistrationsByWorkshopId(workshopId: number): Promise<WorkshopRegistration[]>;
  createWorkshopRegistration(registration: InsertWorkshopRegistration): Promise<WorkshopRegistration>;
  updateWorkshopRegistration(id: number, registration: Partial<InsertWorkshopRegistration>): Promise<WorkshopRegistration | undefined>;
  deleteWorkshopRegistration(id: number): Promise<boolean>;

  // Webinar methods
  getWebinars(): Promise<Webinar[]>;
  getWebinar(id: number): Promise<Webinar | undefined>;
  createWebinar(webinar: InsertWebinar): Promise<Webinar>;
  updateWebinar(id: number, webinar: Partial<InsertWebinar>): Promise<Webinar | undefined>;
  deleteWebinar(id: number): Promise<boolean>;

  // Webinar section methods
  getWebinarSections(webinarId: number): Promise<WebinarSection[]>;
  getWebinarSection(id: number): Promise<WebinarSection | undefined>;
  createWebinarSection(section: InsertWebinarSection): Promise<WebinarSection>;
  updateWebinarSection(id: number, section: Partial<InsertWebinarSection>): Promise<WebinarSection | undefined>;
  deleteWebinarSection(id: number): Promise<boolean>;

  // User course access methods
  getUserCourseAccess(userId: number): Promise<UserCourseAccess[]>;
  getCourseAccess(userId: number, courseId: number): Promise<UserCourseAccess | undefined>;
  grantCourseAccess(access: InsertUserCourseAccess): Promise<UserCourseAccess>;
  revokeCourseAccess(userId: number, courseId: number): Promise<boolean>;
  
  // Permission check methods
  canAccessCourse(userId: number, courseId: number): Promise<boolean>;
  canDownloadContent(userId: number, courseId: number): Promise<boolean>;

  // Slide methods
  getSlides(): Promise<Slide[]>;
  getActiveSlides(): Promise<Slide[]>;
  getSlide(id: number): Promise<Slide | undefined>;
  createSlide(slide: InsertSlide): Promise<Slide>;
  updateSlide(id: number, slide: Partial<InsertSlide>): Promise<Slide | undefined>;
  deleteSlide(id: number): Promise<boolean>;

  // Quick Access Item methods
  getQuickAccessItems(): Promise<QuickAccessItem[]>;
  getActiveQuickAccessItems(): Promise<QuickAccessItem[]>;
  getQuickAccessItem(id: number): Promise<QuickAccessItem | undefined>;
  createQuickAccessItem(item: InsertQuickAccessItem): Promise<QuickAccessItem>;
  updateQuickAccessItem(id: number, item: Partial<InsertQuickAccessItem>): Promise<QuickAccessItem | undefined>;
  deleteQuickAccessItem(id: number): Promise<boolean>;

  // Educational Video methods
  getEducationalVideos(): Promise<EducationalVideo[]>;
  getActiveEducationalVideos(): Promise<EducationalVideo[]>;
  getEducationalVideo(id: number): Promise<EducationalVideo | undefined>;
  createEducationalVideo(video: InsertEducationalVideo): Promise<EducationalVideo>;
  updateEducationalVideo(id: number, video: Partial<InsertEducationalVideo>): Promise<EducationalVideo | undefined>;
  deleteEducationalVideo(id: number): Promise<boolean>;

  // Protection control methods
  updateCourseProtection(id: number, protection: any): Promise<Course | undefined>;
  updateProjectProtection(id: number, protection: any): Promise<Project | undefined>;
  updateDocumentProtection(id: number, protection: any): Promise<Document | undefined>;
  updateMagazineProtection(id: number, protection: any): Promise<Magazine | undefined>;

  // About Us methods
  getAboutUs(): Promise<AboutUs[]>;
  getActiveAboutUs(): Promise<AboutUs[]>;
  getAboutUsById(id: number): Promise<AboutUs | undefined>;
  createAboutUs(aboutUs: InsertAboutUs): Promise<AboutUs>;
  updateAboutUs(id: number, aboutUs: Partial<InsertAboutUs>): Promise<AboutUs | undefined>;
  deleteAboutUs(id: number): Promise<boolean>;

  // Subsidiary Companies methods
  getSubsidiaryCompanies(): Promise<SubsidiaryCompany[]>;
  getActiveSubsidiaryCompanies(): Promise<SubsidiaryCompany[]>;
  getSubsidiaryCompanyById(id: number): Promise<SubsidiaryCompany | undefined>;
  createSubsidiaryCompany(company: InsertSubsidiaryCompany): Promise<SubsidiaryCompany>;
  updateSubsidiaryCompany(id: number, company: Partial<InsertSubsidiaryCompany>): Promise<SubsidiaryCompany | undefined>;
  deleteSubsidiaryCompany(id: number): Promise<boolean>;

  // Contact Us methods
  getContactUs(): Promise<ContactUs[]>;
  getActiveContactUs(): Promise<ContactUs[]>;
  getContactUsById(id: number): Promise<ContactUs | undefined>;
  createContactUs(contactUs: InsertContactUs): Promise<ContactUs>;
  updateContactUs(id: number, contactUs: Partial<InsertContactUs>): Promise<ContactUs | undefined>;
  deleteContactUs(id: number): Promise<boolean>;
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

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
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

  // Quick Access Item methods
  async getQuickAccessItems(): Promise<QuickAccessItem[]> {
    return await db.select().from(quickAccessItems).orderBy(asc(quickAccessItems.order));
  }

  async getActiveQuickAccessItems(): Promise<QuickAccessItem[]> {
    return await db.select().from(quickAccessItems)
      .where(eq(quickAccessItems.isActive, true))
      .orderBy(asc(quickAccessItems.order));
  }

  async getQuickAccessItem(id: number): Promise<QuickAccessItem | undefined> {
    const [item] = await db.select().from(quickAccessItems).where(eq(quickAccessItems.id, id));
    return item;
  }

  async createQuickAccessItem(item: InsertQuickAccessItem): Promise<QuickAccessItem> {
    const [newItem] = await db
      .insert(quickAccessItems)
      .values({
        ...item,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return newItem;
  }

  async updateQuickAccessItem(id: number, item: Partial<InsertQuickAccessItem>): Promise<QuickAccessItem | undefined> {
    const [updatedItem] = await db
      .update(quickAccessItems)
      .set({
        ...item,
        updatedAt: new Date()
      })
      .where(eq(quickAccessItems.id, id))
      .returning();
    return updatedItem;
  }

  async deleteQuickAccessItem(id: number): Promise<boolean> {
    const result = await db.delete(quickAccessItems).where(eq(quickAccessItems.id, id));
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

  async getDocumentTags(): Promise<DocumentTag[]> {
    return await db.select().from(documentTags).orderBy(asc(documentTags.name));
  }

  // Document methods
  async getDocuments(): Promise<Document[]> {
    return await db.select().from(documents).orderBy(asc(documents.createdAt));
  }

  async getDocumentsByCategory(category: string): Promise<Document[]> {
    return await db.select().from(documents).where(eq(documents.category, category));
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
    return await db.select().from(documents).where(eq(documents.isSticky, true));
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

  // User course access methods
  async getUserCourseAccess(userId: number): Promise<UserCourseAccess[]> {
    return await db.select().from(userCourseAccess).where(eq(userCourseAccess.userId, userId));
  }

  async getCourseAccess(userId: number, courseId: number): Promise<UserCourseAccess | undefined> {
    const [access] = await db
      .select()
      .from(userCourseAccess)
      .where(
        and(
          eq(userCourseAccess.userId, userId),
          eq(userCourseAccess.courseId, courseId),
          eq(userCourseAccess.isActive, true)
        )
      );
    return access;
  }

  async grantCourseAccess(access: InsertUserCourseAccess): Promise<UserCourseAccess> {
    const [newAccess] = await db
      .insert(userCourseAccess)
      .values(access)
      .returning();
    return newAccess;
  }

  async revokeCourseAccess(userId: number, courseId: number): Promise<boolean> {
    const result = await db
      .update(userCourseAccess)
      .set({ isActive: false })
      .where(
        and(
          eq(userCourseAccess.userId, userId),
          eq(userCourseAccess.courseId, courseId)
        )
      );
    return (result.rowCount ?? 0) > 0;
  }

  async canAccessCourse(userId: number, courseId: number): Promise<boolean> {
    const user = await this.getUser(userId);
    const course = await this.getCourse(courseId);
    
    if (!user || !course) return false;
    
    // Admin can access everything
    if (user.role === 'admin') return true;
    
    // Free courses are accessible to everyone
    if (course.accessLevel === 'free') return true;
    
    // Check user subscription status
    if (course.accessLevel === 'premium' && (user.subscriptionStatus === 'premium' || user.subscriptionStatus === 'vip')) {
      return true;
    }
    
    if (course.accessLevel === 'vip' && user.subscriptionStatus === 'vip') {
      return true;
    }
    
    // Check specific course access
    const access = await this.getCourseAccess(userId, courseId);
    return access ? (access.isActive ?? false) : false;
  }

  async canDownloadContent(userId: number, courseId: number): Promise<boolean> {
    const user = await this.getUser(userId);
    if (!user) return false;
    
    // Admin can download everything
    if (user.role === 'admin') return true;
    
    // Check if user has access to the course first
    const hasAccess = await this.canAccessCourse(userId, courseId);
    if (!hasAccess) return false;
    
    // Premium and VIP users can download
    return user.subscriptionStatus === 'premium' || user.subscriptionStatus === 'vip';
  }

  // Webinar methods
  async getWebinars(): Promise<Webinar[]> {
    return await db.select().from(webinars).orderBy(asc(webinars.createdAt));
  }

  async getWebinar(id: number): Promise<Webinar | undefined> {
    const [webinar] = await db.select().from(webinars).where(eq(webinars.id, id));
    return webinar;
  }

  async createWebinar(webinar: InsertWebinar): Promise<Webinar> {
    const [newWebinar] = await db.insert(webinars).values(webinar).returning();
    return newWebinar;
  }

  async updateWebinar(id: number, webinar: Partial<InsertWebinar>): Promise<Webinar | undefined> {
    const [updatedWebinar] = await db
      .update(webinars)
      .set({ ...webinar, updatedAt: new Date() })
      .where(eq(webinars.id, id))
      .returning();
    return updatedWebinar;
  }

  async deleteWebinar(id: number): Promise<boolean> {
    const result = await db.delete(webinars).where(eq(webinars.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Webinar section methods
  async getWebinarSections(webinarId: number): Promise<WebinarSection[]> {
    return await db.select().from(webinarSections)
      .where(eq(webinarSections.webinarId, webinarId))
      .orderBy(asc(webinarSections.order));
  }

  async getWebinarSection(id: number): Promise<WebinarSection | undefined> {
    const [section] = await db.select().from(webinarSections).where(eq(webinarSections.id, id));
    return section;
  }

  async createWebinarSection(section: InsertWebinarSection): Promise<WebinarSection> {
    const [newSection] = await db.insert(webinarSections).values(section).returning();
    return newSection;
  }

  async updateWebinarSection(id: number, section: Partial<InsertWebinarSection>): Promise<WebinarSection | undefined> {
    const [updatedSection] = await db
      .update(webinarSections)
      .set({ ...section, updatedAt: new Date() })
      .where(eq(webinarSections.id, id))
      .returning();
    return updatedSection;
  }

  async deleteWebinarSection(id: number): Promise<boolean> {
    const result = await db.delete(webinarSections).where(eq(webinarSections.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Protection control methods
  async updateCourseProtection(id: number, protection: any): Promise<Course | undefined> {
    const [updatedCourse] = await db
      .update(courses)
      .set(protection)
      .where(eq(courses.id, id))
      .returning();
    return updatedCourse;
  }

  async updateProjectProtection(id: number, protection: any): Promise<Project | undefined> {
    const [updatedProject] = await db
      .update(projects)
      .set(protection)
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }

  async updateDocumentProtection(id: number, protection: any): Promise<Document | undefined> {
    const [updatedDocument] = await db
      .update(documents)
      .set(protection)
      .where(eq(documents.id, id))
      .returning();
    return updatedDocument;
  }

  async updateMagazineProtection(id: number, protection: any): Promise<Magazine | undefined> {
    const [updatedMagazine] = await db
      .update(magazines)
      .set(protection)
      .where(eq(magazines.id, id))
      .returning();
    return updatedMagazine;
  }

  // Workshop registration methods
  async getWorkshopRegistrations(): Promise<WorkshopRegistration[]> {
    return await db.select().from(workshopRegistrations).orderBy(asc(workshopRegistrations.registrationDate));
  }

  async getWorkshopRegistrationsByWorkshopId(workshopId: number): Promise<WorkshopRegistration[]> {
    return await db.select().from(workshopRegistrations).where(eq(workshopRegistrations.workshopId, workshopId)).orderBy(asc(workshopRegistrations.registrationDate));
  }

  async createWorkshopRegistration(registration: InsertWorkshopRegistration): Promise<WorkshopRegistration> {
    const [newRegistration] = await db
      .insert(workshopRegistrations)
      .values({
        ...registration,
        registrationDate: new Date()
      })
      .returning();
    return newRegistration;
  }

  async updateWorkshopRegistration(id: number, registration: Partial<InsertWorkshopRegistration>): Promise<WorkshopRegistration | undefined> {
    const [updatedRegistration] = await db
      .update(workshopRegistrations)
      .set(registration)
      .where(eq(workshopRegistrations.id, id))
      .returning();
    return updatedRegistration;
  }

  async deleteWorkshopRegistration(id: number): Promise<boolean> {
    const result = await db.delete(workshopRegistrations).where(eq(workshopRegistrations.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Educational Video methods
  async getEducationalVideos(): Promise<EducationalVideo[]> {
    return await db.select().from(educationalVideos).orderBy(asc(educationalVideos.orderPosition));
  }

  async getActiveEducationalVideos(): Promise<EducationalVideo[]> {
    return await db.select().from(educationalVideos).where(eq(educationalVideos.isActive, true)).orderBy(asc(educationalVideos.orderPosition));
  }

  async getEducationalVideo(id: number): Promise<EducationalVideo | undefined> {
    const [video] = await db.select().from(educationalVideos).where(eq(educationalVideos.id, id));
    return video;
  }

  async createEducationalVideo(video: InsertEducationalVideo): Promise<EducationalVideo> {
    const [newVideo] = await db
      .insert(educationalVideos)
      .values(video)
      .returning();
    return newVideo;
  }

  async updateEducationalVideo(id: number, video: Partial<InsertEducationalVideo>): Promise<EducationalVideo | undefined> {
    const [updatedVideo] = await db
      .update(educationalVideos)
      .set(video)
      .where(eq(educationalVideos.id, id))
      .returning();
    return updatedVideo;
  }

  async deleteEducationalVideo(id: number): Promise<boolean> {
    const result = await db.delete(educationalVideos).where(eq(educationalVideos.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // About Us methods
  async getAboutUs(): Promise<AboutUs[]> {
    return await db.select().from(aboutUs).orderBy(asc(aboutUs.id));
  }

  async getActiveAboutUs(): Promise<AboutUs[]> {
    return await db.select().from(aboutUs).where(eq(aboutUs.isActive, true)).orderBy(asc(aboutUs.id));
  }

  async getAboutUsById(id: number): Promise<AboutUs | undefined> {
    const [aboutUsData] = await db.select().from(aboutUs).where(eq(aboutUs.id, id));
    return aboutUsData;
  }

  async createAboutUs(aboutUsData: InsertAboutUs): Promise<AboutUs> {
    const [newAboutUs] = await db
      .insert(aboutUs)
      .values(aboutUsData)
      .returning();
    return newAboutUs;
  }

  async updateAboutUs(id: number, aboutUsData: Partial<InsertAboutUs>): Promise<AboutUs | undefined> {
    const [updatedAboutUs] = await db
      .update(aboutUs)
      .set(aboutUsData)
      .where(eq(aboutUs.id, id))
      .returning();
    return updatedAboutUs;
  }

  async deleteAboutUs(id: number): Promise<boolean> {
    const result = await db.delete(aboutUs).where(eq(aboutUs.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Subsidiary Companies methods
  async getSubsidiaryCompanies(): Promise<SubsidiaryCompany[]> {
    return await db.select().from(subsidiaryCompanies).orderBy(asc(subsidiaryCompanies.order));
  }

  async getActiveSubsidiaryCompanies(): Promise<SubsidiaryCompany[]> {
    return await db.select().from(subsidiaryCompanies).where(eq(subsidiaryCompanies.isActive, true)).orderBy(asc(subsidiaryCompanies.order));
  }

  async getSubsidiaryCompanyById(id: number): Promise<SubsidiaryCompany | undefined> {
    const [company] = await db.select().from(subsidiaryCompanies).where(eq(subsidiaryCompanies.id, id));
    return company;
  }

  async createSubsidiaryCompany(companyData: InsertSubsidiaryCompany): Promise<SubsidiaryCompany> {
    const [newCompany] = await db
      .insert(subsidiaryCompanies)
      .values(companyData)
      .returning();
    return newCompany;
  }

  async updateSubsidiaryCompany(id: number, companyData: Partial<InsertSubsidiaryCompany>): Promise<SubsidiaryCompany | undefined> {
    const [updatedCompany] = await db
      .update(subsidiaryCompanies)
      .set(companyData)
      .where(eq(subsidiaryCompanies.id, id))
      .returning();
    return updatedCompany;
  }

  async deleteSubsidiaryCompany(id: number): Promise<boolean> {
    const result = await db.delete(subsidiaryCompanies).where(eq(subsidiaryCompanies.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Contact Us methods
  async getContactUs(): Promise<ContactUs[]> {
    return await db.select().from(contactUs).orderBy(asc(contactUs.id));
  }

  async getActiveContactUs(): Promise<ContactUs[]> {
    return await db.select().from(contactUs).where(eq(contactUs.isActive, true)).orderBy(asc(contactUs.id));
  }

  async getContactUsById(id: number): Promise<ContactUs | undefined> {
    const [contactUsData] = await db.select().from(contactUs).where(eq(contactUs.id, id));
    return contactUsData;
  }

  async createContactUs(contactUsData: InsertContactUs): Promise<ContactUs> {
    const [newContactUs] = await db
      .insert(contactUs)
      .values(contactUsData)
      .returning();
    return newContactUs;
  }

  async updateContactUs(id: number, contactUsData: Partial<InsertContactUs>): Promise<ContactUs | undefined> {
    const [updatedContactUs] = await db
      .update(contactUs)
      .set(contactUsData)
      .where(eq(contactUs.id, id))
      .returning();
    return updatedContactUs;
  }

  async deleteContactUs(id: number): Promise<boolean> {
    const result = await db.delete(contactUs).where(eq(contactUs.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();