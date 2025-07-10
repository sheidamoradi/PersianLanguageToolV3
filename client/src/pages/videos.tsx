import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function VideosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: videos, isLoading } = useQuery<any[]>({
    queryKey: ['/api/educational-videos/active'],
  });

  const handleVideoClick = (videoId: number) => {
    window.postMessage({ 
      type: 'OPEN_VIDEO', 
      videoId: videoId 
    }, '*');
  };

  const filteredVideos = videos?.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-2xl font-bold text-gray-800 mb-4">ویدیوهای آموزشی</h1>
        
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="جستجو در ویدیوها..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVideos.map((video) => (
          <div 
            key={video.id} 
            className="bg-white rounded-xl p-4 shadow-sm border cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleVideoClick(video.id)}
          >
            <div className="w-full h-48 rounded-lg mb-3 flex items-center justify-center overflow-hidden bg-gray-100">
              {video.thumbnailUrl ? (
                <img 
                  src={video.thumbnailUrl} 
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <h3 className="font-medium text-gray-800 mb-2">{video.title}</h3>
            <p className="text-sm text-gray-500 mb-3">{video.description}</p>
            <div className="flex items-center justify-between">
              {video.duration && (
                <span className="text-sm text-orange-600">⏱️ {video.duration}</span>
              )}
              {video.instructor && (
                <span className="text-sm text-purple-600">👨‍🏫 {video.instructor}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          هیچ ویدیویی پیدا نشد.
        </div>
      )}
    </div>
  );
}