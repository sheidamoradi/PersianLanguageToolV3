import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { type Course } from "@shared/schema";
import CourseCard from "@/components/course/CourseCard";
// Removed all shadcn UI imports to fix React runtime error

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const { data: courses = [], isLoading } = useQuery<Course[]>({ 
    queryKey: ['/api/courses'] 
  });
  
  // Filter courses based on search term and category
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Extract unique categories from courses
  const categories = [...new Set(courses.map(course => course.category).filter(Boolean))];
  
  return (
    <div id="course-library">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-neutral-500 mb-2">کتابخانه کارگاه‌های آموزشی</h2>
        <p className="text-neutral-300">مشاهده تمام کارگاه‌های آموزشی و محتوای موجود</p>
      </div>
      
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <Input
              type="text"
              placeholder="جستجوی کارگاه‌ها، اسناد یا موضوعات..."
              className="pl-10 pr-4 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category || ''}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center">
              <span className="material-icons mr-1 text-sm">filter_list</span>
              <span>Filter</span>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
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
        ) : filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <CourseCard 
              key={course.id}
              id={course.id}
              title={course.title}
              description={course.description}
              thumbnailUrl={course.thumbnailUrl || ''}
              progress={course.progress}
              totalModules={course.totalModules}
              completedModules={course.completedModules}
              category={course.category}
              level={course.level}
              isNew={course.isNew}
              isPopular={course.isPopular}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-neutral-400">هیچ کارگاهی با معیارهای شما یافت نشد.</p>
            <Button 
              variant="link" 
              className="text-primary mt-2"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
            >
              Reset filters
            </Button>
          </div>
        )}
      </div>
      
      {filteredCourses.length > 0 && (
        <div className="flex justify-center">
          <nav className="flex items-center">
            <Button variant="outline" className="w-10 h-10 p-0 mr-2" disabled>
              <span className="material-icons">chevron_left</span>
            </Button>
            <Button className="w-10 h-10 p-0 bg-primary hover:bg-primary/90">1</Button>
            <Button variant="ghost" className="w-10 h-10 p-0 text-neutral-400 hover:bg-neutral-100">2</Button>
            <Button variant="ghost" className="w-10 h-10 p-0 text-neutral-400 hover:bg-neutral-100">3</Button>
            <Button variant="ghost" className="w-10 h-10 p-0 text-neutral-400 hover:bg-neutral-100">4</Button>
            <Button variant="ghost" className="w-10 h-10 p-0 text-neutral-400 hover:bg-neutral-100">5</Button>
            <Button variant="outline" className="w-10 h-10 p-0 ml-2">
              <span className="material-icons">chevron_right</span>
            </Button>
          </nav>
        </div>
      )}
    </div>
  );
}
