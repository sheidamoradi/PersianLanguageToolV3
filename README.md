# Pistac - پلتفرم آموزشی پیستاک

پلتفرم آموزشی پیستاک برای آموزش کشاورزی با پشتیبانی کامل از زبان فارسی (RTL).

## ویژگی‌ها

- 📚 دوره‌های آموزشی
- 📄 کتابخانه اسناد  
- 📰 مجله‌های تخصصی
- 🎥 ویدیوهای آموزشی
- 🛠️ کارگاه‌های عملی
- 👤 مدیریت کاربران و پروفایل
- 📱 طراحی واکنش‌گرا برای موبایل
- 🔐 سیستم احراز هویت کامل

## تکنولوژی‌ها

### Frontend
- React + TypeScript
- Tailwind CSS
- Radix UI Components  
- TanStack Query
- Wouter Router
- Lucide Icons

### Backend  
- Node.js + Express
- TypeScript
- Drizzle ORM
- PostgreSQL
- Passport.js Authentication

## نصب و راه‌اندازی

### پیش‌نیازها
- Node.js 18+
- PostgreSQL
- npm یا yarn

### مراحل نصب

1. کلون کردن پروژه:
\`\`\`bash
git clone <repository-url>
cd pistac
\`\`\`

2. نصب dependencies:
\`\`\`bash
npm install
\`\`\`

3. تنظیم متغیرهای محیطی:
\`\`\`bash
# ایجاد فایل .env
DATABASE_URL=postgresql://username:password@localhost:5432/pistac
\`\`\`

4. اجرای migrations:
\`\`\`bash
npm run db:push
\`\`\`

5. اجرای پروژه:
\`\`\`bash
# Development
npm run dev

# Production
npm run build
npm start
\`\`\`

## Deploy در Render

### مراحل deploy:

1. پوش کردن کد به GitHub
2. ایجاد PostgreSQL database در Render
3. ایجاد Web Service در Render با تنظیمات زیر:
   - **Build Command**: \`npm ci && npm run build && npm run db:push\`
   - **Start Command**: \`npm start\`
   - **Environment Variables**:
     - \`NODE_ENV=production\`
     - \`DATABASE_URL=<render-postgres-url>\`

### متغیرهای محیطی مورد نیاز

- \`DATABASE_URL\`: رشته اتصال به PostgreSQL
- \`NODE_ENV\`: محیط اجرا (development/production)
- \`PORT\`: پورت سرور (خودکار در Render)

## ساختار پروژه

\`\`\`
├── client/           # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── hooks/
├── server/           # Express backend  
│   ├── routes.ts
│   ├── db.ts
│   └── storage.ts
├── shared/           # Shared types & schemas
│   └── schema.ts
├── public/           # Static assets
└── dist/             # Production build
\`\`\`

## API Endpoints

### Auth
- \`POST /api/auth/login\` - ورود کاربر
- \`POST /api/auth/register\` - ثبت‌نام کاربر  
- \`GET /api/auth/user\` - اطلاعات کاربر جاری
- \`POST /api/auth/logout\` - خروج کاربر

### Content
- \`GET /api/courses\` - لیست دوره‌ها
- \`GET /api/projects\` - لیست پروژه‌ها
- \`GET /api/documents\` - لیست اسناد
- \`GET /api/magazines\` - لیست مجله‌ها
- \`GET /api/workshops\` - لیست کارگاه‌ها
- \`GET /api/webinars\` - لیست وبینارها

### Admin
- \`POST /api/admin/*\` - مدیریت محتوا (فقط ادمین)

## Admin Panel

کاربر پیش‌فرض ادمین:
- Username: \`admin\`
- Password: \`730895015\`

## لایسنس

MIT License