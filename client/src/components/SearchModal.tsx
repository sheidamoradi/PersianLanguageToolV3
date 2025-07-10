import { useState, useEffect } from 'react';
import { Search, X, BookOpen, Users, FileText, Video, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: number;
  title: string;
  description: string;
  type: 'course' | 'project' | 'document' | 'workshop' | 'webinar' | 'video' | 'magazine';
  url?: string;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch data for search
  const { data: workshops } = useQuery<any[]>({
    queryKey: ['/api/workshops'],
    enabled: isOpen,
  });

  const { data: webinars } = useQuery<any[]>({
    queryKey: ['/api/webinars'],
    enabled: isOpen,
  });

  const { data: videos } = useQuery<any[]>({
    queryKey: ['/api/educational-videos/active'],
    enabled: isOpen,
  });

  const { data: documents } = useQuery<any[]>({
    queryKey: ['/api/documents'],
    enabled: isOpen,
  });

  const { data: magazines } = useQuery<any[]>({
    queryKey: ['/api/magazines'],
    enabled: isOpen,
  });

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    const allResults: SearchResult[] = [];

    // Search workshops
    workshops?.forEach(workshop => {
      if (workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          workshop.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
        allResults.push({
          id: workshop.id,
          title: workshop.title,
          description: workshop.description || '',
          type: 'workshop'
        });
      }
    });

    // Search webinars
    webinars?.forEach(webinar => {
      if (webinar.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          webinar.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
        allResults.push({
          id: webinar.id,
          title: webinar.title,
          description: webinar.description || '',
          type: 'webinar'
        });
      }
    });

    // Search videos
    videos?.forEach(video => {
      if (video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          video.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
        allResults.push({
          id: video.id,
          title: video.title,
          description: video.description || '',
          type: 'video'
        });
      }
    });

    // Search documents
    documents?.forEach(doc => {
      if (doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
        allResults.push({
          id: doc.id,
          title: doc.title,
          description: doc.description || '',
          type: 'document'
        });
      }
    });

    // Search magazines
    magazines?.forEach(magazine => {
      if (magazine.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          magazine.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
        allResults.push({
          id: magazine.id,
          title: magazine.title,
          description: magazine.description || '',
          type: 'magazine'
        });
      }
    });

    setSearchResults(allResults);
    setIsSearching(false);
  }, [searchTerm, workshops, webinars, videos, documents, magazines]);

  const handleResultClick = (result: SearchResult) => {
    switch (result.type) {
      case 'workshop':
        window.postMessage({ type: 'SWITCH_TAB', tab: 'workshops' }, '*');
        break;
      case 'webinar':
        window.postMessage({ type: 'OPEN_WEBINAR', webinarId: result.id }, '*');
        break;
      case 'video':
        window.postMessage({ type: 'OPEN_VIDEO', videoId: result.id }, '*');
        break;
      case 'document':
        window.postMessage({ type: 'SWITCH_TAB', tab: 'library' }, '*');
        break;
      case 'magazine':
        window.postMessage({ type: 'OPEN_MAGAZINE', magazineId: result.id }, '*');
        break;
    }
    onClose();
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'workshop':
        return <Users className="h-5 w-5 text-blue-500" />;
      case 'webinar':
        return <Video className="h-5 w-5 text-purple-500" />;
      case 'video':
        return <Video className="h-5 w-5 text-red-500" />;
      case 'document':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'magazine':
        return <BookOpen className="h-5 w-5 text-orange-500" />;
      default:
        return <Search className="h-5 w-5 text-gray-500" />;
    }
  };

  const getResultTypeLabel = (type: string) => {
    switch (type) {
      case 'workshop':
        return 'کارگاه آموزشی';
      case 'webinar':
        return 'وبینار';
      case 'video':
        return 'ویدیو';
      case 'document':
        return 'سند';
      case 'magazine':
        return 'مجله';
      default:
        return '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black bg-opacity-50" dir="rtl">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">جستجو در محتوا</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="جستجو کنید..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-right"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">در حال جستجو...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {searchResults.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full p-4 text-right hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  {getResultIcon(result.type)}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{result.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{result.description}</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-2">
                      {getResultTypeLabel(result.type)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : searchTerm.trim() ? (
            <div className="p-8 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">نتیجه‌ای یافت نشد</p>
              <p className="text-sm text-gray-500 mt-2">کلمات کلیدی دیگری امتحان کنید</p>
            </div>
          ) : (
            <div className="p-8 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">جستجو در محتوا</p>
              <p className="text-sm text-gray-500 mt-2">کلمه کلیدی خود را وارد کنید</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}