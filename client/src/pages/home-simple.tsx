import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import CourseCard from "@/components/course/CourseCard";
import ProjectCard from "@/components/project/ProjectCard";
import { type Course, type Project, type Slide } from "@shared/schema";
import { Book, BookOpen, Bookmark, ChevronLeft, ChevronRight, GraduationCap, Layers, TrendingUp, Users } from "lucide-react";

export default function Home() {
  const { 
    data: courses = [], 
    isLoading: isLoadingCourses 
  } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  const { 
    data: projects = [], 
    isLoading: isLoadingProjects 
  } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const { 
    data: slides = [], 
    isLoading: isLoadingSlides 
  } = useQuery<Slide[]>({
    queryKey: ['/api/slides/active'],
  });

  // Get popular and new courses
  const popularCourses = courses.filter(course => course.isPopular).slice(0, 4);
  const newCourses = courses.filter(course => course.isNew).slice(0, 4);
  const featuredProjects = projects.filter(project => project.type === "project").slice(0, 6);

  return (
    <div className="space-y-8" dir="rtl">
      {/* Hero Section */}
      <section className="mb-8">
        <div className="relative">
          {isLoadingSlides ? (
            <div className="bg-gradient-to-l from-gray-100 to-gray-50 rounded-xl overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between p-6 md:p-10">
                <div className="text-right mb-6 md:mb-0">
                  <div className="h-8 w-64 bg-gray-300 rounded animate-pulse mb-3"></div>
                  <div className="h-4 w-96 bg-gray-300 rounded animate-pulse mb-6"></div>
                  <div className="flex gap-3">
                    <div className="h-10 w-32 bg-gray-300 rounded-full animate-pulse"></div>
                    <div className="h-10 w-24 bg-gray-300 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="rounded-full h-48 w-48 bg-gray-300 animate-pulse"></div>
                </div>
              </div>
            </div>
          ) : slides.length > 0 ? (
            <div className="bg-gradient-to-l from-blue-100 to-purple-100 rounded-xl overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between p-6 md:p-10">
                <div className="text-right mb-6 md:mb-0">
                  <h1 className="text-2xl md:text-3xl font-bold text-neutral-700 mb-3">
                    {slides[0]?.title || "به پیستاط خوش آمدید"}
                  </h1>
                  <p className="text-neutral-500 mb-6 max-w-md">
                    {slides[0]?.description || "پلتفرم جامع آموزش کشاورزی با رابط کاربری فارسی"}
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    <Link 
                      href={slides[0]?.buttonUrl || "/courses"}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full flex items-center gap-2 transition-colors"
                    >
                      <GraduationCap className="h-4 w-4" />
                      {slides[0]?.buttonText || "شروع یادگیری"}
                    </Link>
                    <Link 
                      href="/about"
                      className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-full transition-colors"
                    >
                      درباره ما
                    </Link>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  {slides[0]?.imageUrl ? (
                    <img 
                      src={slides[0].imageUrl} 
                      alt={slides[0].title}
                      className="rounded-full h-48 w-48 object-cover"
                    />
                  ) : (
                    <div className="rounded-full h-48 w-48 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                      <GraduationCap className="h-24 w-24 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-l from-blue-100 to-purple-100 rounded-xl overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between p-6 md:p-10">
                <div className="text-right mb-6 md:mb-0">
                  <h1 className="text-2xl md:text-3xl font-bold text-neutral-700 mb-3">به پیستاط خوش آمدید</h1>
                  <p className="text-neutral-500 mb-6 max-w-md">پلتفرم جامع آموزش کشاورزی با رابط کاربری فارسی</p>
                  <div className="flex gap-3 flex-wrap">
                    <Link 
                      href="/courses"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full flex items-center gap-2 transition-colors"
                    >
                      <GraduationCap className="h-4 w-4" />
                      شروع یادگیری
                    </Link>
                    <Link 
                      href="/about"
                      className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-full transition-colors"
                    >
                      درباره ما
                    </Link>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="rounded-full h-48 w-48 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                    <GraduationCap className="h-24 w-24 text-white" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-6 text-center shadow-sm">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{courses.length}</div>
          <div className="text-sm text-gray-600">دوره آموزشی</div>
        </div>
        
        <div className="bg-white rounded-lg p-6 text-center shadow-sm">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Layers className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{projects.length}</div>
          <div className="text-sm text-gray-600">پروژه عملی</div>
        </div>
        
        <div className="bg-white rounded-lg p-6 text-center shadow-sm">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">۱۲۰۰+</div>
          <div className="text-sm text-gray-600">دانشجو فعال</div>
        </div>
        
        <div className="bg-white rounded-lg p-6 text-center shadow-sm">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="h-6 w-6 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">۹۵%</div>
          <div className="text-sm text-gray-600">نرخ رضایت</div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-orange-500" />
            دوره‌های محبوب
          </h2>
          <Link href="/courses" className="text-blue-600 hover:text-blue-700 font-medium">
            مشاهده همه
            <ChevronLeft className="inline h-4 w-4 mr-1" />
          </Link>
        </div>
        
        {isLoadingCourses ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="h-48 bg-gray-300 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded animate-pulse mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : popularCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ دوره محبوبی یافت نشد</h3>
            <p className="text-gray-600">دوره‌های جدید به زودی اضافه خواهند شد</p>
          </div>
        )}
      </section>

      {/* New Courses */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bookmark className="h-6 w-6 text-green-500" />
            دوره‌های جدید
          </h2>
          <Link href="/courses" className="text-blue-600 hover:text-blue-700 font-medium">
            مشاهده همه
            <ChevronLeft className="inline h-4 w-4 mr-1" />
          </Link>
        </div>
        
        {isLoadingCourses ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="h-48 bg-gray-300 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded animate-pulse mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : newCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ دوره جدیدی یافت نشد</h3>
            <p className="text-gray-600">دوره‌های جدید به زودی اضافه خواهند شد</p>
          </div>
        )}
      </section>

      {/* Projects Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Layers className="h-6 w-6 text-purple-500" />
            پروژه‌های عملی
          </h2>
          <Link href="/projects" className="text-blue-600 hover:text-blue-700 font-medium">
            مشاهده همه
            <ChevronLeft className="inline h-4 w-4 mr-1" />
          </Link>
        </div>
        
        {isLoadingProjects ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="h-48 bg-gray-300 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded animate-pulse mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Layers className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ پروژه‌ای یافت نشد</h3>
            <p className="text-gray-600">پروژه‌های جدید به زودی اضافه خواهند شد</p>
          </div>
        )}
      </section>
    </div>
  );
}