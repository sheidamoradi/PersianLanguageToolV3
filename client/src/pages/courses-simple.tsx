import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { type Course } from "@shared/schema";
import CourseCard from "@/components/course/CourseCard";
import { Search, Filter } from "lucide-react";
import { AuthGuard } from "@/components/AuthGuard";

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  // Filter courses based on search term and category
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories from courses
  const categories = Array.from(new Set(courses.map(course => course.category).filter(Boolean)));

  return (
    <AuthGuard>
      <div className="space-y-6" dir="rtl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">دوره‌های آموزشی</h1>
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="جستجو در دوره‌ها..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-4 items-center">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-40 px-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">همه دسته‌ها</option>
              {categories.map(category => (
                <option key={category} value={category || ''}>{category}</option>
              ))}
            </select>
            <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg flex items-center gap-2 transition-colors">
              <Filter className="h-4 w-4" />
              <span>فیلتر</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Course Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-blue-600 mb-1">{courses.length}</div>
          <div className="text-sm text-gray-600">کل دوره‌ها</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-green-600 mb-1">{courses.filter(c => c.accessLevel === 'free').length}</div>
          <div className="text-sm text-gray-600">دوره‌های رایگان</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-orange-600 mb-1">{courses.filter(c => c.accessLevel === 'premium').length}</div>
          <div className="text-sm text-gray-600">دوره‌های پریمیوم</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-purple-600 mb-1">{courses.filter(c => c.accessLevel === 'vip').length}</div>
          <div className="text-sm text-gray-600">دوره‌های ویژه</div>
        </div>
      </div>
      
      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
              <div className="w-full h-48 bg-gray-300"></div>
              <div className="p-4">
                <div className="w-3/4 h-6 bg-gray-300 rounded mb-2"></div>
                <div className="w-full h-4 bg-gray-300 rounded mb-3"></div>
                <div className="flex justify-between items-center">
                  <div className="w-1/3 h-4 bg-gray-300 rounded"></div>
                  <div className="w-20 h-8 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          ))
        ) : filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                {course.thumbnailUrl ? (
                  <img 
                    src={course.thumbnailUrl} 
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-lg font-medium">{course.title.charAt(0)}</span>
                  </div>
                )}
                
                {/* Access Level Badge */}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs rounded-full text-white ${
                    course.accessLevel === 'free' ? 'bg-green-500' :
                    course.accessLevel === 'premium' ? 'bg-orange-500' : 'bg-purple-500'
                  }`}>
                    {course.accessLevel === 'free' ? 'رایگان' :
                     course.accessLevel === 'premium' ? 'پریمیوم' : 'ویژه'}
                  </span>
                </div>
                
                {course.isLocked && (
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-red-500 text-white">
                      قفل شده
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-500">
                        {course.totalModules || 0} جلسه
                      </span>
                    </div>
                    {course.price && course.price > 0 && (
                      <span className="text-sm font-medium text-green-600">
                        {course.price.toLocaleString()} تومان
                      </span>
                    )}
                  </div>
                  
                  <button 
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      course.isLocked 
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                    disabled={course.isLocked || false}
                  >
                    {course.isLocked ? 'محدود شده' : 'مشاهده دوره'}
                  </button>
                </div>
                
                {/* Progress Bar */}
                {course.progress !== null && course.progress > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>پیشرفت</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ دوره‌ای یافت نشد</h3>
            <p className="text-gray-600">معیارهای جستجو را تغییر دهید یا دوباره تلاش کنید.</p>
          </div>
        )}
      </div>
      </div>
    </AuthGuard>
  );
}