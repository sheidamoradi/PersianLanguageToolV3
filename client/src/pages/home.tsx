import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import CourseCard from "@/components/course/CourseCard";
import ProjectCard from "@/components/project/ProjectCard";
import { type Course, type Project, type Slide } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Book, BookOpen, Bookmark, ChevronLeft, ChevronRight, GraduationCap, Layers, TrendingUp, Users } from "lucide-react";

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

  const { 
    data: slides = [], 
    isLoading: isLoadingSlides 
  } = useQuery<Slide[]>({ 
    queryKey: ['/api/slides/active'] 
  });

  // Filter courses with progress > 0 for "Continue Learning" section
  const continueLearningCourses = courses.filter(course => course.progress && course.progress > 0);

  // Icon mapping for dynamic icons
  const getIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      'GraduationCap': GraduationCap,
      'BookOpen': BookOpen,
      'Layers': Layers,
      'Book': Book,
      'TrendingUp': TrendingUp,
      'Users': Users
    };
    return icons[iconName] || GraduationCap;
  };

  return (
    <div id="dashboard" className="mb-10" dir="rtl">
      {/* Hero Slider */}
      <div className="mb-10 -mt-2">
        <Carousel className="w-full" opts={{ align: "start", loop: true }}>
          <CarouselContent>
            {isLoadingSlides ? (
              // Loading skeleton for slides
              Array(3).fill(0).map((_, i) => (
                <CarouselItem key={i}>
                  <div className="bg-gradient-to-l from-neutral-100 to-neutral-200 rounded-xl overflow-hidden">
                    <div className="flex flex-col md:flex-row items-center justify-between p-6 md:p-10">
                      <div className="text-right mb-6 md:mb-0 w-full">
                        <Skeleton className="h-8 w-64 mb-3" />
                        <Skeleton className="h-4 w-96 mb-6" />
                        <div className="flex gap-3">
                          <Skeleton className="h-10 w-32 rounded-full" />
                          <Skeleton className="h-10 w-24 rounded-full" />
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <Skeleton className="rounded-full h-48 w-48" />
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))
            ) : slides.length > 0 ? (
              slides.map((slide) => {
                const IconComponent = getIcon(slide.iconName || 'GraduationCap');
                return (
                  <CarouselItem key={slide.id}>
                    <Link href={slide.buttonUrl} className="block">
                      <div 
                        className={`bg-gradient-to-l from-${slide.gradientFrom || 'primary/20'} to-${slide.gradientTo || 'secondary/20'} rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow`}
                      >
                        <div className="flex flex-col md:flex-row items-center justify-between p-6 md:p-10">
                          <div className="text-right mb-6 md:mb-0">
                            <h2 className="text-2xl md:text-3xl font-bold text-neutral-700 mb-3">{slide.title}</h2>
                            <p className="text-neutral-500 mb-6 max-w-md">{slide.description}</p>
                            <div className="flex gap-3 flex-wrap">
                              <Button className="rounded-full">
                                <IconComponent className="ml-2 h-4 w-4" />
                                {slide.buttonText}
                              </Button>
                              <Button variant="outline" className="rounded-full">
                                درباره ما
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-center">
                            {slide.imageUrl ? (
                              <img 
                                src={slide.imageUrl} 
                                alt={slide.title}
                                className="rounded-full h-48 w-48 object-cover shadow-lg"
                              />
                            ) : (
                              <div className="bg-white rounded-full h-48 w-48 p-3 shadow-lg">
                                <div className={`bg-gradient-to-br from-${slide.gradientFrom?.replace('/20', '/10') || 'primary/10'} to-${slide.gradientTo?.replace('/20', '/30') || 'primary/30'} h-full w-full rounded-full flex items-center justify-center`}>
                                  <IconComponent className="h-24 w-24 text-primary" />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                );
              })
            ) : (
              // Fallback slides if no slides in database
              <CarouselItem>
                <Link href="/courses" className="block">
                  <div className="bg-gradient-to-l from-primary/20 to-secondary/20 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
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
                </Link>
              </CarouselItem>
            )}
          </CarouselContent>
          <CarouselPrevious className="right-4" />
          <CarouselNext className="left-4" />
        </Carousel>
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
          <h3 className="font-semibold text-neutral-700">کتابخانه</h3>
          <p className="text-xs text-neutral-500">45 مطلب</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/30 rounded-xl p-4 flex flex-col items-center hover:shadow-md transition-all cursor-pointer">
          <div className="bg-white rounded-full h-12 w-12 flex items-center justify-center mb-3 shadow-sm">
            <TrendingUp className="h-6 w-6 text-amber-500" />
          </div>
          <h3 className="font-semibold text-neutral-700">پروژه‌ها</h3>
          <p className="text-xs text-neutral-500">8 پروژه</p>
        </div>
      </div>

      {/* Workshop Section */}
      <h2 className="text-2xl font-semibold text-neutral-700 mb-6 flex items-center">
        <GraduationCap className="ml-2 h-6 w-6 text-primary" />
        کارگاه‌های آموزشی
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
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
        ) : courses.length > 0 ? (
          courses.slice(0, 6).map(course => (
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
            <p className="text-neutral-400">هیچ کارگاه آموزشی‌ای در دسترس نیست.</p>
            <Link href="/courses" className="text-primary hover:underline mt-2 inline-block">
              مشاهده همه کارگاه‌ها
            </Link>
          </div>
        )}
      </div>

      {/* Webinars Section */}
      <h2 className="text-2xl font-semibold text-neutral-700 mb-6 flex items-center">
        <Layers className="ml-2 h-6 w-6 text-secondary" />
        وبینارها
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
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
          projects.slice(0, 6).map(project => (
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
            <p className="text-neutral-400">هیچ وبیناری در دسترس نیست.</p>
            <Link href="/projects" className="text-primary hover:underline mt-2 inline-block">
              مشاهده همه وبینارها
            </Link>
          </div>
        )}
      </div>

      {/* Library Section */}
      <h2 className="text-2xl font-semibold text-neutral-700 mb-6 flex items-center">
        <Book className="ml-2 h-6 w-6 text-purple-500" />
        کتابخانه
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="bg-purple-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
            <Book className="h-8 w-8 text-purple-500" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-700 mb-2">مقالات و نوشته‌ها</h3>
          <p className="text-neutral-500 mb-4">مجموعه‌ای از مقالات آموزشی و تخصصی</p>
          <Link href="/library">
            <Button variant="outline" className="w-full">
              مشاهده کتابخانه
            </Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="bg-amber-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-amber-500" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-700 mb-2">راهنماها</h3>
          <p className="text-neutral-500 mb-4">راهنماهای عملی و کاربردی</p>
          <Link href="/library">
            <Button variant="outline" className="w-full">
              مطالعه راهنماها
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="bg-green-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
            <Bookmark className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-700 mb-2">مطالب ذخیره شده</h3>
          <p className="text-neutral-500 mb-4">مطالب نشان شده و ذخیره شده شما</p>
          <Link href="/library">
            <Button variant="outline" className="w-full">
              مشاهده ذخیره‌ها
            </Button>
          </Link>
        </div>
      </div>

      {/* Instagram Section */}
      <h2 className="text-2xl font-semibold text-neutral-700 mb-6 flex items-center">
        <svg className="ml-2 h-6 w-6 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
        اینستاگرام پیستاط
      </h2>
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Sample Instagram Posts */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-square bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
              <svg className="h-12 w-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <div className="p-3">
              <p className="text-sm text-neutral-600">آخرین فعالیت‌های مرکز پیستاط</p>
              <span className="text-xs text-neutral-400">2 ساعت پیش</span>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-square bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
              <GraduationCap className="h-12 w-12 text-white" />
            </div>
            <div className="p-3">
              <p className="text-sm text-neutral-600">کارگاه‌های جدید آموزشی</p>
              <span className="text-xs text-neutral-400">5 ساعت پیش</span>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-square bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <Users className="h-12 w-12 text-white" />
            </div>
            <div className="p-3">
              <p className="text-sm text-neutral-600">تیم متخصصان ما</p>
              <span className="text-xs text-neutral-400">1 روز پیش</span>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-square bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-lg font-bold">
              @pistac_center
            </div>
            <div className="p-3">
              <p className="text-sm text-neutral-600">ما را در اینستاگرام دنبال کنید</p>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-xs text-pink-500 hover:underline">
                مشاهده پروفایل
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Magazine Section */}
      <h2 className="text-2xl font-semibold text-neutral-700 mb-6 flex items-center">
        <svg className="ml-2 h-6 w-6 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
        فصلنامه رویش سبز
      </h2>
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="bg-green-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-700 mb-2 text-center">شماره جدید</h3>
            <p className="text-neutral-500 text-center mb-4">زمستان ۱۴۰۳</p>
            <Link href="/magazine">
              <Button className="w-full bg-green-500 hover:bg-green-600">
                مطالعه آنلاین
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="bg-emerald-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-700 mb-2 text-center">آرشیو شماره‌ها</h3>
            <p className="text-neutral-500 text-center mb-4">دسترسی به تمام شماره‌ها</p>
            <Link href="/magazine">
              <Button variant="outline" className="w-full border-green-500 text-green-500 hover:bg-green-50">
                مشاهده آرشیو
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="bg-teal-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-teal-500" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-700 mb-2 text-center">اشتراک فصلنامه</h3>
            <p className="text-neutral-500 text-center mb-4">از جدیدترین شماره‌ها مطلع شوید</p>
            <Button variant="outline" className="w-full border-teal-500 text-teal-500 hover:bg-teal-50">
              عضویت در خبرنامه
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}