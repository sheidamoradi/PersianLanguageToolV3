import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function AboutUsPage() {
  const { data: aboutData, isLoading } = useQuery({
    queryKey: ['/api/about-us'],
  });

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

  const aboutInfo = aboutData?.[0];

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.postMessage({ type: 'SHOW_HOME' }, '*')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowRight className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">درباره ما</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {aboutInfo ? (
          <div className="space-y-8">
            {/* Title Section */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                {aboutInfo.title}
              </h2>
              
              {/* Description */}
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                {aboutInfo.description?.split('\n').map((paragraph: string, index: number) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Vision & Mission */}
            {(aboutInfo.vision || aboutInfo.mission) && (
              <div className="grid md:grid-cols-2 gap-6">
                {aboutInfo.vision && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <div className="w-5 h-5 bg-blue-600 rounded-full"></div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">چشم‌انداز</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {aboutInfo.vision}
                    </p>
                  </div>
                )}

                {aboutInfo.mission && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <div className="w-5 h-5 bg-green-600 rounded-full"></div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">مأموریت</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {aboutInfo.mission}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Services */}
            {aboutInfo.services && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <div className="w-5 h-5 bg-orange-600 rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">خدمات</h3>
                </div>
                <div className="text-gray-700 leading-relaxed">
                  {aboutInfo.services.split('\n').map((service: string, index: number) => (
                    <p key={index} className="mb-2">
                      {service}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Team */}
            {aboutInfo.team && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <div className="w-5 h-5 bg-purple-600 rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">تیم ما</h3>
                </div>
                <div className="text-gray-700 leading-relaxed">
                  {aboutInfo.team.split('\n').map((member: string, index: number) => (
                    <p key={index} className="mb-2">
                      {member}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* History */}
            {aboutInfo.history && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">تاریخچه</h3>
                </div>
                <div className="text-gray-700 leading-relaxed">
                  {aboutInfo.history.split('\n').map((item: string, index: number) => (
                    <p key={index} className="mb-2">
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">اطلاعات "درباره ما" موجود نیست</h3>
            <p className="text-gray-600 mb-6">
              هنوز اطلاعاتی برای این بخش وارد نشده است.
            </p>
            <button 
              onClick={() => window.postMessage({ type: 'SHOW_HOME' }, '*')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              بازگشت به صفحه اصلی
            </button>
          </div>
        )}
      </div>
    </div>
  );
}