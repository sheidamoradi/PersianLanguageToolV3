import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function WebinarsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: webinars, isLoading } = useQuery<any[]>({
    queryKey: ['/api/webinars'],
  });

  const handleWebinarClick = (webinarId: number) => {
    window.postMessage({ 
      type: 'OPEN_WEBINAR', 
      webinarId: webinarId 
    }, '*');
  };

  const filteredWebinars = webinars?.filter(webinar => 
    webinar.isActive && 
    webinar.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">در حال بارگذاری...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button 
          onClick={() => window.postMessage({ type: 'SHOW_HOME' }, '*')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowRight className="h-5 w-5" />
          بازگشت
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">وبینارهای آموزشی</h1>
        
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="جستجو در وبینارها..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredWebinars.map((webinar) => (
          <div 
            key={webinar.id} 
            className="bg-white rounded-xl p-4 shadow-sm border cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleWebinarClick(webinar.id)}
          >
            <div className="w-full h-48 rounded-lg mb-3 flex items-center justify-center overflow-hidden bg-gray-100">
              {webinar.posterUrl ? (
                <img 
                  src={webinar.posterUrl} 
                  alt={webinar.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            <h3 className="font-medium text-gray-800 mb-2">{webinar.title}</h3>
            <p className="text-sm text-gray-500 mb-3">{webinar.description}</p>
            <div className="flex items-center justify-between">
              {webinar.instructor && (
                <span className="text-sm text-purple-600">👨‍🏫 {webinar.instructor}</span>
              )}
              {webinar.duration && (
                <span className="text-sm text-orange-600">⏱️ {webinar.duration}</span>
              )}
            </div>
            {webinar.eventDate && (
              <div className="mt-2">
                <span className="text-sm text-blue-600">📅 {webinar.eventDate}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredWebinars.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          هیچ وبیناری پیدا نشد.
        </div>
      )}
    </div>
  );
}