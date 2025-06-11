import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import path from "path";
import fs from "fs";
import { 
  insertCourseSchema,
  insertModuleSchema, 
  insertProjectSchema, 
  insertDocumentSchema,
  insertDocumentCategorySchema,
  insertDocumentTagSchema,
  insertMagazineSchema,
  insertArticleSchema,
  insertArticleContentSchema,
  insertSlideSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Override root route to serve Pistach platform directly
  app.get("/", (req, res) => {
    const htmlContent = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>پیستاط - مرکز آموزشی کشاورزی</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; margin: 0; padding: 0; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    </style>
</head>
<body class="bg-gray-50">
    <div id="app">
        <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-8 text-center">
            <h1 class="text-4xl font-bold text-green-600 mb-3">🌱 پیستاط</h1>
            <p class="text-xl text-gray-600 mb-2">مرکز آموزشی تخصصی کشاورزی مدرن</p>
            <p class="text-gray-500">یادگیری، پیشرفت، موفقیت</p>
        </div>
        <div class="container mx-auto px-4 py-8">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div class="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white text-center">
                    <div class="text-3xl font-bold mb-1" id="courses-count">-</div>
                    <div class="text-sm opacity-90">دوره فعال</div>
                </div>
                <div class="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white text-center">
                    <div class="text-3xl font-bold mb-1" id="projects-count">-</div>
                    <div class="text-sm opacity-90">پروژه</div>
                </div>
                <div class="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white text-center">
                    <div class="text-3xl font-bold mb-1" id="documents-count">-</div>
                    <div class="text-sm opacity-90">مقاله</div>
                </div>
                <div class="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl text-white text-center">
                    <div class="text-3xl font-bold mb-1">87%</div>
                    <div class="text-sm opacity-90">پیشرفت</div>
                </div>
            </div>
            <div class="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-2xl p-8 text-white mb-8">
                <h2 class="text-2xl font-bold mb-3">🎯 دوره پیشنهادی این هفته</h2>
                <h3 class="text-xl font-semibold mb-2">کشاورزی هوشمند با IoT</h3>
                <p class="mb-6 opacity-90">یادگیری فناوری‌های نوین اینترنت اشیا در کشاورزی مدرن</p>
                <button class="bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">شروع یادگیری رایگان</button>
            </div>
            <div id="loading-state" class="text-center py-8">
                <div class="spinner w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p class="text-gray-600">در حال بارگیری محتوا...</p>
            </div>
            <div id="content-sections" class="space-y-8" style="display: none;">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <span class="text-2xl">📖</span>کتابخانه دیجیتال
                    </h2>
                    <div id="documents-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
                </div>
                <div class="bg-white rounded-2xl shadow-lg p-6">
                    <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <span class="text-2xl">📊</span>فعالیت‌های اخیر
                    </h2>
                    <div class="space-y-4">
                        <div class="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                            <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                                <span class="text-white text-lg">📚</span>
                            </div>
                            <div class="flex-1">
                                <p class="font-medium text-gray-800">مطالعه جدیدترین مقالات کشاورزی</p>
                                <p class="text-sm text-gray-500">همین الان • آماده برای یادگیری</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                            <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                                <span class="text-white text-lg">🚀</span>
                            </div>
                            <div class="flex-1">
                                <p class="font-medium text-gray-800">شروع پروژه‌های عملی جدید</p>
                                <p class="text-sm text-gray-500">آماده برای شروع • پروژه‌های متنوع</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl">
            <div class="flex justify-around py-2">
                <button onclick="setActiveTab('home')" class="nav-btn flex flex-col items-center py-2 px-4 text-green-600">
                    <span class="text-xl mb-1">🏠</span><span class="text-xs font-medium">خانه</span>
                </button>
                <button onclick="setActiveTab('courses')" class="nav-btn flex flex-col items-center py-2 px-4 text-gray-400">
                    <span class="text-xl mb-1">📚</span><span class="text-xs font-medium">دوره‌ها</span>
                </button>
                <button onclick="setActiveTab('projects')" class="nav-btn flex flex-col items-center py-2 px-4 text-gray-400">
                    <span class="text-xl mb-1">🚀</span><span class="text-xs font-medium">پروژه‌ها</span>
                </button>
                <button onclick="setActiveTab('library')" class="nav-btn flex flex-col items-center py-2 px-4 text-gray-400">
                    <span class="text-xl mb-1">📖</span><span class="text-xs font-medium">کتابخانه</span>
                </button>
                <button onclick="setActiveTab('profile')" class="nav-btn flex flex-col items-center py-2 px-4 text-gray-400">
                    <span class="text-xl mb-1">👤</span><span class="text-xs font-medium">پروفایل</span>
                </button>
            </div>
        </div>
    </div>
    <script>
        let currentTab = 'home';
        function setActiveTab(tab) {
            currentTab = tab;
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.className = 'nav-btn flex flex-col items-center py-2 px-4 text-gray-400';
            });
            event.target.closest('.nav-btn').className = 'nav-btn flex flex-col items-center py-2 px-4 text-green-600';
            if (tab !== 'home') {
                const names = {'courses': 'دوره‌ها', 'projects': 'پروژه‌ها', 'library': 'کتابخانه', 'profile': 'پروفایل'};
                document.getElementById('content-sections').innerHTML = 
                    \`<div class="text-center py-20 text-gray-600">صفحه \${names[tab] || tab} - به زودی</div>\`;
            } else {
                loadHomeContent();
            }
        }
        async function loadData() {
            try {
                const [coursesResponse, projectsResponse, documentsResponse] = await Promise.all([
                    fetch('/api/courses').catch(() => ({ ok: false })),
                    fetch('/api/projects').catch(() => ({ ok: false })),
                    fetch('/api/documents').catch(() => ({ ok: false }))
                ]);
                const courses = coursesResponse.ok ? await coursesResponse.json() : [];
                const projects = projectsResponse.ok ? await projectsResponse.json() : [];
                const documents = documentsResponse.ok ? await documentsResponse.json() : [];
                document.getElementById('courses-count').textContent = courses.length;
                document.getElementById('projects-count').textContent = projects.length;
                document.getElementById('documents-count').textContent = documents.length;
                const documentsGrid = document.getElementById('documents-grid');
                documentsGrid.innerHTML = documents.slice(0, 6).map(doc => \`
                    <div class="bg-white rounded-xl shadow-lg p-4 card-hover transition-all duration-300">
                        <h3 class="font-bold text-gray-800 mb-2">\${doc.title}</h3>
                        <p class="text-gray-600 text-sm mb-3 line-clamp-2">\${doc.excerpt || doc.content || 'محتوای مفیدی برای یادگیری'}</p>
                        <div class="flex justify-between items-center">
                            <span class="text-xs text-gray-500">\${doc.author || 'نویسنده ناشناخته'}</span>
                            <button class="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 transition-colors">دانلود</button>
                        </div>
                    </div>
                \`).join('');
                document.getElementById('loading-state').style.display = 'none';
                document.getElementById('content-sections').style.display = 'block';
            } catch (error) {
                console.warn('Error loading data:', error);
                document.getElementById('loading-state').innerHTML = '<p class="text-red-500">خطا در بارگیری داده‌ها</p>';
                setTimeout(() => {
                    document.getElementById('courses-count').textContent = '0';
                    document.getElementById('projects-count').textContent = '0';
                    document.getElementById('documents-count').textContent = '0';
                    document.getElementById('loading-state').style.display = 'none';
                    document.getElementById('content-sections').style.display = 'block';
                }, 2000);
            }
        }
        function loadHomeContent() {
            document.getElementById('content-sections').style.display = 'block';
        }
        document.addEventListener('DOMContentLoaded', function() {
            console.log('✅ پیستاط - پلتفرم آموزشی بارگذاری شد');
            loadData();
        });
    </script>
    <div style="height: 80px;"></div>
</body>
</html>`;
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    });
    res.end(htmlContent);
  });

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

  // دسته‌بندی اسناد API
  app.get("/api/document-categories", async (req, res) => {
    const categories = await storage.getDocumentCategories();
    res.json(categories);
  });

  app.get("/api/document-categories/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "کد دسته‌بندی نامعتبر است" });
    }

    const category = await storage.getDocumentCategory(id);
    
    if (!category) {
      return res.status(404).json({ message: "دسته‌بندی پیدا نشد" });
    }

    res.json(category);
  });

  app.post("/api/document-categories", async (req, res) => {
    try {
      const validatedData = insertDocumentCategorySchema.parse(req.body);
      const category = await storage.createDocumentCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "خطای داخلی سرور" });
    }
  });

  app.put("/api/document-categories/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "کد دسته‌بندی نامعتبر است" });
    }

    try {
      const updatedCategory = await storage.updateDocumentCategory(id, req.body);
      
      if (!updatedCategory) {
        return res.status(404).json({ message: "دسته‌بندی پیدا نشد" });
      }

      res.json(updatedCategory);
    } catch (error) {
      res.status(500).json({ message: "خطای داخلی سرور" });
    }
  });

  app.delete("/api/document-categories/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "کد دسته‌بندی نامعتبر است" });
    }

    const result = await storage.deleteDocumentCategory(id);
    
    if (!result) {
      return res.status(404).json({ message: "دسته‌بندی پیدا نشد" });
    }

    res.status(204).end();
  });

  // تگ‌های اسناد API
  app.get("/api/document-tags", async (req, res) => {
    const tags = await storage.getDocumentTags();
    res.json(tags);
  });

  app.get("/api/document-tags/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "کد تگ نامعتبر است" });
    }

    const tag = await storage.getDocumentTag(id);
    
    if (!tag) {
      return res.status(404).json({ message: "تگ پیدا نشد" });
    }

    res.json(tag);
  });

  app.post("/api/document-tags", async (req, res) => {
    try {
      const validatedData = insertDocumentTagSchema.parse(req.body);
      const tag = await storage.createDocumentTag(validatedData);
      res.status(201).json(tag);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "خطای داخلی سرور" });
    }
  });

  app.put("/api/document-tags/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "کد تگ نامعتبر است" });
    }

    try {
      const updatedTag = await storage.updateDocumentTag(id, req.body);
      
      if (!updatedTag) {
        return res.status(404).json({ message: "تگ پیدا نشد" });
      }

      res.json(updatedTag);
    } catch (error) {
      res.status(500).json({ message: "خطای داخلی سرور" });
    }
  });

  app.delete("/api/document-tags/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "کد تگ نامعتبر است" });
    }

    const result = await storage.deleteDocumentTag(id);
    
    if (!result) {
      return res.status(404).json({ message: "تگ پیدا نشد" });
    }

    res.status(204).end();
  });

  // اسناد کتابخانه API
  app.get("/api/documents", async (req, res) => {
    const { category, tag, featured, search } = req.query;
    
    try {
      let documents;
      
      if (category) {
        documents = await storage.getDocumentsByCategory(parseInt(category as string));
      } else if (tag) {
        documents = await storage.getDocumentsByTag(parseInt(tag as string));
      } else if (featured === 'true') {
        documents = await storage.getFeaturedDocuments();
      } else if (search) {
        documents = await storage.searchDocuments(search as string);
      } else {
        documents = await storage.getDocuments();
      }
      
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "خطای داخلی سرور" });
    }
  });

  app.get("/api/documents/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "کد سند نامعتبر است" });
    }

    const document = await storage.getDocument(id);
    
    if (!document) {
      return res.status(404).json({ message: "سند پیدا نشد" });
    }

    // افزایش تعداد بازدید
    await storage.incrementViewCount(id);

    res.json(document);
  });

  app.get("/api/documents/slug/:slug", async (req, res) => {
    const { slug } = req.params;
    
    const document = await storage.getDocumentBySlug(slug);
    
    if (!document) {
      return res.status(404).json({ message: "سند پیدا نشد" });
    }

    // افزایش تعداد بازدید
    await storage.incrementViewCount(document.id);

    res.json(document);
  });

  app.post("/api/documents", async (req, res) => {
    try {
      const validatedData = insertDocumentSchema.parse(req.body);
      const document = await storage.createDocument(validatedData);
      res.status(201).json(document);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "خطای داخلی سرور" });
    }
  });

  app.put("/api/documents/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "کد سند نامعتبر است" });
    }

    try {
      const updatedDocument = await storage.updateDocument(id, req.body);
      
      if (!updatedDocument) {
        return res.status(404).json({ message: "سند پیدا نشد" });
      }

      res.json(updatedDocument);
    } catch (error) {
      res.status(500).json({ message: "خطای داخلی سرور" });
    }
  });

  app.delete("/api/documents/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "کد سند نامعتبر است" });
    }

    const result = await storage.deleteDocument(id);
    
    if (!result) {
      return res.status(404).json({ message: "سند پیدا نشد" });
    }

    res.status(204).end();
  });

  app.post("/api/documents/:id/download", async (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "کد سند نامعتبر است" });
    }

    // افزایش تعداد دانلود
    await storage.incrementDownloadCount(id);
    
    res.json({ message: "دانلود با موفقیت ثبت شد" });
  });

  // Course access control API
  app.get("/api/courses/:courseId/access/:userId", async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const userId = parseInt(req.params.userId);
      
      if (isNaN(courseId) || isNaN(userId)) {
        return res.status(400).json({ message: "کد دوره یا کاربر نامعتبر است" });
      }
      
      const canAccess = await storage.canAccessCourse(userId, courseId);
      const canDownload = await storage.canDownloadContent(userId, courseId);
      
      res.json({ canAccess, canDownload });
    } catch (error) {
      console.error("Error checking course access:", error);
      res.status(500).json({ message: "خطا در بررسی دسترسی دوره" });
    }
  });

  app.post("/api/users/:userId/grant-course-access", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { courseId, accessType, expiryDate } = req.body;
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "کد کاربر نامعتبر است" });
      }
      
      const access = await storage.grantCourseAccess({
        userId,
        courseId,
        accessType,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        isActive: true
      });
      
      res.json(access);
    } catch (error) {
      console.error("Error granting course access:", error);
      res.status(500).json({ message: "خطا در اعطای دسترسی دوره" });
    }
  });

  app.delete("/api/users/:userId/revoke-course-access/:courseId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const courseId = parseInt(req.params.courseId);
      
      if (isNaN(userId) || isNaN(courseId)) {
        return res.status(400).json({ message: "کد کاربر یا دوره نامعتبر است" });
      }
      
      const success = await storage.revokeCourseAccess(userId, courseId);
      
      if (success) {
        res.json({ message: "دسترسی دوره با موفقیت لغو شد" });
      } else {
        res.status(404).json({ message: "دسترسی دوره پیدا نشد" });
      }
    } catch (error) {
      console.error("Error revoking course access:", error);
      res.status(500).json({ message: "خطا در لغو دسترسی دوره" });
    }
  });

  app.get("/api/users/:userId/course-access", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "کد کاربر نامعتبر است" });
      }
      
      const userAccess = await storage.getUserCourseAccess(userId);
      res.json(userAccess);
    } catch (error) {
      console.error("Error fetching user course access:", error);
      res.status(500).json({ message: "خطا در بازیابی دسترسی‌های کاربر" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}