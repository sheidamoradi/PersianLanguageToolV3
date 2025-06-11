// @ts-nocheck
import { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const NavButton = ({ id, icon, label, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex flex-col items-center py-2 px-4 transition-colors ${
        isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      <span className="text-xl mb-1">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );

  const CourseCard = ({ title, description, progress, isLocked }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        {isLocked && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white text-2xl">🔒</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-3">{description}</p>
        {!isLocked && (
          <div className="bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {isLocked ? 'محدود شده' : `${progress}% تکمیل`}
          </span>
          <button 
            className={`px-3 py-1 rounded text-xs font-medium ${
              isLocked 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            disabled={isLocked}
          >
            {isLocked ? 'قفل' : 'ادامه'}
          </button>
        </div>
      </div>
    </div>
  );

  const ProjectCard = ({ title, description, type, difficulty }) => (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 mb-1">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
        <span className="text-2xl mr-3">🚀</span>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
            {type}
          </span>
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
            {difficulty}
          </span>
        </div>
        <button className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600">
          مشاهده
        </button>
      </div>
    </div>
  );

  const DocumentCard = ({ title, description, fileType, pages }) => (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 mb-1">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
        <span className="text-2xl mr-3">📄</span>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
            {fileType}
          </span>
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
            {pages} صفحه
          </span>
        </div>
        <button className="bg-purple-500 text-white px-3 py-1 rounded text-xs hover:bg-purple-600">
          دانلود
        </button>
      </div>
    </div>
  );

  const HomePage = () => (
    <div className="space-y-6">
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🌱 پیستاط</h1>
        <p className="text-gray-600">مرکز آموزشی تخصصی کشاورزی</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-100 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-blue-600">12</div>
          <div className="text-sm text-blue-800">دوره فعال</div>
        </div>
        <div className="bg-green-100 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-green-600">8</div>
          <div className="text-sm text-green-800">پروژه</div>
        </div>
        <div className="bg-purple-100 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-purple-600">45</div>
          <div className="text-sm text-purple-800">مقاله</div>
        </div>
        <div className="bg-orange-100 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-orange-600">95%</div>
          <div className="text-sm text-orange-800">پیشرفت</div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-xl font-bold mb-2">دوره پیشنهادی</h2>
        <p className="mb-4 opacity-90">کشاورزی مدرن و فناوری‌های نوین</p>
        <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100">
          شروع یادگیری
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">فعالیت‌های اخیر</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm">📚</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">تکمیل فصل 3 دوره آبیاری</p>
              <p className="text-xs text-gray-500">2 ساعت پیش</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm">🚀</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">ارسال پروژه گلخانه هوشمند</p>
              <p className="text-xs text-gray-500">1 روز پیش</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const CoursesPage = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">دوره‌های آموزشی</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600">
          جستجو
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CourseCard
          title="مبانی کشاورزی"
          description="آموزش اصول پایه کشاورزی و زراعت"
          progress={80}
          isLocked={false}
        />
        <CourseCard
          title="آبیاری مدرن"
          description="سیستم‌های آبیاری قطره‌ای و هوشمند"
          progress={60}
          isLocked={false}
        />
        <CourseCard
          title="گلخانه‌داری"
          description="مدیریت و تولید در گلخانه"
          progress={0}
          isLocked={true}
        />
        <CourseCard
          title="کشاورزی ارگانیک"
          description="روش‌های کشاورزی بدون آفت‌کش"
          progress={0}
          isLocked={true}
        />
      </div>
    </div>
  );

  const ProjectsPage = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">پروژه‌ها</h1>
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600">
          جدید
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <ProjectCard
          title="گلخانه هوشمند"
          description="طراحی و پیاده‌سازی سیستم کنترل خودکار گلخانه"
          type="فناوری"
          difficulty="پیشرفته"
        />
        <ProjectCard
          title="سیستم آبیاری قطره‌ای"
          description="نصب و راه‌اندازی آبیاری برای باغ میوه"
          type="عملی"
          difficulty="متوسط"
        />
        <ProjectCard
          title="کشت هیدروپونیک"
          description="تولید سبزیجات بدون خاک در محیط کنترل شده"
          type="تحقیقی"
          difficulty="ساده"
        />
      </div>
    </div>
  );

  const LibraryPage = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">کتابخانه</h1>
        <button className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-600">
          آپلود
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <DocumentCard
          title="راهنمای کشاورزی مدرن"
          description="کتاب جامع تکنیک‌های نوین کشاورزی"
          fileType="PDF"
          pages={120}
        />
        <DocumentCard
          title="مقاله آبیاری هوشمند"
          description="بررسی روش‌های نوین آبیاری خودکار"
          fileType="PDF"
          pages={15}
        />
        <DocumentCard
          title="گزارش بازار محصولات"
          description="تحلیل قیمت و عرضه محصولات کشاورزی"
          fileType="Excel"
          pages={8}
        />
      </div>
    </div>
  );

  const ProfilePage = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center space-x-4 space-x-reverse mb-6">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">👤</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">علی محمدی</h2>
            <p className="text-gray-600">کشاورز و دانشجو</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">8</div>
            <div className="text-sm text-gray-600">دوره تکمیل شده</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">5</div>
            <div className="text-sm text-gray-600">پروژه انجام شده</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">تنظیمات</h3>
        <div className="space-y-3">
          <button className="w-full text-right py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100">
            ویرایش پروفایل
          </button>
          <button className="w-full text-right py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100">
            تغییر رمز عبور
          </button>
          <button className="w-full text-right py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100">
            اعلان‌ها
          </button>
          <button className="w-full text-right py-3 px-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
            خروج از حساب
          </button>
        </div>
      </div>
    </div>
  );

  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'home': return <HomePage />;
      case 'courses': return <CoursesPage />;
      case 'projects': return <ProjectsPage />;
      case 'library': return <LibraryPage />;
      case 'profile': return <ProfilePage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-6 pb-20">
        {renderCurrentPage()}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="flex justify-around">
          <NavButton
            id="home"
            icon="🏠"
            label="خانه"
            isActive={activeTab === 'home'}
            onClick={setActiveTab}
          />
          <NavButton
            id="courses"
            icon="📚"
            label="دوره‌ها"
            isActive={activeTab === 'courses'}
            onClick={setActiveTab}
          />
          <NavButton
            id="projects"
            icon="🚀"
            label="پروژه‌ها"
            isActive={activeTab === 'projects'}
            onClick={setActiveTab}
          />
          <NavButton
            id="library"
            icon="📖"
            label="کتابخانه"
            isActive={activeTab === 'library'}
            onClick={setActiveTab}
          />
          <NavButton
            id="profile"
            icon="👤"
            label="پروفایل"
            isActive={activeTab === 'profile'}
            onClick={setActiveTab}
          />
        </div>
      </div>
    </div>
  );
}

export default App;