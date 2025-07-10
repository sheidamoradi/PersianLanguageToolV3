import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function MagazinesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: magazines, isLoading } = useQuery<any[]>({
    queryKey: ['/api/magazines'],
  });

  const handleMagazineClick = (magazineId: number) => {
    window.postMessage({ 
      type: 'OPEN_MAGAZINE', 
      magazineId: magazineId 
    }, '*');
  };

  const filteredMagazines = magazines?.filter(magazine => 
    magazine.isActive && 
    magazine.title.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-2xl font-bold text-gray-800 mb-4">فصلنامه رویش سبز</h1>
        
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="جستجو در مجلات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMagazines.map((magazine) => (
          <div 
            key={magazine.id} 
            className="bg-white rounded-xl p-4 shadow-sm border cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleMagazineClick(magazine.id)}
          >
            <div className="w-full h-48 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
              {magazine.coverImageUrl ? (
                <img 
                  src={magazine.coverImageUrl} 
                  alt={magazine.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              )}
            </div>
            <h3 className="font-medium text-gray-800 mb-2">{magazine.title}</h3>
            <p className="text-sm text-gray-500 mb-3">{magazine.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-600">شماره {magazine.issueNumber}</span>
              <span className="text-sm text-gray-500">
                {new Date(magazine.publishDate).toLocaleDateString('fa-IR')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredMagazines.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          هیچ مجله‌ای پیدا نشد.
        </div>
      )}
    </div>
  );
}