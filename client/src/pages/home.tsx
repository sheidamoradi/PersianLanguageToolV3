import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import CourseCard from "@/components/course/CourseCard";
import ProjectCard from "@/components/project/ProjectCard";
import { type Course, type Project } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Book, BookOpen, Bookmark, ChevronLeft, ChevronRight, GraduationCap, Layers, TrendingUp } from "lucide-react";

export default function Home() {
  const { 
    data: courses = [], 
    isLoading: isLoadingCourses 
  } = useQuery<Course[]>({ 
    queryKey: ['/api/courses'] 
  });

  const { 
    data: projects = [], 
    isLoading: isLoadingProjects 
  } = useQuery<Project[]>({ 
    queryKey: ['/api/projects'] 
  });

  // Filter courses with progress > 0 for "Continue Learning" section
  const continueLearningCourses = courses.filter(course => course.progress && course.progress > 0);

  return (
    <div id="dashboard" className="mb-10" dir="rtl">
      {/* Hero Slider */}
      <div className="mb-10 -mt-2">
        <div className="bg-gradient-to-l from-primary/20 to-secondary/20 rounded-xl overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between p-6 md:p-10">
            <div className="text-right mb-6 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-700 mb-3">به مرکز پیستاط خوش آمدید</h2>
              <p className="text-neutral-500 mb-6 max-w-md">بهترین دوره‌های آموزشی در حوزه کشاورزی</p>
              <div className="flex gap-3 flex-wrap">
                <Button className="rounded-full">
                  <BookOpen className="ml-2 h-4 w-4" />
                  مشاهده دوره‌ها
                </Button>
                <Button variant="outline" className="rounded-full">
                  درباره ما
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="bg-white rounded-full h-48 w-48 p-3 shadow-lg">
                <div className="bg-gradient-to-br from-primary/10 to-primary/30 h-full w-full rounded-full flex items-center justify-center">
                  <GraduationCap className="h-24 w-24 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-gradient-to-br from-primary/10 to-primary/30 rounded-xl p-4 flex flex-col items-center hover:shadow-md transition-all cursor-pointer">
          <div className="bg-white rounded-full h-12 w-12 flex items-center justify-center mb-3 shadow-sm">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-neutral-700">برنامه‌نویسی</h3>
          <p className="text-xs text-neutral-500">25 دوره</p>
        </div>
        <div className="bg-gradient-to-br from-secondary/10 to-secondary/30 rounded-xl p-4 flex flex-col items-center hover:shadow-md transition-all cursor-pointer">
          <div className="bg-white rounded-full h-12 w-12 flex items-center justify-center mb-3 shadow-sm">
            <Layers className="h-6 w-6 text-secondary" />
          </div>
          <h3 className="font-semibold text-neutral-700">طراحی</h3>
          <p className="text-xs text-neutral-500">18 دوره</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/30 rounded-xl p-4 flex flex-col items-center hover:shadow-md transition-all cursor-pointer">
          <div className="bg-white rounded-full h-12 w-12 flex items-center justify-center mb-3 shadow-sm">
            <Book className="h-6 w-6 text-purple-500" />
          </div>
          <h3 className="font-semibold text-neutral-700">مجلات</h3>
          <p className="text-xs text-neutral-500">12 مجله</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/30 rounded-xl p-4 flex flex-col items-center hover:shadow-md transition-all cursor-pointer">
          <div className="bg-white rounded-full h-12 w-12 flex items-center justify-center mb-3 shadow-sm">
            <TrendingUp className="h-6 w-6 text-amber-500" />
          </div>
          <h3 className="font-semibold text-neutral-700">پروژه‌ها</h3>
          <p className="text-xs text-neutral-500">8 پروژه</p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-neutral-700 mb-6 flex items-center">
        <BookOpen className="ml-2 h-6 w-6 text-primary" />
        ادامه یادگیری
      </h2>

      {/* Recent Courses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {isLoadingCourses ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <Skeleton className="w-full h-36" />
              <div className="p-4">
                <Skeleton className="w-3/4 h-6 mb-2" />
                <Skeleton className="w-full h-4 mb-3" />
                <div className="flex justify-between items-center">
                  <Skeleton className="w-1/3 h-4" />
                  <Skeleton className="w-20 h-8 rounded" />
                </div>
              </div>
            </div>
          ))
        ) : continueLearningCourses.length > 0 ? (
          continueLearningCourses.map(course => (
            <CourseCard 
              key={course.id}
              id={course.id}
              title={course.title}
              description={course.description}
              thumbnailUrl={course.thumbnailUrl || ''}
              progress={course.progress || 0}
              totalModules={course.totalModules || 0}
              completedModules={course.completedModules || 0}
              category={course.category || undefined}
              level={course.level || undefined}
              isNew={course.isNew || undefined}
              isPopular={course.isPopular || undefined}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-neutral-400">هیچ دوره‌ای در حال پیشرفت نیست. امروز یادگیری را شروع کنید!</p>
            <Link href="/courses" className="text-primary hover:underline mt-2 inline-block">
              مشاهده کارگاه‌ها
            </Link>
          </div>
        )}
      </div>

      {/* Recent Projects */}
      <h2 className="text-2xl font-semibold text-neutral-700 mb-4 flex items-center">
        <Layers className="ml-2 h-6 w-6 text-secondary" />
        پروژه‌ها و مجلات
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoadingProjects ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <Skeleton className="w-full h-36" />
              <div className="p-4">
                <Skeleton className="w-3/4 h-6 mb-2" />
                <Skeleton className="w-full h-4 mb-3" />
                <div className="flex justify-between items-center">
                  <Skeleton className="w-1/3 h-4" />
                  <Skeleton className="w-20 h-8 rounded" />
                </div>
              </div>
            </div>
          ))
        ) : projects.length > 0 ? (
          projects.map(project => (
            <ProjectCard
              key={project.id}
              id={project.id}
              title={project.title}
              description={project.description}
              thumbnailUrl={project.thumbnailUrl || ''}
              type={project.type as "project" | "magazine"}
              dueDate={project.dueDate || undefined}
              pages={project.pages || undefined}
              isLocked={project.isLocked}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-neutral-400">هیچ پروژه یا مجله‌ای در دسترس نیست.</p>
          </div>
        )}
      </div>
    </div>
  );
}