import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { 
  insertCourseSchema, 
  insertProjectSchema, 
  insertDocumentSchema, 
  insertMagazineSchema,
  insertArticleSchema,
  insertArticleContentSchema,
  insertSlideSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes with /api prefix

  // Users API
  app.get("/api/user/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await storage.getUser(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  });

  app.post("/api/users", async (req, res) => {
    try {
      const user = await storage.createUser(req.body);
      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json({ message: "خطا در ایجاد کاربر" });
    }
  });

  // Admin login API
  app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "نام کاربری و رمز عبور الزامی است" });
    }

    const user = await storage.getUserByUsername(username);

    if (!user || user.password !== password || user.role !== "admin") {
      return res.status(401).json({ message: "نام کاربری یا رمز عبور اشتباه است" });
    }

    return res.json({ 
      message: "ورود موفقیت‌آمیز", 
      user: { 
        id: user.id, 
        username: user.username, 
        name: user.name, 
        role: user.role 
      } 
    });
  });

  // Courses API
  app.get("/api/courses", async (req, res) => {
    const courses = await storage.getCourses();
    res.json(courses);
  });

  app.get("/api/courses/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const course = await storage.getCourse(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.json(course);
  });

  app.patch("/api/courses/:id/progress", async (req, res) => {
    const id = parseInt(req.params.id);
    const { progress } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    if (typeof progress !== 'number' || progress < 0 || progress > 100) {
      return res.status(400).json({ message: "Invalid progress value" });
    }

    const updatedCourse = await storage.updateCourseProgress(id, progress);

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.json(updatedCourse);
  });

  app.post("/api/courses", async (req, res) => {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Modules API
  app.get("/api/courses/:courseId/modules", async (req, res) => {
    const courseId = parseInt(req.params.courseId);

    if (isNaN(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const modules = await storage.getModulesByCourseId(courseId);
    res.json(modules);
  });

  app.get("/api/modules/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid module ID" });
    }

    const module = await storage.getModule(id);

    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    return res.json(module);
  });

  app.post("/api/modules", async (req, res) => {
    try {
      const moduleData = insertModuleSchema.parse(req.body);
      const module = await storage.createModule(moduleData);
      res.status(201).json(module);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Projects API
  app.get("/api/projects", async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get("/api/projects/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await storage.getProject(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.json(project);
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Documents API
  app.get("/api/documents", async (req, res) => {
    const documents = await storage.getDocuments();
    res.json(documents);
  });

  app.get("/api/documents/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid document ID" });
    }

    const document = await storage.getDocument(id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    return res.json(document);
  });

  app.post("/api/documents", async (req, res) => {
    try {
      const documentData = insertDocumentSchema.parse(req.body);
      const document = await storage.createDocument(documentData);
      res.status(201).json(document);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Media content API
  app.get("/api/media/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid media ID" });
    }

    const mediaContent = await storage.getMediaContent(id);

    if (!mediaContent) {
      return res.status(404).json({ message: "Media content not found" });
    }

    return res.json(mediaContent);
  });

  // مجلات API
  app.get("/api/magazines", async (req, res) => {
    const magazines = await storage.getMagazines();
    res.json(magazines);
  });

  app.get("/api/magazines/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "کد مجله نامعتبر است" });
    }

    const magazine = await storage.getMagazine(id);

    if (!magazine) {
      return res.status(404).json({ message: "مجله پیدا نشد" });
    }

    return res.json(magazine);
  });

  app.post("/api/magazines", async (req, res) => {
    try {
      const magazineData = insertMagazineSchema.parse(req.body);
      const magazine = await storage.createMagazine(magazineData);
      res.status(201).json(magazine);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "خطای داخلی سرور" });
      }
    }
  });

  app.patch("/api/magazines/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "کد مجله نامعتبر است" });
    }

    try {
      const updatedMagazine = await storage.updateMagazine(id, req.body);

      if (!updatedMagazine) {
        return res.status(404).json({ message: "مجله پیدا نشد" });
      }

      return res.json(updatedMagazine);
    } catch (error) {
      res.status(500).json({ message: "خطای داخلی سرور" });
    }
  });

  app.delete("/api/magazines/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "کد مجله نامعتبر است" });
    }

    const result = await storage.deleteMagazine(id);

    if (!result) {
      return res.status(404).json({ message: "مجله پیدا نشد" });
    }

    return res.status(204).end();
  });

  // مقالات API
  app.get("/api/articles", async (req, res) => {
    const articles = await storage.getArticles();
    res.json(articles);
  });

  app.get("/api/magazines/:magazineId/articles", async (req, res) => {
    const magazineId = parseInt(req.params.magazineId);

    if (isNaN(magazineId)) {
      return res.status(400).json({ message: "کد مجله نامعتبر است" });
    }

    const articles = await storage.getArticlesByMagazineId(magazineId);
    res.json(articles);
  });

  app.get("/api/articles/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "کد مقاله نامعتبر است" });
    }

    const article = await storage.getArticle(id);

    if (!article) {
      return res.status(404).json({ message: "مقاله پیدا نشد" });
    }

    return res.json(article);
  });

  app.post("/api/articles", async (req, res) => {
    try {
      const articleData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(articleData);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "خطای داخلی سرور" });
      }
    }
  });

  app.patch("/api/articles/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "کد مقاله نامعتبر است" });
    }

    try {
      const updatedArticle = await storage.updateArticle(id, req.body);

      if (!updatedArticle) {
        return res.status(404).json({ message: "مقاله پیدا نشد" });
      }

      return res.json(updatedArticle);
    } catch (error) {
      res.status(500).json({ message: "خطای داخلی سرور" });
    }
  });

  app.delete("/api/articles/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "کد مقاله نامعتبر است" });
    }

    const result = await storage.deleteArticle(id);

    if (!result) {
      return res.status(404).json({ message: "مقاله پیدا نشد" });
    }

    return res.status(204).end();
  });

  // محتوای مقالات API
  app.get("/api/articles/:articleId/contents", async (req, res) => {
    const articleId = parseInt(req.params.articleId);

    if (isNaN(articleId)) {
      return res.status(400).json({ message: "کد مقاله نامعتبر است" });
    }

    const contents = await storage.getArticleContents(articleId);
    res.json(contents);
  });

  app.post("/api/article-contents", async (req, res) => {
    try {
      const contentData = insertArticleContentSchema.parse(req.body);
      const content = await storage.createArticleContent(contentData);
      res.status(201).json(content);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "خطای داخلی سرور" });
      }
    }
  });

  app.patch("/api/article-contents/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "کد محتوا نامعتبر است" });
    }

    try {
      const updatedContent = await storage.updateArticleContent(id, req.body);

      if (!updatedContent) {
        return res.status(404).json({ message: "محتوا پیدا نشد" });
      }

      return res.json(updatedContent);
    } catch (error) {
      res.status(500).json({ message: "خطای داخلی سرور" });
    }
  });

  app.delete("/api/article-contents/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "کد محتوا نامعتبر است" });
    }

    const result = await storage.deleteArticleContent(id);

    if (!result) {
      return res.status(404).json({ message: "محتوا پیدا نشد" });
    }

    return res.status(204).end();
  });

  // کارگاه‌ها API
  app.get("/api/workshops", async (req, res) => {
    const workshops = await storage.getWorkshops();
    res.json(workshops);
  });

  app.get("/api/workshops/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "کد کارگاه نامعتبر است" });
    }

    const workshop = await storage.getWorkshop(id);

    if (!workshop) {
      return res.status(404).json({ message: "کارگاه پیدا نشد" });
    }

    return res.json(workshop);
  });

  app.post("/api/workshops", async (req, res) => {
    try {
      const workshopData = req.body; // Schema validation در DatabaseStorage انجام می‌شود
      const workshop = await storage.createWorkshop(workshopData);
      res.status(201).json(workshop);
    } catch (error) {
      console.error("خطا در ایجاد کارگاه:", error);
      res.status(500).json({ message: "خطای داخلی سرور" });
    }
  });

  app.patch("/api/workshops/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "کد کارگاه نامعتبر است" });
    }

    try {
      const updatedWorkshop = await storage.updateWorkshop(id, req.body);

      if (!updatedWorkshop) {
        return res.status(404).json({ message: "کارگاه پیدا نشد" });
      }

      return res.json(updatedWorkshop);
    } catch (error) {
      console.error("خطا در به‌روزرسانی کارگاه:", error);
      res.status(500).json({ message: "خطای داخلی سرور" });
    }
  });

  app.delete("/api/workshops/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "کد کارگاه نامعتبر است" });
    }

    const result = await storage.deleteWorkshop(id);

    if (!result) {
      return res.status(404).json({ message: "کارگاه پیدا نشد" });
    }

    return res.status(204).end();
  });

  // محتوای کارگاه‌ها API
  app.get("/api/workshops/:workshopId/contents", async (req, res) => {
    const workshopId = parseInt(req.params.workshopId);

    if (isNaN(workshopId)) {
      return res.status(400).json({ message: "کد کارگاه نامعتبر است" });
    }

    const contents = await storage.getWorkshopContents(workshopId);
    res.json(contents);
  });

  app.post("/api/workshop-contents", async (req, res) => {
    try {
      const contentData = req.body;
      const content = await storage.createWorkshopContent(contentData);
      res.status(201).json(content);
    } catch (error) {
      console.error("خطا در ایجاد محتوای کارگاه:", error);
      res.status(500).json({ message: "خطای داخلی سرور" });
    }
  });

  app.patch("/api/workshop-contents/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "کد محتوا نامعتبر است" });
    }

    try {
      const updatedContent = await storage.updateWorkshopContent(id, req.body);

      if (!updatedContent) {
        return res.status(404).json({ message: "محتوا پیدا نشد" });
      }

      return res.json(updatedContent);
    } catch (error) {
      console.error("خطا در به‌روزرسانی محتوای کارگاه:", error);
      res.status(500).json({ message: "خطای داخلی سرور" });
    }
  });

  app.delete("/api/workshop-contents/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "کد محتوا نامعتبر است" });
    }

    const result = await storage.deleteWorkshopContent(id);

    if (!result) {
      return res.status(404).json({ message: "محتوا پیدا نشد" });
    }

    return res.status(204).end();
  });

  // Slides API
  app.get("/api/slides", async (req, res) => {
    const slides = await storage.getSlides();
    res.json(slides);
  });

  app.get("/api/slides/active", async (req, res) => {
    const slides = await storage.getActiveSlides();
    res.json(slides);
  });

  app.get("/api/slides/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "کد اسلاید نامعتبر است" });
    }

    const slide = await storage.getSlide(id);

    if (!slide) {
      return res.status(404).json({ message: "اسلاید پیدا نشد" });
    }

    return res.json(slide);
  });

  app.post("/api/slides", async (req, res) => {
    try {
      const slideData = insertSlideSchema.parse(req.body);
      const slide = await storage.createSlide(slideData);
      return res.status(201).json(slide);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: "خطا در ایجاد اسلاید" });
    }
  });

  app.patch("/api/slides/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "کد اسلاید نامعتبر است" });
    }

    try {
      const slideData = req.body;
      const slide = await storage.updateSlide(id, slideData);

      if (!slide) {
        return res.status(404).json({ message: "اسلاید پیدا نشد" });
      }

      return res.json(slide);
    } catch (error) {
      return res.status(500).json({ message: "خطا در بروزرسانی اسلاید" });
    }
  });

  app.delete("/api/slides/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "کد اسلاید نامعتبر است" });
    }

    const result = await storage.deleteSlide(id);

    if (!result) {
      return res.status(404).json({ message: "اسلاید پیدا نشد" });
    }

    return res.status(204).end();
  });

  const httpServer = createServer(app);
  return httpServer;
}