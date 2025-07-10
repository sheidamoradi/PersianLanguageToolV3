import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Slide } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  
  const { data: slides } = useQuery<Slide[]>({
    queryKey: ['/api/slides'],
  });

  const { data: quickAccessItems } = useQuery<any[]>({
    queryKey: ['/api/quick-access'],
  });

  const { data: workshops } = useQuery<any[]>({
    queryKey: ['/api/workshops'],
  });

  const { data: webinars } = useQuery<any[]>({
    queryKey: ['/api/webinars'],
  });

  const { data: educationalVideos } = useQuery<any[]>({
    queryKey: ['/api/educational-videos/active'],
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  
  const activeSlides = slides?.filter(slide => slide.isActive) || [];
  const currentSlideData = activeSlides[currentSlide];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const homeContent = (
    <div className="space-y-6 rtl">
      <div className="rounded-2xl text-center relative overflow-hidden min-h-[400px] flex items-center" style={{backgroundColor: currentSlideData?.imageUrl ? 'transparent' : 'hsl(118, 45%, 90%)'}}>
        {currentSlideData?.imageUrl && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{backgroundImage: `url(${currentSlideData.imageUrl})`}}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </>
        )}
        
        <div className="relative z-10 p-8 w-full">
          <h1 className={`text-2xl font-bold mb-2 ${currentSlideData?.imageUrl ? 'text-white' : 'text-gray-800'}`}>
            {currentSlideData?.title || "به مرکز پیستاط خوش آمدید"}
          </h1>
          <p className={`mb-6 ${currentSlideData?.imageUrl ? 'text-gray-100' : 'text-gray-600'}`}>
            {currentSlideData?.description || "بهترین دوره‌های آموزشی در حوزه کشاورزی"}
          </p>
          
          {/* Buttons - conditional rendering */}
          {(currentSlideData ? (currentSlideData as any).showButtons !== false : true) && (
            <div className="flex gap-4 justify-center mb-6">
              {currentSlideData?.buttonText && currentSlideData?.buttonUrl ? (
                <button className="text-white px-4 py-2 rounded-lg hover:opacity-90 flex items-center gap-2" style={{backgroundColor: 'hsl(118, 54%, 40%)'}}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {currentSlideData.buttonText}
                </button>
              ) : (
                <button className="text-white px-4 py-2 rounded-lg hover:opacity-90 flex items-center gap-2" style={{backgroundColor: 'hsl(118, 54%, 40%)'}}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  مشاهده دوره‌ها
                </button>
              )}
              
              {(currentSlideData as any)?.secondButtonText && (currentSlideData as any)?.secondButtonUrl ? (
                <button className="bg-white text-gray-700 px-4 py-2 rounded-lg border hover:bg-gray-50">
                  {(currentSlideData as any).secondButtonText}
                </button>
              ) : !currentSlideData ? (
                <button className="bg-white text-gray-700 px-4 py-2 rounded-lg border hover:bg-gray-50">
                  درباره ما
                </button>
              ) : null}
            </div>
          )}

          {/* Icon - conditional rendering */}
          {currentSlideData && (currentSlideData as any).showIcon !== false && (
            <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{backgroundColor: 'hsl(118, 54%, 40%)'}}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {activeSlides.length > 1 && (
          <>
            <button 
              onClick={prevSlide}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 transition-all z-20"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={nextSlide}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 transition-all z-20"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
              {activeSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide ? 'bg-gray-700' : 'bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4 px-4">
        {quickAccessItems?.filter((item: any) => item.isActive).slice(0, 4).map((item: any) => (
          <div key={item.id} className="text-center">
            <button 
              onClick={() => {
                // Navigate based on exact item title matching section titles
                if (item.title === 'فصلنامه رویش سبز' || item.title.includes('فصلنامه') || item.title.includes('مجله')) {
                  window.postMessage({ type: 'SWITCH_TAB', tab: 'magazines' }, '*');
                } else if (item.title === 'ویدیو آموزشی' || item.title === 'ویدیوهای آموزشی' || item.title === 'آموزشی' || item.title.includes('ویدیو') || item.title.includes('آموزشی')) {
                  window.postMessage({ type: 'SWITCH_TAB', tab: 'videos' }, '*');
                } else if (item.title === 'آرشیو پیستاط' || item.title === 'کتابخانه' || item.title.includes('آرشیف') || item.title.includes('کتابخانه')) {
                  window.postMessage({ type: 'SWITCH_TAB', tab: 'library' }, '*');
                } else if (item.title === 'کارگاه‌های آموزشی' || item.title.includes('کارگاه')) {
                  window.postMessage({ type: 'SWITCH_TAB', tab: 'workshops' }, '*');
                } else if (item.title === 'وبینارهای آموزشی' || item.title.includes('وبینار')) {
                  window.postMessage({ type: 'SWITCH_TAB', tab: 'webinars' }, '*');
                } else if (item.title === 'درباره ما' || item.title.includes('درباره')) {
                  window.postMessage({ type: 'SWITCH_TAB', tab: 'about-us' }, '*');
                } else if (item.title === 'تماس با ما' || item.title.includes('تماس')) {
                  window.postMessage({ type: 'SWITCH_TAB', tab: 'contact-us' }, '*');
                } else if (item.linkUrl) {
                  window.open(item.linkUrl, '_blank');
                }
              }}
              className="block guest-allowed"
            >
              <div className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center shadow-lg bg-gray-100 border overflow-hidden">
                {item.iconUrl ? (
                  <img 
                    src={item.iconUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
              </div>
              <p className="text-xs text-gray-700 font-medium">{item.title}</p>
            </button>
          </div>
        ))}
        
        {/* Fallback items if no quick access items exist */}
        {(!quickAccessItems || quickAccessItems?.filter((item: any) => item.isActive).length === 0) && (
          <>
            <div className="text-center">
              <button onClick={() => window.postMessage({ type: 'SWITCH_TAB', tab: 'library' }, '*')} className="block">
                <div className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center shadow-lg" style={{backgroundColor: 'hsl(270, 60%, 95%)'}}>
                  <svg className="w-8 h-8" style={{color: 'hsl(270, 70%, 60%)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <p className="text-xs text-gray-700 font-medium">کتابخانه</p>
              </button>
            </div>

            <div className="text-center">
              <button onClick={() => window.postMessage({ type: 'SWITCH_TAB', tab: 'videos' }, '*')} className="block">
                <div className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center shadow-lg" style={{backgroundColor: 'hsl(25, 100%, 92%)'}}>
                  <svg className="w-8 h-8" style={{color: 'hsl(25, 85%, 65%)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-700 font-medium">ویدیوهای آموزشی</p>
              </button>
            </div>

            <div className="text-center">
              <button onClick={() => window.postMessage({ type: 'SWITCH_TAB', tab: 'magazines' }, '*')} className="block">
                <div className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center shadow-lg" style={{backgroundColor: 'hsl(140, 50%, 92%)'}}>
                  <svg className="w-8 h-8" style={{color: 'hsl(140, 60%, 50%)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-700 font-medium">فصلنامه رویش سبز</p>
              </button>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center shadow-lg border">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <p className="text-xs text-gray-700 font-medium">تماس با ما</p>
            </div>
          </>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <svg className="ml-2 h-6 w-6" fill="none" stroke="hsl(118, 54%, 40%)" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            کارگاه‌های آموزشی
          </h2>
          <button 
            onClick={() => window.postMessage({ type: 'SWITCH_TAB', tab: 'workshops' }, '*')}
            className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
          >
            مشاهده بیشتر
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mb-4">
          {workshops && workshops
            .filter((workshop: any) => workshop.isActive)
            .slice(0, 4)
            .map((workshop: any) => (
            <div 
              key={workshop.id} 
              className="bg-white rounded-xl p-4 shadow-sm border cursor-pointer hover:shadow-lg transition-shadow card-interactive"
              onClick={() => {
                // Switch to workshops tab to show workshop details
                window.parent.postMessage({ type: 'SWITCH_TAB', tab: 'workshops' }, '*');
              }}
            >
              <div className="w-full h-32 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                {workshop.posterUrl ? (
                  <img 
                    src={workshop.posterUrl} 
                    alt={workshop.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                )}
              </div>
              <h3 className="font-medium text-gray-800 text-sm mb-1" title={workshop.title}>
                {workshop.title.length > 25 ? `${workshop.title.substring(0, 25)}...` : workshop.title}
              </h3>
              <p className="text-xs text-gray-500" title={workshop.description}>
                {workshop.description ? 
                  (workshop.description.length > 30 ? `${workshop.description.substring(0, 30)}...` : workshop.description) 
                  : 'کارگاه آموزشی'}
              </p>
              <div className="flex items-center justify-between mt-2">
                {workshop.eventDate && (
                  <p className="text-xs text-blue-600">📅 {workshop.eventDate}</p>
                )}
                {workshop.registrationOpen && (
                  <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center">
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    ثبت‌نام
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Fallback when no workshops exist */}
          {(!workshops || workshops.filter((w: any) => w.isActive).length === 0) && (
            <>
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="w-full h-32 rounded-lg mb-3 flex items-center justify-center bg-gray-100">
                  <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800 text-sm mb-1">کشاورزی هوشمند</h3>
                <p className="text-xs text-gray-500">یادگیری تکنیک‌های نوین</p>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="w-full h-32 rounded-lg mb-3 flex items-center justify-center bg-gray-100">
                  <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800 text-sm mb-1">مدیریت مزرعه</h3>
                <p className="text-xs text-gray-500">برنامه‌ریزی و نظارت</p>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="w-full h-32 rounded-lg mb-3 flex items-center justify-center bg-gray-100">
                  <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800 text-sm mb-1">کنترل آفات</h3>
                <p className="text-xs text-gray-500">روش‌های طبیعی</p>
              </div>
              

            </>
          )}
        </div>
      </div>

      {/* بخش وبینارهای آموزشی */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <svg className="ml-2 h-6 w-6" fill="none" stroke="hsl(118, 54%, 40%)" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            وبینارهای آموزشی
          </h2>
          <button 
            onClick={() => window.postMessage({ type: 'SWITCH_TAB', tab: 'webinars' }, '*')}
            className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
          >
            مشاهده بیشتر
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mb-4">
          {webinars && webinars
            .filter((webinar: any) => webinar.isActive)
            .slice(0, 4)
            .map((webinar: any) => (
            <div 
              key={webinar.id} 
              className="bg-white rounded-xl p-4 shadow-sm border cursor-pointer hover:shadow-lg transition-shadow card-interactive"
              onClick={() => {
                // Switch to a dedicated webinar view
                window.parent.postMessage({ 
                  type: 'OPEN_WEBINAR', 
                  webinarId: webinar.id 
                }, '*');
              }}
            >
              <div className="w-full h-32 rounded-lg mb-3 flex items-center justify-center overflow-hidden bg-gray-100">
                {webinar.posterUrl ? (
                  <img 
                    src={webinar.posterUrl} 
                    alt={webinar.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <h3 className="font-medium text-gray-800 text-sm mb-1" title={webinar.title}>
                {webinar.title.length > 25 ? `${webinar.title.substring(0, 25)}...` : webinar.title}
              </h3>
              <p className="text-xs text-gray-500" title={webinar.description}>
                {webinar.description ? 
                  (webinar.description.length > 30 ? `${webinar.description.substring(0, 30)}...` : webinar.description) 
                  : 'وبینار آموزشی'}
              </p>
              <div className="flex items-center justify-between mt-2">
                {webinar.instructor && (
                  <p className="text-xs text-purple-600">👨‍🏫 {webinar.instructor}</p>
                )}
                {webinar.duration && (
                  <p className="text-xs text-orange-600">⏱️ {webinar.duration}</p>
                )}
              </div>
              {webinar.eventDate && (
                <p className="text-xs text-blue-600 mt-1">📅 {webinar.eventDate}</p>
              )}
            </div>
          ))}
          
          {/* Fallback when no webinars exist */}
          {(!webinars || webinars.filter((w: any) => w.isActive).length === 0) && (
            <>
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="w-full h-32 rounded-lg mb-3 flex items-center justify-center bg-gray-100">
                  <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800 text-sm mb-1">وبینار کشاورزی هوشمند</h3>
                <p className="text-xs text-gray-500">آخرین تکنولوژی‌های کشاورزی</p>
                <p className="text-xs text-purple-600 mt-1">👨‍🏫 محمد رضایی</p>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="w-full h-32 rounded-lg mb-3 flex items-center justify-center bg-gray-100">
                  <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800 text-sm mb-1">وبینار مدیریت مزرعه</h3>
                <p className="text-xs text-gray-500">تکنیک‌های مدیریت مزرعه</p>
                <p className="text-xs text-purple-600 mt-1">👩‍🏫 فاطمه احمدی</p>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="w-full h-32 rounded-lg mb-3 flex items-center justify-center bg-gray-100">
                  <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800 text-sm mb-1">وبینار کنترل آفات</h3>
                <p className="text-xs text-gray-500">روش‌های طبیعی کنترل آفات</p>
                <p className="text-xs text-purple-600 mt-1">👨‍🏫 احمد کریمی</p>
              </div>
              

            </>
          )}
        </div>
      </div>

      {/* بخش ویدیوهای آموزشی */}
      <div>
        {/* Green container box with side-by-side layout */}
        <div className="relative rounded-2xl overflow-hidden p-4 flex gap-4" style={{backgroundColor: 'hsl(140, 60%, 35%)'}}>
          {/* Right side - Title, Logo, and "View More" in vertical column */}
          <div className="flex flex-col items-center justify-center text-center text-white min-w-[120px] space-y-4">
            {/* Title */}
            <div>
              <h2 className="text-2xl font-bold mb-1">ویدیو</h2>
              <h3 className="text-xl">آموزشی</h3>
            </div>
            
            {/* Logo */}
            <div className="w-24 h-24 flex items-center justify-center">
              <img 
                src="/uploads/logo-white.png" 
                alt="Pistat Logo" 
                className="w-20 h-20"
              />
            </div>
            
            {/* View More */}
            <button 
              onClick={() => window.postMessage({ type: 'SWITCH_TAB', tab: 'videos' }, '*')}
              className="text-xs font-bold cursor-pointer hover:opacity-80 transition-opacity"
            >
              مشاهده بیشتر &gt;
            </button>
          </div>
          
          {/* Left side - Videos */}
          <div className="flex-1">
            <div className="flex gap-3 overflow-x-auto pb-2">
            {educationalVideos && educationalVideos
              .slice(0, 4)
              .map((video: any) => (
              <div 
                key={video.id} 
                className="flex-shrink-0 w-48 bg-white rounded-xl shadow-sm border cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                onClick={() => {
                  // Switch to video view
                  window.parent.postMessage({ 
                    type: 'OPEN_VIDEO', 
                    videoId: video.id 
                  }, '*');
                }}
              >
                <div className="w-full h-32 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {video.thumbnailUrl ? (
                    <img 
                      src={video.thumbnailUrl} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 text-sm mb-1" title={video.title}>
                    {video.title.length > 25 ? `${video.title.substring(0, 25)}...` : video.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2" title={video.description}>
                    {video.description ? 
                      (video.description.length > 35 ? `${video.description.substring(0, 35)}...` : video.description) 
                      : 'ویدیو آموزشی'}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    {video.duration && (
                      <span className="text-orange-600">⏱️ {video.duration}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Fallback when no educational videos exist */}
            {(!educationalVideos || educationalVideos.length === 0) && (
              <>
                <div className="flex-shrink-0 w-48 bg-white rounded-xl shadow-sm border cursor-pointer hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-800 text-sm mb-1">آموزش کشت گلخانه‌ای</h3>
                    <p className="text-xs text-gray-500 mb-2">تکنیک‌های نوین کشت</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-orange-600">⏱️ ۱۵ دقیقه</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-shrink-0 w-48 bg-white rounded-xl shadow-sm border cursor-pointer hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-800 text-sm mb-1">آموزش آبیاری قطره‌ای</h3>
                    <p className="text-xs text-gray-500 mb-2">صرفه‌جویی در مصرف آب</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-orange-600">⏱️ ۲۰ دقیقه</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-shrink-0 w-48 bg-white rounded-xl shadow-sm border cursor-pointer hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-800 text-sm mb-1">مدیریت خاک</h3>
                    <p className="text-xs text-gray-500 mb-2">تشخیص و درمان مشکلات خاک</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-orange-600">⏱️ ۳۰ دقیقه</span>
                    </div>
                  </div>
                </div>
                

              </>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {homeContent}
      {/* Magazine Section */}
      <div className="mt-8">
        <MagazineSection />
      </div>
      
      {/* Archive Section */}
      <div className="mt-8">
        <ArchiveSection />
      </div>
    </div>
  );
}

function MagazineSection() {
  const { data: magazines, isLoading } = useQuery<any[]>({
    queryKey: ['/api/magazines'],
  });

  const handleMagazineClick = (magazineId: number) => {
    window.postMessage({ 
      type: 'OPEN_MAGAZINE', 
      magazineId: magazineId 
    }, '*');
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center h-32">
            <div className="text-gray-500">در حال بارگذاری...</div>
          </div>
        </div>
      </div>
    );
  }

  const activeMagazines = magazines?.filter(magazine => magazine.isActive) || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <svg className="ml-2 h-6 w-6" fill="none" stroke="hsl(118, 54%, 40%)" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          فصلنامه رویش سبز
        </h2>
        <button 
          onClick={() => window.postMessage({ type: 'SWITCH_TAB', tab: 'magazines' }, '*')}
          className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
        >
          مشاهده بیشتر
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
          {activeMagazines.slice(0, 4).map((magazine) => (
            <div 
              key={magazine.id} 
              className="bg-white rounded-xl p-4 shadow-sm border cursor-pointer hover:shadow-lg transition-shadow card-interactive"
              onClick={() => handleMagazineClick(magazine.id)}
            >
              <div className="w-full h-32 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                {magazine.coverImageUrl ? (
                  <img 
                    src={magazine.coverImageUrl} 
                    alt={magazine.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                )}
              </div>
              <h3 className="font-medium text-gray-800 text-sm mb-1" title={magazine.title}>
                {magazine.title.length > 25 ? `${magazine.title.substring(0, 25)}...` : magazine.title}
              </h3>
              <p className="text-xs text-gray-500" title={magazine.description}>
                {magazine.description ? 
                  (magazine.description.length > 30 ? `${magazine.description.substring(0, 30)}...` : magazine.description) 
                  : 'توضیحات مجله'}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-blue-600">شماره {magazine.issueNumber}</span>
                <span className="text-xs text-gray-500">{new Date(magazine.publishDate).toLocaleDateString('fa-IR')}</span>
              </div>
            </div>
          ))}
          
          {/* Fallback when no magazines exist */}
          {(!magazines || magazines.length === 0) && (
            <>
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="w-full h-32 rounded-lg mb-3 flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800 text-sm mb-1">مجله کشاورزی نوین</h3>
                <p className="text-xs text-gray-500">آخرین تکنیک‌های کشاورزی و باغبانی</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-blue-600">شماره ۱۲</span>
                  <span className="text-xs text-gray-500">۱۴۰۳/۰۴/۲۰</span>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="w-full h-32 rounded-lg mb-3 flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800 text-sm mb-1">مجله تکنولوژی سبز</h3>
                <p className="text-xs text-gray-500">نوآوری‌های سبز در کشاورزی</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-blue-600">شماره ۸</span>
                  <span className="text-xs text-gray-500">۱۴۰۳/۰۴/۱۵</span>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="w-full h-32 rounded-lg mb-3 flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800 text-sm mb-1">مجله مدیریت مزرعه</h3>
                <p className="text-xs text-gray-500">راهکارهای مدیریت مزرعه و تولید</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-blue-600">شماره ۵</span>
                  <span className="text-xs text-gray-500">۱۴۰۳/۰۴/۱۰</span>
                </div>
              </div>
              

            </>
          )}
        </div>
        

    </div>
  );
}

function ArchiveSection() {
  const { data: documents, isLoading } = useQuery<any[]>({
    queryKey: ['/api/documents'],
  });

  const handleDocumentClick = (documentId: number) => {
    window.postMessage({ 
      type: 'OPEN_DOCUMENT', 
      documentId: documentId 
    }, '*');
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center h-32">
            <div className="text-gray-500">در حال بارگذاری...</div>
          </div>
        </div>
      </div>
    );
  }

  const publishedDocuments = documents?.filter(doc => doc.status === 'published') || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <svg className="ml-2 h-6 w-6" fill="none" stroke="hsl(118, 54%, 40%)" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0a2 2 0 002-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          آرشیو پیستاط
        </h2>
        <button 
          onClick={() => window.postMessage({ type: 'SWITCH_TAB', tab: 'library' }, '*')}
          className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
        >
          مشاهده بیشتر
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
          {publishedDocuments.slice(0, 4).map((document) => (
            <div 
              key={document.id} 
              className="bg-white rounded-xl p-4 shadow-sm border cursor-pointer hover:shadow-lg transition-shadow card-interactive"
              onClick={() => handleDocumentClick(document.id)}
            >
              <div className="w-full h-32 rounded-lg mb-3 flex items-center justify-center overflow-hidden bg-gray-100">
                {document.featuredImage ? (
                  <img 
                    src={document.featuredImage} 
                    alt={document.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0a2 2 0 002-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                )}
              </div>
              <h3 className="font-medium text-gray-800 text-sm mb-1" title={document.title}>
                {document.title.length > 25 ? `${document.title.substring(0, 25)}...` : document.title}
              </h3>
              <p className="text-xs text-gray-500" title={document.excerpt}>
                {document.excerpt ? 
                  (document.excerpt.length > 30 ? `${document.excerpt.substring(0, 30)}...` : document.excerpt) 
                  : 'خلاصه مقاله'}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-blue-600">{document.category}</span>
                <span className="text-xs text-gray-500">{new Date(document.publishDate).toLocaleDateString('fa-IR')}</span>
              </div>
            </div>
          ))}
          
          {/* Fallback when no documents exist */}
          {(!documents || documents.length === 0) && (
            <>
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="w-full h-32 rounded-lg mb-3 flex items-center justify-center bg-gray-100">
                  <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0a2 2 0 002-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800 text-sm mb-1">کشاورزی ارگانیک</h3>
                <p className="text-xs text-gray-500">روش‌های کشاورزی ارگانیک و مزایای آن</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-blue-600">کشاورزی</span>
                  <span className="text-xs text-gray-500">۱۴۰۳/۰۴/۲۰</span>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="w-full h-32 rounded-lg mb-3 flex items-center justify-center bg-gray-100">
                  <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0a2 2 0 002-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800 text-sm mb-1">مدیریت آب</h3>
                <p className="text-xs text-gray-500">تکنیک‌های نوین آبیاری و صرفه‌جویی</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-blue-600">آبیاری</span>
                  <span className="text-xs text-gray-500">۱۴۰۳/۰۴/۱۵</span>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="w-full h-32 rounded-lg mb-3 flex items-center justify-center bg-gray-100">
                  <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0a2 2 0 002-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800 text-sm mb-1">تولید گلخانه‌ای</h3>
                <p className="text-xs text-gray-500">نوآوری‌های تولید در گلخانه</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-blue-600">گلخانه</span>
                  <span className="text-xs text-gray-500">۱۴۰۳/۰۴/۱۰</span>
                </div>
              </div>
              

            </>
          )}
        </div>
        

    </div>
  );
}