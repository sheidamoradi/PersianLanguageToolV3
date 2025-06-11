import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  featuredImageUrl?: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize?: number;
  categoryId?: number;
  status: string;
  downloadCount: number;
  viewCount: number;
  isFeatured: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface DocumentCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

interface DocumentTag {
  id: number;
  name: string;
  slug: string;
  color?: string;
}

export default function Library() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("all");

  // دریافت اسناد
  const { data: documents = [], isLoading: documentsLoading } = useQuery({
    queryKey: ["/api/documents"],
  });

  // دریافت دسته‌بندی‌ها
  const { data: categories = [] } = useQuery({
    queryKey: ["/api/document-categories"],
  });

  // دریافت تگ‌ها
  const { data: tags = [] } = useQuery({
    queryKey: ["/api/document-tags"],
  });

  const filteredDocuments = documents.filter((doc: Document) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.author?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.categoryId === parseInt(selectedCategory);
    const matchesStatus = doc.status === 'published';
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getDocumentsByTab = () => {
    switch (activeTab) {
      case "featured":
        return filteredDocuments.filter((doc: Document) => doc.isFeatured);
      case "recent":
        return [...filteredDocuments].sort((a, b) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        ).slice(0, 12);
      case "popular":
        return [...filteredDocuments].sort((a, b) => 
          (b.viewCount + b.downloadCount) - (a.viewCount + a.downloadCount)
        ).slice(0, 12);
      default:
        return filteredDocuments;
    }
  };

  const handleDownload = async (document: Document) => {
    try {
      // افزایش شمارنده دانلود
      await fetch(`/api/documents/${document.id}/download`, { method: 'POST' });
      
      // دانلود فایل
      if (document.fileUrl) {
        const link = window.document.createElement('a');
        link.href = document.fileUrl;
        link.download = document.fileName;
        link.click();
      }
    } catch (error) {
      console.error('خطا در دانلود:', error);
    }
  };

  const handleView = async (document: Document) => {
    // باز کردن صفحه مشاهده سند
    window.open(`/document-viewer/${document.id}`, '_blank');
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
  };

  const getFileTypeIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="h-4 w-4" />;
    if (fileType.includes('image')) return <FileType className="h-4 w-4" />;
    return <FileType className="h-4 w-4" />;
  };

  if (documentsLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">در حال بارگذاری کتابخانه...</p>
        </div>
      </div>
    );
  }

  const displayDocuments = getDocumentsByTab();

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-right mb-2">کتابخانه دیجیتال پیستاط</h1>
        <p className="text-muted-foreground text-right">
          مجموعه‌ای جامع از منابع آموزشی، مقالات علمی و اسناد تخصصی کشاورزی
        </p>
        <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
          <div className="flex gap-4">
            <span>تعداد اسناد: {documents.length}</span>
            <span>دسته‌بندی‌ها: {categories.length}</span>
            <span>برچسب‌ها: {tags.length}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="جستجو در عنوان، محتوا، نویسنده..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 text-right"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="دسته‌بندی" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه دسته‌ها</SelectItem>
              {categories.map((category: DocumentCategory) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="برچسب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه برچسب‌ها</SelectItem>
              {tags.map((tag: DocumentTag) => (
                <SelectItem key={tag.id} value={tag.id.toString()}>
                  {tag.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            <BookOpen className="h-4 w-4 ml-1" />
            همه اسناد ({filteredDocuments.length})
          </TabsTrigger>
          <TabsTrigger value="featured">
            <Star className="h-4 w-4 ml-1" />
            ویژه ({filteredDocuments.filter(d => d.isFeatured).length})
          </TabsTrigger>
          <TabsTrigger value="recent">
            <Clock className="h-4 w-4 ml-1" />
            جدیدترین
          </TabsTrigger>
          <TabsTrigger value="popular">
            <TrendingUp className="h-4 w-4 ml-1" />
            محبوب
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayDocuments.map((document: Document) => (
              <Card key={document.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-right text-lg mb-2 line-clamp-2">
                        {document.title}
                      </CardTitle>
                      <div className="flex gap-2 mb-2">
                        {document.isFeatured && (
                          <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
                            <Star className="h-3 w-3 ml-1" />
                            ویژه
                          </Badge>
                        )}
                        <Badge variant="outline">
                          {getFileTypeIcon(document.fileType)}
                          <span className="mr-1">{document.fileType.split('/')[1]?.toUpperCase() || 'FILE'}</span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {document.excerpt && (
                    <CardDescription className="text-right line-clamp-3">
                      {document.excerpt}
                    </CardDescription>
                  )}
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {/* Metadata */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {document.viewCount}
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          {document.downloadCount}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(document.publishedAt).toLocaleDateString('fa-IR')}
                      </div>
                    </div>

                    {/* Author and File Info */}
                    <div className="space-y-2">
                      {document.author && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>{document.author}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="truncate">{document.fileName}</span>
                        {document.fileSize && <span>{formatFileSize(document.fileSize)}</span>}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleView(document)}
                      >
                        <FileText className="h-4 w-4 ml-1" />
                        مشاهده
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleDownload(document)}
                      >
                        <Download className="h-4 w-4 ml-1" />
                        دانلود
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {displayDocuments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">هیچ سندی یافت نشد</p>
              <p className="text-sm text-muted-foreground">
                {activeTab === "all" && searchQuery && "نتیجه‌ای برای جستجوی شما یافت نشد"}
                {activeTab === "all" && !searchQuery && selectedCategory !== "all" && "در این دسته‌بندی سندی موجود نیست"}
                {activeTab === "all" && !searchQuery && selectedCategory === "all" && "هنوز سندی در کتابخانه ثبت نشده است"}
                {activeTab === "featured" && "هنوز سندی به عنوان ویژه انتخاب نشده است"}
                {activeTab === "recent" && "اسناد جدیدی موجود نیست"}
                {activeTab === "popular" && "هنوز سندی بازدید نشده است"}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}