import { useState } from "react";
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
  TrendingUp,
  ArrowRight
} from "lucide-react";
import { type Document } from "@shared/schema";
import { AuthGuard } from "@/components/AuthGuard";

export default function Library() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  interface Document {
    id: number;
    title: string;
    author?: string;
    fileType?: string;
    fileName?: string;
    publishedAt?: Date;
    content?: string;
    excerpt?: string;
    featuredImageUrl?: string;
    fileUrl?: string;
    fileSize?: number;
    totalPages?: number;
    categoryId?: number;
    status?: string;
    allowDownload?: boolean;
    downloadCount?: number;
    viewCount?: number;
    isFeatured?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    slug?: string;
    lastUpdated?: string;
  }

  const { data: documents = [], isLoading } = useQuery<Document[]>({
    queryKey: ['/api/documents'],
  });

  const filteredDocuments = documents.filter((doc: Document) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <AuthGuard>
      <div className="p-4 pb-24" dir="rtl">
      {/* Header */}
      <div className="mb-6">
        <button 
          onClick={() => window.postMessage({ type: 'SHOW_HOME' }, '*')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowRight className="h-5 w-5" />
          بازگشت
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">کتابخانه دیجیتال</h1>
        <p className="text-gray-600">مجموعه کامل منابع و مستندات</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="جستجو در اسناد..."
            className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">همه دسته‌ها</option>
            <option value="book">کتاب</option>
            <option value="article">مقاله</option>
            <option value="report">گزارش</option>
            <option value="manual">راهنما</option>
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">جدیدترین</option>
            <option value="oldest">قدیمی‌ترین</option>
            <option value="popular">محبوب‌ترین</option>
            <option value="title">عنوان</option>
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border text-center">
          <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{documents.length}</div>
          <div className="text-sm text-gray-600">کل اسناد</div>
        </div>
        <div className="bg-white p-4 rounded-lg border text-center">
          <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">25</div>
          <div className="text-sm text-gray-600">مقالات</div>
        </div>
        <div className="bg-white p-4 rounded-lg border text-center">
          <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">12</div>
          <div className="text-sm text-gray-600">محبوب</div>
        </div>
        <div className="bg-white p-4 rounded-lg border text-center">
          <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">8</div>
          <div className="text-sm text-gray-600">جدید</div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-lg border p-6 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="w-3/4 h-5 bg-gray-200 rounded mb-2"></div>
                  <div className="w-1/2 h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="flex gap-2">
                    <div className="w-16 h-8 bg-gray-200 rounded"></div>
                    <div className="w-16 h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : filteredDocuments.length > 0 ? (
          filteredDocuments.map((doc: Document) => (
            <div key={doc.id} className="bg-white rounded-lg border p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{doc.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{doc.fileName}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{doc.lastUpdated}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileType className="w-3 h-3" />
                      <span>PDF</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition-colors">
                      <Eye className="w-4 h-4" />
                      <span>مشاهده</span>
                    </button>
                    {doc.allowDownload && (
                      <button className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-sm hover:bg-green-100 transition-colors">
                        <Download className="w-4 h-4" />
                        <span>دانلود</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ سندی یافت نشد</h3>
            <p className="text-gray-600">لطفاً جستجوی خود را تغییر دهید یا دسته‌بندی دیگری انتخاب کنید.</p>
          </div>
        )}
      </div>
      </div>
    </AuthGuard>
  );
}