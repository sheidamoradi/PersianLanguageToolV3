
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { type Magazine } from "@shared/schema";




import { BookOpen, Calendar, FileText } from "lucide-react";
import { Link } from "wouter";

export default function MagazinePage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: magazines = [], isLoading } = useQuery<Magazine[]>({ 
    queryKey: ['/api/magazines'] 
  });
  
  // Filter magazines based on search
  const filteredMagazines = magazines.filter(magazine => {
    const matchesSearch = magazine.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (magazine.description && magazine.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch && magazine.isActive;
  });
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-neutral-500 mb-2 flex items-center">
          <BookOpen className="ml-2 h-6 w-6 text-primary" />
          فصلنامه رویش سبز
        </h2>
        <p className="text-neutral-300">مطالعه شماره‌های فصلنامه رویش سبز</p>
      </div>
      
      <div className="mb-6">
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <Input
            type="text"
            placeholder="جستجوی شماره‌های مجله..."
            className="pl-10 pr-4 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <Skeleton className="w-3/4 h-6 mb-2" />
                <Skeleton className="w-full h-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="w-full h-20 mb-3" />
                <div className="flex justify-between items-center">
                  <Skeleton className="w-1/3 h-4" />
                  <Skeleton className="w-20 h-6 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredMagazines.length > 0 ? (
          filteredMagazines.map(magazine => (
            <Card key={magazine.id} className="hover:shadow-md transition-shadow cursor-pointer">
              {magazine.coverImageUrl && (
                <div className="aspect-[3/4] overflow-hidden">
                  <img 
                    src={magazine.coverImageUrl} 
                    alt={magazine.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg text-neutral-700 line-clamp-2">
                  {magazine.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-sm text-neutral-400">
                  <Calendar className="h-4 w-4" />
                  {magazine.publishDate ? new Date(magazine.publishDate).toLocaleDateString('fa-IR') : 'تاریخ نامشخص'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {magazine.description && (
                  <p className="text-neutral-600 text-sm line-clamp-3 mb-4">
                    {magazine.description}
                  </p>
                )}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 text-sm text-neutral-400">
                    {magazine.issueNumber && (
                      <div className="flex items-center gap-1">
                        <span>شماره {magazine.issueNumber}</span>
                      </div>
                    )}
                    {magazine.totalPages && (
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>{magazine.totalPages} صفحه</span>
                      </div>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {magazine.season && magazine.year ? `${magazine.season} ${magazine.year}` : 'فصلنامه'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <BookOpen className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-400 text-lg mb-2">هیچ شماره‌ای یافت نشد</p>
            <p className="text-neutral-300 text-sm">
              {searchTerm ? "معیارهای جستجوی خود را تغییر دهید" : "هنوز شماره‌ای منتشر نشده است"}
            </p>
            {searchTerm && (
              <button 
                className="text-primary hover:underline mt-2"
                onClick={() => setSearchTerm("")}
              >
                پاک کردن جستجو
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
