import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

interface Course {
  id: number;
  title: string;
  description?: string;
  progress?: number;
  isLocked?: boolean;
  level?: string;
  category?: string;
}

interface Project {
  id: number;
  title: string;
  description?: string;
  type?: string;
  dueDate?: string;
}

interface Document {
  id: number;
  title: string;
  author?: string;
  fileType?: string;
  fileName?: string;
  content?: string;
  description?: string;
}

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch real data from backend APIs
  const { data: courses = [], isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const { data: documents = [], isLoading: documentsLoading } = useQuery<Document[]>({
    queryKey: ['/api/documents'],
  });

  const CourseCard = ({ course }: { course: Course }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="h-32 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 relative">
        {course.isLocked && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white text-2xl">🔒</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-800 mb-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-3">{course.description}</p>
        {!course.isLocked && (
          <div className="mb-3">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${course.progress || 0}%` }}
              ></div>
            </div>
          </div>
        )}
        <button 
          className={`w-full py-2 rounded-lg text-sm font-medium ${
            course.isLocked 
              ? 'bg-gray-200 text-gray-500' 
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
          disabled={course.isLocked}
        >
          {course.isLocked ? 'قفل شده' : 'ادامه یادگیری'}
        </button>
      </div>
    </div>
  );

  const ProjectCard = ({ project }: { project: Project }) => (
    <div className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-all">
      <h3 className="font-bold text-gray-800 mb-2">{project.title}</h3>
      <p className="text-gray-600 text-sm mb-3">{project.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {project.type || 'عمومی'}
        </span>
        <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
          مشاهده
        </button>
      </div>
    </div>
  );

  const DocumentCard = ({ document }: { document: Document }) => (
    <div className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-all">
      <h3 className="font-bold text-gray-800 mb-2">{document.title}</h3>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {document.content || document.description || 'محتوای مفیدی برای یادگیری'}
      </p>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">
          {document.author || 'نویسنده ناشناخته'}
        </span>
        <button className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600">
          دانلود
        </button>
      </div>
    </div>
  );

  if (coursesLoading || projectsLoading || documentsLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگیری پلتفرم پیستاط...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Slider */}
      <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-8 text-center relative">
        {/* Navigation arrows */}
        <button className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-green-600">
          ←
        </button>
        <button className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-green-600">
          →
        </button>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          به مرکز پیستاط خوش آمدید
        </h1>
        <p className="text-gray-600 mb-6">
          بهترین دوره‌های آموزشی در حوزه کشاورزی
        </p>
        
        <div className="flex gap-4 justify-center mb-6">
          <button className="bg-white text-gray-700 px-4 py-2 rounded-lg border hover:bg-gray-50">
            درباره ما
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2">
            <span>📚</span>
            مشاهده دوره‌ها
          </button>
        </div>

        {/* Icon */}
        <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">🎓</span>
          </div>
        </div>
      </div>

      {/* Quick Access Section - Circular Icons */}
      <div className="grid grid-cols-4 gap-4 px-4">
        {/* Magazine */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-2 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl">📖</span>
          </div>
          <p className="text-xs text-gray-700 font-medium">فصلنامه رویش سبز</p>
        </div>

        {/* Videos */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-2 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl">🎥</span>
          </div>
          <p className="text-xs text-gray-700 font-medium">ویدئو آموزشی</p>
        </div>

        {/* Library */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-2 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl">📚</span>
          </div>
          <p className="text-xs text-gray-700 font-medium">کتابچه</p>
        </div>

        {/* Contact */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-2 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl">📞</span>
          </div>
          <p className="text-xs text-gray-700 font-medium">تماس با ما</p>
        </div>
      </div>

      {/* Workshops Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">کارگاه‌های آموزشی</h2>
          <span className="text-green-500">🎯</span>
        </div>
        
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.slice(0, 4).map((course) => (
              <div key={course.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 relative">
                  {course.isLocked && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                      <span className="text-white text-2xl">🔒</span>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-white bg-opacity-20 backdrop-blur-sm rounded px-2 py-1">
                    <span className="text-white text-xs">+۴۰ ساعت</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
                  {!course.isLocked && (
                    <div className="mb-3">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${course.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  <button 
                    className={`w-full py-2 rounded-lg text-sm font-medium ${
                      course.isLocked 
                        ? 'bg-gray-200 text-gray-500' 
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                    disabled={course.isLocked}
                  >
                    {course.isLocked ? 'قفل شده' : 'ادامه یادگیری'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center border">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-400 text-2xl">📚</span>
            </div>
            <h3 className="font-medium text-gray-800 mb-2">هنوز کارگاهی ثبت نشده</h3>
            <p className="text-gray-500 text-sm">به زودی کارگاه‌های جدید اضافه می‌شوند</p>
          </div>
        )}
      </div>

      {/* Webinar Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">وبینار</h2>
          <span className="text-orange-500">🎬</span>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
            <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xl">📄</span>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">فایل‌های تخصصی</h3>
            <p className="text-xs text-gray-500 mb-2">دانلود فایل‌های آموزشی و راهنما</p>
            <button className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded">دانلود فایل‌ها</button>
          </div>
          
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
            <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xl">🔖</span>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">مطالب ذخیره شده</h3>
            <p className="text-xs text-gray-500 mb-2">مطالب نشان شده و ذخیره شده شما</p>
            <button className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded">مشاهده ذخیره‌ها</button>
          </div>
          
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
            <div className="w-12 h-12 mx-auto mb-3 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 text-xl">📖</span>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">راهنماها</h3>
            <p className="text-xs text-gray-500 mb-2">راهنماهای عملی و کاربردی</p>
            <button className="text-xs text-yellow-600 bg-yellow-50 px-3 py-1 rounded">مطالعه راهنماها</button>
          </div>
          
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
            <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-xl">📝</span>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">مقالات و نوشته‌ها</h3>
            <p className="text-xs text-gray-500 mb-2">مجموعه‌ای از مقالات آموزشی و تخصصی</p>
            <button className="text-xs text-purple-600 bg-purple-50 px-3 py-1 rounded">مشاهده کتابخانه</button>
          </div>
        </div>
        
        <button className="w-full bg-gray-50 text-gray-600 py-3 rounded-xl font-medium border border-gray-200 flex items-center justify-center">
          <span className="mr-2">◀</span>
          مشاهده همه
        </button>
      </div>

      {/* Library Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">کتابخانه</h2>
          <span className="text-purple-500">📚</span>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
            <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xl">📄</span>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">فایل‌های تخصصی</h3>
            <p className="text-xs text-gray-500 mb-2">دانلود فایل‌های آموزشی و راهنما</p>
            <button className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded">دانلود فایل‌ها</button>
          </div>
          
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
            <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xl">🔖</span>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">مطالب ذخیره شده</h3>
            <p className="text-xs text-gray-500 mb-2">مطالب نشان شده و ذخیره شده شما</p>
            <button className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded">مشاهده ذخیره‌ها</button>
          </div>
          
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
            <div className="w-12 h-12 mx-auto mb-3 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 text-xl">📖</span>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">راهنماها</h3>
            <p className="text-xs text-gray-500 mb-2">راهنماهای عملی و کاربردی</p>
            <button className="text-xs text-yellow-600 bg-yellow-50 px-3 py-1 rounded">مطالعه راهنماها</button>
          </div>
          
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
            <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-xl">📝</span>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">مقالات و نوشته‌ها</h3>
            <p className="text-xs text-gray-500 mb-2">مجموعه‌ای از مقالات آموزشی و تخصصی</p>
            <button className="text-xs text-purple-600 bg-purple-50 px-3 py-1 rounded">مشاهده کتابخانه</button>
          </div>
        </div>
        
        <button className="w-full bg-gray-50 text-gray-600 py-3 rounded-xl font-medium border border-gray-200 flex items-center justify-center">
          <span className="mr-2">◀</span>
          مشاهده همه
        </button>
      </div>

      {/* Instagram Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            اینستاگرام پیستاط
            <span className="text-pink-500 mr-2">📷</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-5 gap-4 mb-4">
          <div className="bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl aspect-square flex items-center justify-center text-white shadow-lg">
            <div className="text-center">
              <div className="text-3xl mb-2">✓</div>
              <div className="text-xs font-medium">نکات کشاورزی</div>
              <div className="text-xs opacity-80">۷ روز پیش</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl aspect-square flex items-center justify-center text-white shadow-lg">
            <div className="text-center">
              <div className="text-xs font-medium">pistac_center®</div>
              <div className="text-xs opacity-80 mt-1">دنبال کنید</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl aspect-square flex items-center justify-center text-white shadow-lg">
            <div className="text-center">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-xs font-medium">تیم متخصصان</div>
              <div className="text-xs opacity-80">۱ روز پیش</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-xl aspect-square flex items-center justify-center text-white shadow-lg">
            <div className="text-center">
              <div className="text-3xl mb-2">🎓</div>
              <div className="text-xs font-medium">کارگاه‌های جدید</div>
              <div className="text-xs opacity-80">۵ ساعت پیش</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl aspect-square flex items-center justify-center text-white shadow-lg">
            <div className="text-center">
              <div className="text-3xl mb-2">📷</div>
              <div className="text-xs font-medium">آخرین فعالیت‌ها</div>
              <div className="text-xs opacity-80">۲ ساعت پیش</div>
            </div>
          </div>
        </div>
      </div>

      {/* Magazine Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            فصلنامه رویش سبز
            <span className="text-green-500 mr-2">📰</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
            <div className="w-12 h-12 mx-auto mb-3 bg-teal-100 rounded-full flex items-center justify-center">
              <span className="text-teal-600 text-xl">📑</span>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">اشتراک فصلنامه</h3>
            <p className="text-xs text-gray-500 mb-2">عضویت سازمان نظام صنفی کشاورزی</p>
            <button className="text-xs text-teal-600 bg-teal-50 px-3 py-1 rounded">جزئیات شرایط</button>
          </div>
          
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
            <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xl">📊</span>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">آمار کشاورزها</h3>
            <p className="text-xs text-gray-500 mb-2">آمار تولید کشاورزان نطنز در سال جاری</p>
            <button className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded">مطالعه آمارها</button>
          </div>
          
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
            <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xl">📰</span>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">شماره جدید</h3>
            <p className="text-xs text-gray-500 mb-2">شماره ۴ - زمستان ۱۴۰۳</p>
            <button className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded">خواندن آنلاین</button>
          </div>
        </div>
        
        <button className="w-full bg-gray-50 text-gray-600 py-3 rounded-xl font-medium border border-gray-200 flex items-center justify-center">
          <span className="mr-2">◀</span>
          مشاهده همه
        </button>
      </div>

    </div>
  );
}