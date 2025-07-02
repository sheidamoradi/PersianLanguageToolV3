import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import path from "path";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { 
  insertCourseSchema,
  insertModuleSchema, 
  insertProjectSchema, 
  insertDocumentSchema,
  insertDocumentCategorySchema,
  insertDocumentTagSchema,
  insertMediaContentSchema,
  insertMagazineSchema,
  insertQuickAccessItemSchema,
  insertArticleSchema,
  insertArticleContentSchema,
  insertWorkshopSchema,
  insertSlideSchema
} from "@shared/schema";

// Configure multer for file uploads
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, extension);
      cb(null, baseName + '-' + uniqueSuffix + extension);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|svg|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('فقط فایل‌های تصویری و PDF مجاز هستند'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes with /api prefix

  // File Upload API
  app.post("/api/upload", upload.array('files', 10), async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "هیچ فایلی انتخاب نشده" });
      }

      const files = (req.files as Express.Multer.File[]).map(file => ({
        id: Date.now() + Math.random(),
        name: file.originalname,
        filename: file.filename,
        url: `/uploads/${file.filename}`,
        type: file.mimetype.startsWith('image/') ? 'image' : 'document',
        size: `${(file.size / 1024).toFixed(0)} KB`,
        uploadedAt: new Date().toISOString()
      }));

      return res.status(201).json({
        message: "فایل‌ها با موفقیت آپلود شدند",
        files
      });
    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ message: "خطا در آپلود فایل" });
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

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
      return res.status(201).json(course);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      return res.status(500).json({ message: "خطا در ایجاد دوره" });
    }
  });

  // Modules API
  app.get("/api/modules/course/:courseId", async (req, res) => {
    const courseId = parseInt(req.params.courseId);

    if (isNaN(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const modules = await storage.getModulesByCourseId(courseId);
    return res.json(modules);
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
      return res.status(201).json(module);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      return res.status(500).json({ message: "خطا در ایجاد ماژول" });
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
      return res.status(201).json(project);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      return res.status(500).json({ message: "خطا در ایجاد پروژه" });
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
      return res.status(201).json(document);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      return res.status(500).json({ message: "خطا در ایجاد سند" });
    }
  });

  // Media Content API
  app.get("/api/media/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid media content ID" });
    }

    const mediaContent = await storage.getMediaContent(id);

    if (!mediaContent) {
      return res.status(404).json({ message: "Media content not found" });
    }

    return res.json(mediaContent);
  });

  app.post("/api/media", async (req, res) => {
    try {
      const mediaData = insertMediaContentSchema.parse(req.body);
      const mediaContent = await storage.createMediaContent(mediaData);
      return res.status(201).json(mediaContent);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      return res.status(500).json({ message: "خطا در ایجاد محتوای رسانه‌ای" });
    }
  });

  // Magazines API
  app.get("/api/magazines", async (req, res) => {
    const magazines = await storage.getMagazines();
    res.json(magazines);
  });

  app.get("/api/magazines/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid magazine ID" });
    }

    const magazine = await storage.getMagazine(id);

    if (!magazine) {
      return res.status(404).json({ message: "Magazine not found" });
    }

    return res.json(magazine);
  });

  app.post("/api/magazines", async (req, res) => {
    try {
      const magazineData = insertMagazineSchema.parse(req.body);
      const magazine = await storage.createMagazine(magazineData);
      return res.status(201).json(magazine);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      return res.status(500).json({ message: "خطا در ایجاد مجله" });
    }
  });

  app.put("/api/magazines/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid magazine ID" });
    }

    try {
      const magazineData = insertMagazineSchema.partial().parse(req.body);
      const updatedMagazine = await storage.updateMagazine(id, magazineData);

      if (!updatedMagazine) {
        return res.status(404).json({ message: "Magazine not found" });
      }

      return res.json(updatedMagazine);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      return res.status(500).json({ message: "خطا در به‌روزرسانی مجله" });
    }
  });

  app.delete("/api/magazines/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid magazine ID" });
    }

    const deleted = await storage.deleteMagazine(id);

    if (!deleted) {
      return res.status(404).json({ message: "Magazine not found" });
    }

    return res.json({ message: "Magazine deleted successfully" });
  });

  // Articles API
  app.get("/api/articles", async (req, res) => {
    const articles = await storage.getArticles();
    res.json(articles);
  });

  app.get("/api/articles/magazine/:magazineId", async (req, res) => {
    const magazineId = parseInt(req.params.magazineId);

    if (isNaN(magazineId)) {
      return res.status(400).json({ message: "Invalid magazine ID" });
    }

    const articles = await storage.getArticlesByMagazineId(magazineId);
    return res.json(articles);
  });

  app.get("/api/articles/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid article ID" });
    }

    const article = await storage.getArticle(id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    return res.json(article);
  });

  app.post("/api/articles", async (req, res) => {
    try {
      const articleData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(articleData);
      return res.status(201).json(article);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      return res.status(500).json({ message: "خطا در ایجاد مقاله" });
    }
  });

  app.put("/api/articles/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid article ID" });
    }

    try {
      const articleData = insertArticleSchema.partial().parse(req.body);
      const updatedArticle = await storage.updateArticle(id, articleData);

      if (!updatedArticle) {
        return res.status(404).json({ message: "Article not found" });
      }

      return res.json(updatedArticle);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      return res.status(500).json({ message: "خطا در به‌روزرسانی مقاله" });
    }
  });

  app.delete("/api/articles/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid article ID" });
    }

    const deleted = await storage.deleteArticle(id);

    if (!deleted) {
      return res.status(404).json({ message: "Article not found" });
    }

    return res.json({ message: "Article deleted successfully" });
  });

  // Workshops API
  app.get("/api/workshops", async (req, res) => {
    const workshops = await storage.getWorkshops();
    res.json(workshops);
  });

  app.get("/api/workshops/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid workshop ID" });
    }

    const workshop = await storage.getWorkshop(id);

    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    return res.json(workshop);
  });

  app.post("/api/workshops", async (req, res) => {
    try {
      const workshopData = insertWorkshopSchema.parse(req.body);
      const workshop = await storage.createWorkshop(workshopData);
      return res.status(201).json(workshop);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      return res.status(500).json({ message: "خطا در ایجاد کارگاه" });
    }
  });

  app.put("/api/workshops/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid workshop ID" });
    }

    try {
      const workshopData = insertWorkshopSchema.partial().parse(req.body);
      const updatedWorkshop = await storage.updateWorkshop(id, workshopData);

      if (!updatedWorkshop) {
        return res.status(404).json({ message: "Workshop not found" });
      }

      return res.json(updatedWorkshop);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      return res.status(500).json({ message: "خطا در به‌روزرسانی کارگاه" });
    }
  });

  app.delete("/api/workshops/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid workshop ID" });
    }

    const deleted = await storage.deleteWorkshop(id);

    if (!deleted) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    return res.json({ message: "Workshop deleted successfully" });
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
      return res.status(400).json({ message: "Invalid slide ID" });
    }

    const slide = await storage.getSlide(id);

    if (!slide) {
      return res.status(404).json({ message: "Slide not found" });
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
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      return res.status(500).json({ message: "خطا در ایجاد اسلاید" });
    }
  });

  app.put("/api/slides/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid slide ID" });
    }

    try {
      const slideData = insertSlideSchema.partial().parse(req.body);
      const updatedSlide = await storage.updateSlide(id, slideData);

      if (!updatedSlide) {
        return res.status(404).json({ message: "Slide not found" });
      }

      return res.json(updatedSlide);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      return res.status(500).json({ message: "خطا در به‌روزرسانی اسلاید" });
    }
  });

  app.delete("/api/slides/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid slide ID" });
    }

    const deleted = await storage.deleteSlide(id);

    if (!deleted) {
      return res.status(404).json({ message: "Slide not found" });
    }

    return res.json({ message: "Slide deleted successfully" });
  });

  // Quick Access Items API
  app.get("/api/quick-access", async (req, res) => {
    const items = await storage.getQuickAccessItems();
    res.json(items);
  });

  app.post("/api/quick-access", async (req, res) => {
    try {
      const itemData = insertQuickAccessItemSchema.parse(req.body);
      const item = await storage.createQuickAccessItem(itemData);
      return res.status(201).json(item);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      return res.status(500).json({ message: "خطا در ایجاد آیتم دسترسی سریع" });
    }
  });

  app.put("/api/quick-access/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid item ID" });
    }

    try {
      const itemData = insertQuickAccessItemSchema.parse(req.body);
      const item = await storage.updateQuickAccessItem(id, itemData);
      
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      return res.json(item);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      return res.status(500).json({ message: "خطا در به‌روزرسانی آیتم دسترسی سریع" });
    }
  });

  app.delete("/api/quick-access/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid item ID" });
    }

    const deleted = await storage.deleteQuickAccessItem(id);

    if (!deleted) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.json({ message: "Quick access item deleted successfully" });
  });

  // Protection Control Endpoints
  app.patch("/api/courses/:id/protection", async (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    try {
      const updatedCourse = await storage.updateCourseProtection(id, req.body);
      
      if (!updatedCourse) {
        return res.status(404).json({ message: "Course not found" });
      }

      return res.json(updatedCourse);
    } catch (error) {
      return res.status(500).json({ message: "خطا در به‌روزرسانی تنظیمات حفاظت" });
    }
  });

  app.patch("/api/projects/:id/protection", async (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    try {
      const updatedProject = await storage.updateProjectProtection(id, req.body);
      
      if (!updatedProject) {
        return res.status(404).json({ message: "Project not found" });
      }

      return res.json(updatedProject);
    } catch (error) {
      return res.status(500).json({ message: "خطا در به‌روزرسانی تنظیمات حفاظت" });
    }
  });

  app.patch("/api/documents/:id/protection", async (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid document ID" });
    }

    try {
      const updatedDocument = await storage.updateDocumentProtection(id, req.body);
      
      if (!updatedDocument) {
        return res.status(404).json({ message: "Document not found" });
      }

      return res.json(updatedDocument);
    } catch (error) {
      return res.status(500).json({ message: "خطا در به‌روزرسانی تنظیمات حفاظت" });
    }
  });

  app.patch("/api/magazines/:id/protection", async (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid magazine ID" });
    }

    try {
      const updatedMagazine = await storage.updateMagazineProtection(id, req.body);
      
      if (!updatedMagazine) {
        return res.status(404).json({ message: "Magazine not found" });
      }

      return res.json(updatedMagazine);
    } catch (error) {
      return res.status(500).json({ message: "خطا در به‌روزرسانی تنظیمات حفاظت" });
    }
  });

  const server = createServer(app);
  return server;
}