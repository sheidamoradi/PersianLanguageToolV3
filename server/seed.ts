import { db } from "./db";
import { 
  users, courses, modules, projects, documents, mediaContent,
  magazines, articles, workshopContents, workshops, webinars, webinarSections 
} from "@shared/schema";

async function seedDatabase() {
  console.log("🌱 شروع مقداردهی اولیه دیتابیس...");

  try {
    // ایجاد کاربر ادمین
    await db.insert(users).values({
      id: 1,
      username: "admin",
      password: "admin123", // در محیط واقعی باید hash شود
      name: "مدیر سیستم",
      role: "admin",
      progress: 100,
      membershipType: "Premium"
    });

    // ایجاد کاربر معمولی نمونه
    await db.insert(users).values({
      id: 2,
      username: "user1",
      password: "user123",
      name: "علی احمدی",
      role: "user",
      progress: 30,
      membershipType: "Basic"
    });

    // ایجاد دوره‌های نمونه
    await db.insert(courses).values([
      {
        id: 1,
        title: "مبانی برنامه‌نویسی وب",
        description: "آموزش کامل HTML، CSS و JavaScript",
        thumbnailUrl: "/images/web-dev.jpg",
        progress: 0,
        totalModules: 12,
        completedModules: 0,
        category: "برنامه‌نویسی",
        level: "مقدماتی",
        isNew: true,
        isPopular: false
      },
      {
        id: 2,
        title: "طراحی UI/UX",
        description: "آموزش طراحی رابط کاربری و تجربه کاربری",
        thumbnailUrl: "/images/ui-ux.jpg",
        progress: 0,
        totalModules: 8,
        completedModules: 0,
        category: "طراحی",
        level: "متوسط",
        isNew: false,
        isPopular: true
      }
    ]);

    // ایجاد ماژول‌های نمونه
    await db.insert(modules).values([
      {
        id: 1,
        courseId: 1,
        title: "مقدمه‌ای بر HTML",
        duration: "45 دقیقه",
        type: "video",
        contentUrl: "/videos/html-intro.mp4",
        isLocked: false,
        order: 1
      },
      {
        id: 2,
        courseId: 1,
        title: "استایل‌دهی با CSS",
        duration: "60 دقیقه",
        type: "video",
        contentUrl: "/videos/css-basics.mp4",
        isLocked: true,
        order: 2
      }
    ]);

    // ایجاد پروژه‌های نمونه
    await db.insert(projects).values([
      {
        id: 1,
        title: "پروژه پورتفولیو شخصی",
        description: "ایجاد وب‌سایت پورتفولیو با HTML و CSS",
        thumbnailUrl: "/images/portfolio-project.jpg",
        type: "project",
        dueDate: "1403/12/15",
        pages: null,
        contentUrl: "/projects/portfolio.zip",
        isLocked: false
      },
      {
        id: 2,
        title: "مجله طراحی شماره 1",
        description: "آخرین ترندهای طراحی گرافیک",
        thumbnailUrl: "/images/design-magazine.jpg",
        type: "magazine",
        dueDate: null,
        pages: 24,
        contentUrl: "/magazines/design-1.pdf",
        isLocked: false
      }
    ]);

    // ایجاد اسناد نمونه
    await db.insert(documents).values([
      {
        id: 1,
        title: "راهنمای شروع سریع",
        fileName: "quick-start-guide.pdf",
        fileUrl: "/docs/quick-start.pdf",
        fileType: "pdf",
        totalPages: 10,
        lastUpdated: "1403/09/15",
        allowDownload: true
      }
    ]);

    // ایجاد محتوای رسانه‌ای نمونه
    await db.insert(mediaContent).values([
      {
        id: 1,
        title: "ویدیو معرفی پلتفرم",
        description: "آشنایی با ویژگی‌های پلتفرم یادگیری",
        thumbnailUrl: "/images/intro-video.jpg",
        contentUrl: "/videos/platform-intro.mp4",
        duration: "5 دقیقه",
        instructorName: "دکتر محمد رضایی",
        instructorTitle: "استاد دانشگاه",
        instructorAvatar: "/images/instructor-1.jpg"
      }
    ]);

    // ایجاد مجله‌های نمونه
    await db.insert(magazines).values([
      {
        id: 1,
        title: "مجله فناوری ایران",
        description: "آخرین اخبار و ترندهای فناوری",
        isActive: true,
        totalPages: 32,
        coverImageUrl: "/images/tech-magazine-cover.jpg",
        issueNumber: 15,
        publishDate: "1403/09/01",
        season: "پاییز 1403",
        pdfUrl: "/magazines/tech-iran-15.pdf",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // ایجاد مقاله‌های نمونه
    await db.insert(articles).values([
      {
        id: 1,
        title: "آینده هوش مصنوعی در ایران",
        magazineId: 1,
        thumbnailUrl: "/images/ai-future.jpg",
        order: 1,
        publishDate: "1403/09/01",
        content: "هوش مصنوعی یکی از مهم‌ترین فناوری‌های قرن 21 محسوب می‌شود...",
        summary: "بررسی وضعیت فعلی و آینده هوش مصنوعی در کشورمان",
        author: "دکتر علی احمدی",
        tags: "هوش مصنوعی,فناوری,ایران",
        readingTime: "8 دقیقه",
        pdfUrl: "/articles/ai-future-iran.pdf",
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // ایجاد کارگاه‌های نمونه
    await db.insert(workshops).values([
      {
        id: 1,
        title: "کارگاه طراحی وب‌سایت",
        description: "آموزش عملی طراحی وب‌سایت از صفر تا صد",
        category: "طراحی وب",
        level: "مقدماتی",
        duration: "4 ساعت",
        isActive: true,
        maxParticipants: 20,
        currentParticipants: 12,
        startDate: "1403/10/15",
        endDate: "1403/10/15",
        registrationOpen: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // ایجاد محتوای کارگاه‌ها
    await db.insert(workshopContents).values([
      {
        id: 1,
        workshopId: 1,
        title: "بخش اول: آشنایی با HTML",
        order: 1,
        content: "در این بخش با مبانی HTML آشنا می‌شویم...",
        contentType: "text",
        createdAt: new Date()
      },
      {
        id: 2,
        workshopId: 1,
        title: "بخش دوم: استایل‌دهی با CSS",
        order: 2,
        content: "نحوه استفاده از CSS برای زیباسازی صفحات وب...",
        contentType: "text",
        createdAt: new Date()
      }
    ]);

    // ایجاد وبینارهای نمونه
    await db.insert(webinars).values([
      {
        id: 1,
        title: "وبینار آموزشی React و Next.js",
        description: "آموزش کامل توسعه اپلیکیشن‌های وب مدرن با React و Next.js",
        posterUrl: "/uploads/webinar1.jpg",
        instructor: "دکتر محمد رضایی",
        duration: "2 ساعت",
        eventDate: "1403/10/20",
        level: "متوسط",
        category: "برنامه‌نویسی",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        title: "وبینار طراحی رابط کاربری",
        description: "اصول و تکنیک‌های طراحی UI/UX برای اپلیکیشن‌های موبایل",
        posterUrl: "/uploads/webinar2.jpg",
        instructor: "مهندس فاطمه احمدی",
        duration: "1.5 ساعت",
        eventDate: "1403/10/25",
        level: "مقدماتی",
        category: "طراحی",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // ایجاد بخش‌های وبینار
    await db.insert(webinarSections).values([
      {
        id: 1,
        webinarId: 1,
        title: "بخش اول: مقدمه React",
        description: "آشنایی با مفاهیم پایه React",
        content: "در این بخش با component ها، state و props آشنا می‌شویم",
        order: 1,
        videoUrl: "/uploads/videos/react-intro.mp4",
        isLocked: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        webinarId: 1,
        title: "بخش دوم: Next.js Framework",
        description: "کار با Next.js برای پروژه‌های پیشرفته",
        content: "معرفی ویژگی‌های Next.js و نحوه پیاده‌سازی",
        order: 2,
        videoUrl: "/uploads/videos/nextjs-advanced.mp4",
        isLocked: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        webinarId: 2,
        title: "بخش اول: اصول طراحی UI",
        description: "مبانی طراحی رابط کاربری",
        content: "اصول رنگ، تایپوگرافی و layout در طراحی UI",
        order: 1,
        presentationUrl: "/uploads/presentations/ui-basics.pdf",
        isLocked: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        webinarId: 2,
        title: "بخش دوم: تجربه کاربری",
        description: "بهبود UX در اپلیکیشن‌ها",
        content: "روش‌های بهینه‌سازی تجربه کاربری",
        order: 2,
        presentationUrl: "/uploads/presentations/ux-optimization.pdf",
        isLocked: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    console.log("✅ مقداردهی اولیه دیتابیس با موفقیت انجام شد!");
    console.log("📋 اطلاعات ورود ادمین:");
    console.log("نام کاربری: admin");
    console.log("رمز عبور: admin123");

  } catch (error) {
    console.error("❌ خطا در مقداردهی اولیه دیتابیس:", error);
  }
}

// اجرای مقداردهی اولیه
seedDatabase();