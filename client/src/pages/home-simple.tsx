import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Slide } from "@shared/schema";

export default function HomePage() {
  const { data: slides } = useQuery<Slide[]>({
    queryKey: ['/api/slides'],
  });

  const { data: quickAccessItems } = useQuery<any[]>({
    queryKey: ['/api/quick-access'],
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

  return (
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
            <a 
              href={item.link || '#'} 
              className="block"
              onClick={(e) => {
                if (!item.link) {
                  e.preventDefault();
                }
              }}
            >
              <div className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center shadow-lg bg-gray-100 border">
                {item.icon ? (
                  <img 
                    src={item.icon} 
                    alt={item.title}
                    className="w-8 h-8 object-cover rounded"
                  />
                ) : (
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
              </div>
              <p className="text-xs text-gray-700 font-medium">{item.title}</p>
            </a>
          </div>
        ))}
        
        {/* Fallback items if no quick access items exist */}
        {(!quickAccessItems || quickAccessItems?.filter((item: any) => item.isActive).length === 0) && (
          <>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center shadow-lg" style={{backgroundColor: 'hsl(270, 60%, 95%)'}}>
                <svg className="w-8 h-8" style={{color: 'hsl(270, 70%, 60%)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-xs text-gray-700 font-medium">کتابخانه</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center shadow-lg" style={{backgroundColor: 'hsl(25, 100%, 92%)'}}>
                <svg className="w-8 h-8" style={{color: 'hsl(25, 85%, 65%)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-xs text-gray-700 font-medium">ویدیوهای آموزشی</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center shadow-lg" style={{backgroundColor: 'hsl(140, 50%, 92%)'}}>
                <svg className="w-8 h-8" style={{color: 'hsl(140, 60%, 50%)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-xs text-gray-700 font-medium">فصلنامه رویش سبز</p>
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
            <span className="ml-2" style={{color: 'hsl(118, 54%, 40%)'}}>🎓</span>
            کارگاه‌های آموزشی
          </h2>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="w-full h-24 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">کشاورزی هوشمند</h3>
            <p className="text-xs text-gray-500">یادگیری تکنیک‌های نوین</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="w-full h-24 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">مدیریت مزرعه</h3>
            <p className="text-xs text-gray-500">برنامه‌ریزی و نظارت</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="w-full h-24 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">کنترل آفات</h3>
            <p className="text-xs text-gray-500">روش‌های طبیعی</p>
          </div>
        </div>
      </div>
    </div>
  );
}