import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  Download, 
  Eye, 
  FileText, 
  Calendar,
  User,
  Tag,
  Star,
  BookOpen,
  FileType,
  Clock,
  TrendingUp
} from "lucide-react";

interface Document {
  id: number;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  author?: string;
  category?: string;
  tags?: string[];
  publishedAt?: string;
  fileUrl?: string;
  downloadCount?: number;
  rating?: number;
  fileType?: string;
  fileSize?: string;
  readTime?: string;
  featured?: boolean;
}

export default function Library() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const { data: documents, isLoading } = useQuery<Document[]>({
    queryKey: ['/api/documents'],
  });

  const { data: categories } = useQuery<string[]>({
    queryKey: ['/api/documents/categories'],
  });

  const { data: tags } = useQuery<string[]>({
    queryKey: ['/api/documents/tags'],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-3 rounded mb-2"></div>
              <div className="bg-gray-200 h-3 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const filteredDocuments = documents?.filter((doc: Document) => {
    const matchesSearch = doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    const matchesTag = selectedTag === "all" || doc.tags?.includes(selectedTag);
    
    return matchesSearch && matchesCategory && matchesTag;
  }) || [];

  const featuredDocuments = filteredDocuments.filter((doc: Document) => doc.featured);
  const popularDocuments = filteredDocuments
    .sort((a: Document, b: Document) => (b.downloadCount || 0) - (a.downloadCount || 0))
    .slice(0, 6);

  const getTabDocuments = () => {
    switch (activeTab) {
      case "featured":
        return featuredDocuments;
      case "popular":
        return popularDocuments;
      case "recent":
        return filteredDocuments
          .sort((a: Document, b: Document) => 
            new Date(b.publishedAt || '').getTime() - new Date(a.publishedAt || '').getTime()
          );
      default:
        return filteredDocuments;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pb-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">کتابخانه دیجیتال</h1>
        <p className="text-gray-600">مجموعه‌ای جامع از منابع آموزشی و تخصصی</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="جستجو در کتابخانه..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-9 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">همه دسته‌ها</option>
            {categories?.map((category: string) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          
          <select 
            value={selectedTag} 
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">همه برچسب‌ها</option>
            {tags?.map((tag: string) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-600">{documents?.length || 0}</div>
          <div className="text-sm text-gray-600">کل اسناد</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <Star className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-600">{featuredDocuments.length}</div>
          <div className="text-sm text-gray-600">ویژه</div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <Tag className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-600">{categories?.length || 0}</div>
          <div className="text-sm text-gray-600">دسته‌بندی</div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg text-center">
          <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-600">
            {documents?.reduce((acc: number, doc: Document) => acc + (doc.downloadCount || 0), 0)}
          </div>
          <div className="text-sm text-gray-600">دانلود</div>
        </div>
      </div>

      {/* Simple Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b">
        {[
          { id: "all", label: "همه" },
          { id: "featured", label: "ویژه" },
          { id: "popular", label: "محبوب" },
          { id: "recent", label: "جدید" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'border-blue-500 text-blue-600 font-medium' 
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getTabDocuments().map((doc: Document) => (
          <div key={doc.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {doc.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {doc.excerpt}
                </p>
              </div>
              {doc.featured && (
                <Star className="h-5 w-5 text-yellow-500 fill-current flex-shrink-0 mr-2" />
              )}
            </div>
            
            <div className="space-y-4">
              {/* Meta Information */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{doc.author || 'نامشخص'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {doc.publishedAt 
                      ? new Date(doc.publishedAt).toLocaleDateString('fa-IR')
                      : 'نامشخص'
                    }
                  </span>
                </div>
              </div>

              {/* Tags */}
              {doc.tags && doc.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {doc.tags.slice(0, 3).map((tag: string) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                  {doc.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded-full text-xs">
                      +{doc.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* File Info */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <FileType className="h-4 w-4" />
                  <span>{doc.fileType || 'PDF'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{doc.readTime || '۵ دقیقه'}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span>{doc.downloadCount || 0} دانلود</span>
                </div>
                {doc.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{doc.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center gap-1">
                  <Eye className="h-4 w-4" />
                  مشاهده
                </button>
                <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                  <Download className="h-4 w-4" />
                  دانلود
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {getTabDocuments().length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ سندی یافت نشد</h3>
          <p className="text-gray-600">سعی کنید با کلمات کلیدی دیگری جستجو کنید</p>
        </div>
      )}
    </div>
  );
}