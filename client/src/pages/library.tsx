
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { type Article } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, Calendar, User } from "lucide-react";
import { Link } from "wouter";

export default function Library() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: articles = [], isLoading } = useQuery<Article[]>({ 
    queryKey: ['/api/articles'] 
  });
  
  // Filter articles based on search
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        article.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-neutral-500 mb-2 flex items-center">
          <Book className="ml-2 h-6 w-6 text-primary" />
          کتابخانه مطالب
        </h2>
        <p className="text-neutral-300">مطالعه مقالات، نوشته‌ها و محتوای علمی</p>
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
            placeholder="جستجوی مقالات و مطالب..."
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
        ) : filteredArticles.length > 0 ? (
          filteredArticles.map(article => (
            <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg text-neutral-700 line-clamp-2">
                  {article.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-sm text-neutral-400">
                  <Calendar className="h-4 w-4" />
                  {new Date(article.publishDate || '').toLocaleDateString('fa-IR')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 text-sm line-clamp-3 mb-4">
                  {article.content.substring(0, 150)}...
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <User className="h-4 w-4" />
                    <span>{article.author || 'نویسنده ناشناس'}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    مقاله
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Book className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-400 text-lg mb-2">هیچ مطلبی یافت نشد</p>
            <p className="text-neutral-300 text-sm">
              {searchTerm ? "معیارهای جستجوی خود را تغییر دهید" : "هنوز مطلبی اضافه نشده است"}
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
