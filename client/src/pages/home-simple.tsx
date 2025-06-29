export default function HomePage() {
  return (
    <div className="space-y-6 rtl">
      {/* Hero Slider */}
      <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-8 text-center relative">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          به مرکز پیستاط خوش آمدید
        </h1>
        <p className="text-gray-600 mb-6">
          بهترین دوره‌های آموزشی در حوزه کشاورزی
        </p>
        
        <div className="flex gap-4 justify-center mb-6">
          <button className="bg-white text-gray-700 px-4 py-2 rounded-lg border hover:bg-gray-50">
            درباره ما
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2">
            <span>📚</span>
            مشاهده دوره‌ها
          </button>
        </div>

        <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">🎓</span>
          </div>
        </div>
      </div>

      {/* Quick Access Section - Circular Icons */}
      <div className="grid grid-cols-4 gap-4 px-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center shadow-lg border">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-xs text-gray-700 font-medium">فصلنامه رویش سبز</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center shadow-lg border">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-xs text-gray-700 font-medium">ویدئو آموزشی</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center shadow-lg border">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-xs text-gray-700 font-medium">کتابچه</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center shadow-lg border">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <p className="text-xs text-gray-700 font-medium">تماس با ما</p>
        </div>
      </div>

      {/* Workshops Section */}
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
            <p className="text-xs text-gray-500">بهینه‌سازی تولید</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="w-full h-24 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">سیستم آبیاری</h3>
            <p className="text-xs text-gray-500">مدیریت منابع آب</p>
          </div>
        </div>
        
        <div className="text-center">
          <button className="bg-gray-50 text-gray-600 px-6 py-2 rounded-xl font-medium border border-gray-200 flex items-center mx-auto">
            <span className="ml-2">◀</span>
            مشاهده همه
          </button>
        </div>
      </div>

      {/* Webinar Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <svg className="w-6 h-6 ml-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            وبینار
          </h2>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">فایل‌های تخصصی</h3>
            <p className="text-xs text-gray-500 mb-2">دانلود فایل‌های آموزشی و راهنما</p>
            <button className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">دانلود فایل‌ها</button>
          </div>
          
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">مطالب ذخیره شده</h3>
            <p className="text-xs text-gray-500 mb-2">مطالب نشان شده و ذخیره شده شما</p>
            <button className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">مشاهده ذخیره‌ها</button>
          </div>
          
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">راهنماها</h3>
            <p className="text-xs text-gray-500 mb-2">راهنماهای عملی و کاربردی</p>
            <button className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">مطالعه راهنماها</button>
          </div>
        </div>
        
        <div className="text-center">
          <button className="bg-gray-50 text-gray-600 px-6 py-2 rounded-xl font-medium border border-gray-200 flex items-center mx-auto">
            <span className="ml-2">◀</span>
            مشاهده همه
          </button>
        </div>
      </div>

      {/* Library Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <svg className="w-6 h-6 ml-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            کتابخانه
          </h2>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">فایل‌های تخصصی</h3>
            <p className="text-xs text-gray-500 mb-2">دانلود فایل‌های آموزشی و راهنما</p>
            <button className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">دانلود فایل‌ها</button>
          </div>
          
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">مطالب ذخیره شده</h3>
            <p className="text-xs text-gray-500 mb-2">مطالب نشان شده و ذخیره شده شما</p>
            <button className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">مشاهده ذخیره‌ها</button>
          </div>
          
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">راهنماها</h3>
            <p className="text-xs text-gray-500 mb-2">راهنماهای عملی و کاربردی</p>
            <button className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">مطالعه راهنماها</button>
          </div>
        </div>
        
        <div className="text-center">
          <button className="bg-gray-50 text-gray-600 px-6 py-2 rounded-xl font-medium border border-gray-200 flex items-center mx-auto">
            <span className="ml-2">◀</span>
            مشاهده همه
          </button>
        </div>
      </div>

      {/* Instagram Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <svg className="w-6 h-6 ml-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            اینستاگرام پیستاط
          </h2>
        </div>
        
        <div className="grid grid-cols-5 gap-4 mb-4">
          <div className="bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl aspect-square flex items-center justify-center text-white shadow-lg">
            <div className="text-center">
              <div className="text-3xl mb-2">✓</div>
              <div className="text-xs font-medium">نکات کشاورزی</div>
              <div className="text-xs opacity-80">۷ روز پیش</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl aspect-square flex items-center justify-center text-white shadow-lg">
            <div className="text-center">
              <div className="text-xs font-medium">pistac_center®</div>
              <div className="text-xs opacity-80 mt-1">دنبال کنید</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl aspect-square flex items-center justify-center text-white shadow-lg">
            <div className="text-center">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-xs font-medium">تیم متخصصان</div>
              <div className="text-xs opacity-80">۱ روز پیش</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-xl aspect-square flex items-center justify-center text-white shadow-lg">
            <div className="text-center">
              <div className="text-3xl mb-2">🎓</div>
              <div className="text-xs font-medium">کارگاه‌های جدید</div>
              <div className="text-xs opacity-80">۵ ساعت پیش</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl aspect-square flex items-center justify-center text-white shadow-lg">
            <div className="text-center">
              <div className="text-3xl mb-2">📷</div>
              <div className="text-xs font-medium">آخرین فعالیت‌ها</div>
              <div className="text-xs opacity-80">۲ ساعت پیش</div>
            </div>
          </div>
        </div>
      </div>

      {/* Magazine Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <svg className="w-6 h-6 ml-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            فصلنامه رویش سبز
          </h2>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">اشتراک فصلنامه</h3>
            <p className="text-xs text-gray-500 mb-2">عضویت سازمان نظام صنفی کشاورزی</p>
            <button className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">جزئیات شرایط</button>
          </div>
          
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">آمار کشاورزها</h3>
            <p className="text-xs text-gray-500 mb-2">آمار تولید کشاورزان نطنز در سال جاری</p>
            <button className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">مطالعه آمارها</button>
          </div>
          
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">شماره جدید</h3>
            <p className="text-xs text-gray-500 mb-2">شماره ۴ - زمستان ۱۴۰۳</p>
            <button className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">خواندن آنلاین</button>
          </div>
        </div>
        
        <div className="text-center">
          <button className="bg-gray-50 text-gray-600 px-6 py-2 rounded-xl font-medium border border-gray-200 flex items-center mx-auto">
            <span className="ml-2">◀</span>
            مشاهده همه
          </button>
        </div>
      </div>

    </div>
  );
}