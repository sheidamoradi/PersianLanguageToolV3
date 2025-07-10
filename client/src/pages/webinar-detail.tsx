import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Webinar, type WebinarSection } from "@shared/schema";
import { ArrowRight, Clock, User, Calendar, Play, FileText, Video } from "lucide-react";

interface WebinarDetailProps {
  webinarId: number;
}

export default function WebinarDetail({ webinarId }: WebinarDetailProps) {
  const [activeSection, setActiveSection] = useState(1);

  const { data: webinar } = useQuery<Webinar>({
    queryKey: [`/api/webinars/${webinarId}`],
  });

  const { data: sections = [] } = useQuery<WebinarSection[]>({
    queryKey: [`/api/webinars/${webinarId}/sections`],
  });

  if (!webinar) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  const currentSection = sections.find(section => section.order === activeSection);

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <button 
            onClick={() => window.postMessage({ type: 'SHOW_HOME' }, '*')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowRight className="h-4 w-4 ml-2" />
            بازگشت
          </button>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Webinar Poster */}
            <div className="w-full md:w-1/3">
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                {webinar.posterUrl ? (
                  <img 
                    src={webinar.posterUrl} 
                    alt={webinar.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Webinar Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{webinar.title}</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {webinar.instructor && (
                  <div className="flex items-center text-gray-600">
                    <User className="h-5 w-5 ml-2 text-purple-600" />
                    <span>{webinar.instructor}</span>
                  </div>
                )}
                
                {webinar.duration && (
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 ml-2 text-orange-600" />
                    <span>{webinar.duration}</span>
                  </div>
                )}
                
                {webinar.eventDate && (
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 ml-2 text-blue-600" />
                    <span>{webinar.eventDate}</span>
                  </div>
                )}
              </div>

              <p className="text-gray-700 leading-relaxed">
                {webinar.description}
              </p>

              {webinar.level && (
                <div className="mt-4">
                  <span className="inline-flex px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                    سطح: {webinar.level}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Section Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-4 sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4">بخش‌های وبینار</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.order)}
                    className={`w-full text-right px-3 py-2 rounded-lg transition-colors ${
                      activeSection === section.order
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{section.title}</span>
                      <span className="text-xs text-gray-400">بخش {section.order}</span>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {currentSection ? (
              <div className="bg-white rounded-lg border p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {currentSection.title}
                  </h2>
                  {currentSection.description && (
                    <p className="text-gray-600">{currentSection.description}</p>
                  )}
                </div>

                {/* Video Content */}
                {currentSection.videoUrl && (
                  <div className="mb-6">
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">ویدئو در دسترس است</p>
                        <p className="text-xs text-gray-500 mt-1">{currentSection.videoUrl}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Presentation Content */}
                {currentSection.presentationUrl && (
                  <div className="mb-6">
                    <div className="bg-gray-50 rounded-lg p-4 flex items-center">
                      <FileText className="h-8 w-8 text-red-600 ml-3" />
                      <div>
                        <h4 className="font-medium text-gray-900">فایل ارائه</h4>
                        <p className="text-sm text-gray-600">PDF ارائه این بخش</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Text Content */}
                {currentSection.content && (
                  <div className="prose prose-lg max-w-none">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">محتوای آموزشی</h4>
                      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {currentSection.content}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t">
                  <button
                    onClick={() => setActiveSection(Math.max(1, activeSection - 1))}
                    disabled={activeSection === 1}
                    className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    <ArrowRight className="h-4 w-4 ml-2" />
                    بخش قبل
                  </button>
                  
                  <button
                    onClick={() => setActiveSection(Math.min(sections.length, activeSection + 1))}
                    disabled={activeSection === sections.length}
                    className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    بخش بعد
                    <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border p-6 text-center">
                <p className="text-gray-600">بخشی انتخاب نشده است.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}