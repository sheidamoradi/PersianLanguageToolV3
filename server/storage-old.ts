import { 
  users, type User, type InsertUser,
  courses, type Course, type InsertCourse,
  modules, type Module, type InsertModule,
  projects, type Project, type InsertProject,
  documents, type Document, type InsertDocument,
  mediaContent, type MediaContent, type InsertMediaContent,
  magazines, type Magazine, type InsertMagazine,
  articles, type Article, type InsertArticle,
  articleContents, type ArticleContent, type InsertArticleContent,
  workshops, type Workshop, type InsertWorkshop,
  workshopContents, type WorkshopContent, type InsertWorkshopContent
} from "@shared/schema";

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

  // Document methods
  getDocuments(): Promise<Document[]>;
  getDocument(id: number): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;

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
}

export class DatabaseStorage implements IStorage {
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  private modules: Map<number, Module>;
  private projects: Map<number, Project>;
  private documents: Map<number, Document>;
  private mediaContents: Map<number, MediaContent>;
  private magazines: Map<number, Magazine>;
  private articles: Map<number, Article>;
  private articleContents: Map<number, ArticleContent>;
  private workshops: Map<number, Workshop>;
  private workshopContents: Map<number, WorkshopContent>;

  private userId: number;
  private courseId: number;
  private moduleId: number;
  private projectId: number;
  private documentId: number;
  private mediaContentId: number;
  private magazineId: number;
  private articleId: number;
  private articleContentId: number;
  private workshopId: number;
  private workshopContentId: number;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.modules = new Map();
    this.projects = new Map();
    this.documents = new Map();
    this.mediaContents = new Map();
    this.magazines = new Map();
    this.articles = new Map();
    this.articleContents = new Map();
    this.workshops = new Map();
    this.workshopContents = new Map();

    this.userId = 1;
    this.courseId = 1;
    this.moduleId = 1;
    this.projectId = 1;
    this.documentId = 1;
    this.mediaContentId = 1;
    this.magazineId = 1;
    this.articleId = 1;
    this.articleContentId = 1;
    this.workshopId = 1;
    this.workshopContentId = 1;

    // Initialize with sample data
    this.initSampleData();
  }

  private initSampleData() {
    // Create a default user
    this.createUser({
      username: "john.smith",
      password: "password123",
      name: "John Smith",
      progress: 42,
      membershipType: "Premium"
    });

    // Create sample courses
    const course1 = this.createCourse({
      title: "Web Development Fundamentals",
      description: "Learn the basics of web development including HTML, CSS, and JavaScript.",
      thumbnailUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      progress: 68,
      totalModules: 20,
      completedModules: 12,
      category: "Web Development",
      level: "Beginner",
      isNew: false,
      isPopular: true
    });

    const course2 = this.createCourse({
      title: "UI/UX Design Principles",
      description: "Master the fundamentals of user interface and experience design.",
      thumbnailUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      progress: 42,
      totalModules: 15,
      completedModules: 7,
      category: "Design",
      level: "Intermediate",
      isNew: false,
      isPopular: false
    });

    const course3 = this.createCourse({
      title: "Data Science Basics",
      description: "Introduction to data analysis, visualization, and machine learning.",
      thumbnailUrl: "https://pixabay.com/get/g40788b3d6008a7451a455e0226d955dd19f3d3a1ec5683869787b5db7c2cf2e5a21a2e02556c95e24e3502d58ec6ad22b81e203df9bcae8c8dbc971db3dfb9a8_1280.jpg",
      progress: 21,
      totalModules: 18,
      completedModules: 3,
      category: "Data Science",
      level: "Beginner",
      isNew: true,
      isPopular: false
    });

    // Create sample projects/magazines
    this.createProject({
      title: "Web Portfolio Project",
      description: "Build a responsive portfolio website to showcase your work.",
      thumbnailUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      type: "project",
      dueDate: "7 days",
      contentUrl: "/projects/web-portfolio",
      isLocked: false
    });

    this.createProject({
      title: "Modern Education Trends",
      description: "Explore the latest innovations and methodologies in education.",
      thumbnailUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      type: "magazine",
      pages: 26,
      contentUrl: "/documents/modern-education-trends",
      isLocked: true
    });

    this.createProject({
      title: "Digital Learning",
      description: "A comprehensive guide to effective online learning strategies.",
      thumbnailUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      type: "magazine",
      pages: 18,
      contentUrl: "/documents/digital-learning",
      isLocked: false
    });

    // Create sample documents
    this.createDocument({
      title: "Web Development Handbook",
      fileName: "Web Development Handbook.pdf",
      fileUrl: "/documents/web-development-handbook.pdf",
      fileType: "pdf",
      totalPages: 24,
      lastUpdated: "15 May 2023",
      allowDownload: true
    });

    // Create sample media content
    this.createMediaContent({
      title: "Introduction to JavaScript Frameworks",
      description: "Learn about the most popular JavaScript frameworks and their use cases.",
      thumbnailUrl: "",
      contentUrl: "/media/introduction-to-javascript-frameworks.mp4",
      duration: "12:34",
      instructorName: "Prof. Sarah Johnson",
      instructorTitle: "Web Development Instructor",
      instructorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    });

    // Create modules for courses
    this.createModule({
      courseId: 1,
      title: "Introduction to JavaScript Frameworks",
      duration: "12:34",
      type: "video",
      contentUrl: "/media/introduction-to-javascript-frameworks.mp4",
      isLocked: false,
      order: 1
    });

    this.createModule({
      courseId: 1,
      title: "React Fundamentals",
      duration: "23:45",
      type: "video",
      contentUrl: "/media/react-fundamentals.mp4",
      isLocked: true,
      order: 2
    });

    this.createModule({
      courseId: 1,
      title: "Vue.js Basics",
      duration: "18:12",
      type: "video",
      contentUrl: "/media/vue-basics.mp4",
      isLocked: true,
      order: 3
    });

    this.createModule({
      courseId: 1,
      title: "Angular Overview",
      duration: "20:56",
      type: "video",
      contentUrl: "/media/angular-overview.mp4",
      isLocked: true,
      order: 4
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Course methods
  async getCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.courseId++;
    const course: Course = { ...insertCourse, id };
    this.courses.set(id, course);
    return course;
  }

  async updateCourseProgress(id: number, progress: number): Promise<Course | undefined> {
    const course = this.courses.get(id);
    if (!course) return undefined;

    const updatedCourse = { ...course, progress };
    this.courses.set(id, updatedCourse);
    return updatedCourse;
  }

  // Module methods
  async getModulesByCourseId(courseId: number): Promise<Module[]> {
    return Array.from(this.modules.values())
      .filter(module => module.courseId === courseId)
      .sort((a, b) => a.order - b.order);
  }

  async getModule(id: number): Promise<Module | undefined> {
    return this.modules.get(id);
  }

  async createModule(insertModule: InsertModule): Promise<Module> {
    const id = this.moduleId++;
    const module: Module = { ...insertModule, id };
    this.modules.set(id, module);
    return module;
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectId++;
    const project: Project = { ...insertProject, id };
    this.projects.set(id, project);
    return project;
  }

  // Document methods
  async getDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values());
  }

  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.documentId++;
    const document: Document = { ...insertDocument, id };
    this.documents.set(id, document);
    return document;
  }

  // Media content methods
  async getMediaContent(id: number): Promise<MediaContent | undefined> {
    return this.mediaContents.get(id);
  }

  async createMediaContent(insertMediaContent: InsertMediaContent): Promise<MediaContent> {
    const id = this.mediaContentId++;
    const mediaContent: MediaContent = { ...insertMediaContent, id };
    this.mediaContents.set(id, mediaContent);
    return mediaContent;
  }

  // Magazine methods
  async getMagazines(): Promise<Magazine[]> {
    return Array.from(this.magazines.values());
  }

  async getMagazine(id: number): Promise<Magazine | undefined> {
    return this.magazines.get(id);
  }

  async createMagazine(magazine: InsertMagazine): Promise<Magazine> {
    const id = this.magazineId++;
    const newMagazine: Magazine = { 
      ...magazine, 
      id,
      createdAt: new Date(),
      updatedAt: new Date() 
    };
    this.magazines.set(id, newMagazine);
    return newMagazine;
  }

  async updateMagazine(id: number, magazine: Partial<InsertMagazine>): Promise<Magazine | undefined> {
    const existingMagazine = this.magazines.get(id);
    if (!existingMagazine) return undefined;

    const updatedMagazine: Magazine = { 
      ...existingMagazine, 
      ...magazine,
      updatedAt: new Date() 
    };
    this.magazines.set(id, updatedMagazine);
    return updatedMagazine;
  }

  async deleteMagazine(id: number): Promise<boolean> {
    return this.magazines.delete(id);
  }

  // Article methods
  async getArticles(): Promise<Article[]> {
    return Array.from(this.articles.values());
  }

  async getArticlesByMagazineId(magazineId: number): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.magazineId === magazineId)
      .sort((a, b) => a.order - b.order);
  }

  async getArticle(id: number): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const id = this.articleId++;
    const newArticle: Article = { 
      ...article, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.articles.set(id, newArticle);
    return newArticle;
  }

  async updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article | undefined> {
    const existingArticle = this.articles.get(id);
    if (!existingArticle) return undefined;

    const updatedArticle: Article = { 
      ...existingArticle, 
      ...article,
      updatedAt: new Date() 
    };
    this.articles.set(id, updatedArticle);
    return updatedArticle;
  }

  async deleteArticle(id: number): Promise<boolean> {
    return this.articles.delete(id);
  }

  // Article content methods
  async getArticleContents(articleId: number): Promise<ArticleContent[]> {
    return Array.from(this.articleContents.values())
      .filter(content => content.articleId === articleId)
      .sort((a, b) => a.order - b.order);
  }

  async createArticleContent(content: InsertArticleContent): Promise<ArticleContent> {
    const id = this.articleContentId++;
    const newContent: ArticleContent = { 
      ...content, 
      id,
      createdAt: new Date()
    };
    this.articleContents.set(id, newContent);
    return newContent;
  }

  async updateArticleContent(id: number, content: Partial<InsertArticleContent>): Promise<ArticleContent | undefined> {
    const existingContent = this.articleContents.get(id);
    if (!existingContent) return undefined;

    const updatedContent: ArticleContent = { 
      ...existingContent, 
      ...content,
      createdAt: existingContent.createdAt
    };
    this.articleContents.set(id, updatedContent);
    return updatedContent;
  }

  async deleteArticleContent(id: number): Promise<boolean> {
    return this.articleContents.delete(id);
  }

  // Workshop methods
  async getWorkshops(): Promise<Workshop[]> {
    return Array.from(this.workshops.values());
  }

  async getWorkshop(id: number): Promise<Workshop | undefined> {
    return this.workshops.get(id);
  }

  async createWorkshop(workshop: InsertWorkshop): Promise<Workshop> {
    const id = this.workshopId++;
    const newWorkshop: Workshop = { 
      ...workshop, 
      id,
      createdAt: new Date(),
      updatedAt: new Date() 
    };
    this.workshops.set(id, newWorkshop);
    return newWorkshop;
  }

  async updateWorkshop(id: number, workshop: Partial<InsertWorkshop>): Promise<Workshop | undefined> {
    const existingWorkshop = this.workshops.get(id);
    if (!existingWorkshop) return undefined;

    const updatedWorkshop: Workshop = { 
      ...existingWorkshop, 
      ...workshop,
      updatedAt: new Date() 
    };
    this.workshops.set(id, updatedWorkshop);
    return updatedWorkshop;
  }

  async deleteWorkshop(id: number): Promise<boolean> {
    return this.workshops.delete(id);
  }

  // Workshop content methods
  async getWorkshopContents(workshopId: number): Promise<WorkshopContent[]> {
    return Array.from(this.workshopContents.values())
      .filter(content => content.workshopId === workshopId)
      .sort((a, b) => a.order - b.order);
  }

  async createWorkshopContent(content: InsertWorkshopContent): Promise<WorkshopContent> {
    const id = this.workshopContentId++;
    const newContent: WorkshopContent = { 
      ...content, 
      id,
      createdAt: new Date()
    };
    this.workshopContents.set(id, newContent);
    return newContent;
  }

  async updateWorkshopContent(id: number, content: Partial<InsertWorkshopContent>): Promise<WorkshopContent | undefined> {
    const existingContent = this.workshopContents.get(id);
    if (!existingContent) return undefined;

    const updatedContent: WorkshopContent = { 
      ...existingContent, 
      ...content 
    };
    this.workshopContents.set(id, updatedContent);
    return updatedContent;
  }

  async deleteWorkshopContent(id: number): Promise<boolean> {
    return this.workshopContents.delete(id);
  }
}

export const storage = new DatabaseStorage();