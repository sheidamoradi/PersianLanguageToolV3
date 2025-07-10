import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { 
  Calendar, 
  BookOpen, 
  Download, 
  ArrowRight, 
  Clock, 
  User,
  FileText,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Article {
  id: number;
  title: string;
  author: string;
  summary: string;
  publishDate: string;
  content: string;
  featuredImageUrl: string;
  readTime: number;
  magazineId: number;
  pdfUrl: string;
  order: number;
  isPublished: boolean;
}

interface Magazine {
  id: number;
  title: string;
  description: string;
  coverImageUrl: string;
  issueNumber: number;
  publishDate: string;
  season: string;
  year: number;
  totalPages: number;
  pdfUrl: string;
  isActive: boolean;
}

interface MagazineDetailPageProps {
  magazineId: number;
}

export default function MagazineDetailPage({ magazineId }: MagazineDetailPageProps) {
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null);
  
  const { data: magazine, isLoading: magazineLoading } = useQuery<Magazine>({
    queryKey: [`/api/magazines/${magazineId}`],
    enabled: !!magazineId,
  });

  const { data: articles = [], isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: [`/api/articles/magazine/${magazineId}`],
    enabled: !!magazineId,
  });

  const isLoading = magazineLoading || articlesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!magazine) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">مجله یافت نشد</h2>
          <p className="text-gray-600">مجله مورد نظر شما وجود ندارد یا حذف شده است.</p>
        </div>
      </div>
    );
  }

  const toggleArticleExpansion = (articleId: number) => {
    setExpandedArticle(expandedArticle === articleId ? null : articleId);
  };

  const publishedArticles = articles.filter(article => article.isPublished).sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => window.postMessage({ type: 'SHOW_HOME' }, '*')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowRight className="h-5 w-5" />
              بازگشت
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Magazine Cover */}
            <div className="md:w-1/3">
              <div className="bg-gray-100 rounded-lg overflow-hidden aspect-[3/4]">
                {magazine.coverImageUrl ? (
                  <img 
                    src={magazine.coverImageUrl} 
                    alt={magazine.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Magazine Info */}
            <div className="md:w-2/3">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{magazine.title}</h1>
              
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>شماره {magazine.issueNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{magazine.publishDate}</span>
                </div>
                {magazine.totalPages > 0 && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span>{magazine.totalPages} صفحه</span>
                  </div>
                )}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                {magazine.description}
              </p>

              {/* Download Button */}
              {magazine.pdfUrl && (
                <div className="flex gap-4">
                  <a
                    href={magazine.pdfUrl}
                    download
                    className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="h-5 w-5" />
                    دانلود PDF
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              فهرست مطالب
            </h2>
          </div>

          <div className="divide-y">
            {publishedArticles.length > 0 ? (
              publishedArticles.map((article) => (
                <div key={article.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {article.title}
                      </h3>
                      
                      <div className="flex flex-wrap gap-4 mb-3">
                        {article.author && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <User className="h-4 w-4" />
                            <span>{article.author}</span>
                          </div>
                        )}
                        {article.readTime > 0 && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>{article.readTime} دقیقه مطالعه</span>
                          </div>
                        )}
                      </div>

                      <p className="text-gray-700 mb-4">{article.summary}</p>

                      {/* Article Actions */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => toggleArticleExpansion(article.id)}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                        >
                          <Eye className="h-4 w-4" />
                          {expandedArticle === article.id ? 'بستن' : 'مطالعه'}
                          {expandedArticle === article.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                        
                        {article.pdfUrl && (
                          <a
                            href={article.pdfUrl}
                            download
                            className="flex items-center gap-2 text-green-600 hover:text-green-700"
                          >
                            <Download className="h-4 w-4" />
                            دانلود PDF
                          </a>
                        )}
                      </div>
                    </div>

                    {article.featuredImageUrl && (
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden ml-4">
                        <img 
                          src={article.featuredImageUrl} 
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Expanded Article Content */}
                  {expandedArticle === article.id && (
                    <div className="mt-6 pt-6 border-t">
                      <div className="prose max-w-none">
                        <div 
                          className="text-gray-700 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: article.content }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-500">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">مقاله‌ای یافت نشد</h3>
                <p className="text-gray-600">هنوز مقاله‌ای برای این شماره مجله منتشر نشده است.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}