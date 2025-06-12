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
          <div className="w-16 h-16 mx-auto mb-2 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl">📖</span>
          </div>
          <p className="text-xs text-gray-700 font-medium">فصلنامه رویش سبز</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-2 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl">🎥</span>
          </div>
          <p className="text-xs text-gray-700 font-medium">ویدئو آموزشی</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-2 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl">📚</span>
          </div>
          <p className="text-xs text-gray-700 font-medium">کتابچه</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-2 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl">📞</span>
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
            <div className="w-full h-24 bg-blue-100 rounded-lg mb-3 flex items-center justify-center">
              <span className="text-blue-600 text-2xl">🌱</span>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">کشاورزی هوشمند</h3>
            <p className="text-xs text-gray-500">یادگیری تکنیک‌های نوین</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="w-full h-24 bg-green-100 rounded-lg mb-3 flex items-center justify-center">
              <span className="text-green-600 text-2xl">🚜</span>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">مدیریت مزرعه</h3>
            <p className="text-xs text-gray-500">بهینه‌سازی تولید</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="w-full h-24 bg-orange-100 rounded-lg mb-3 flex items-center justify-center">
              <span className="text-orange-600 text-2xl">💧</span>
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
            <span className="ml-2" style={{color: 'hsl(118, 54%, 40%)'}}>🎬</span>
            وبینار
          </h2>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
            <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xl">📄</span>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">فایل‌های تخصصی</h3>
            <p className="text-xs text-gray-500 mb-2">دانلود فایل‌های آموزشی و راهنما</p>
            <button className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded">دانلود فایل‌ها</button>
          </div>
          
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
            <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xl">🔖</span>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">مطالب ذخیره شده</h3>
            <p className="text-xs text-gray-500 mb-2">مطالب نشان شده و ذخیره شده شما</p>
            <button className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded">مشاهده ذخیره‌ها</button>
          </div>
          
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
            <div className="w-12 h-12 mx-auto mb-3 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 text-xl">📖</span>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">راهنماها</h3>
            <p className="text-xs text-gray-500 mb-2">راهنماهای عملی و کاربردی</p>
            <button className="text-xs text-yellow-600 bg-yellow-50 px-3 py-1 rounded">مطالعه راهنماها</button>
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
            <span className="ml-2" style={{color: 'hsl(118, 54%, 40%)'}}>📚</span>
            کتابخانه
          </h2>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
            <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xl">📄</span>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">فایل‌های تخصصی</h3>
            <p className="text-xs text-gray-500 mb-2">دانلود فایل‌های آموزشی و راهنما</p>
            <button className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded">دانلود فایل‌ها</button>
          </div>
          
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
            <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xl">🔖</span>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">مطالب ذخیره شده</h3>
            <p className="text-xs text-gray-500 mb-2">مطالب نشان شده و ذخیره شده شما</p>
            <button className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded">مشاهده ذخیره‌ها</button>
          </div>
          
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
            <div className="w-12 h-12 mx-auto mb-3 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 text-xl">📖</span>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">راهنماها</h3>
            <p className="text-xs text-gray-500 mb-2">راهنماهای عملی و کاربردی</p>
            <button className="text-xs text-yellow-600 bg-yellow-50 px-3 py-1 rounded">مطالعه راهنماها</button>
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
            <span className="ml-2" style={{color: 'hsl(118, 54%, 40%)'}}>📷</span>
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
            <span className="ml-2" style={{color: 'hsl(118, 54%, 40%)'}}>📰</span>
            فصلنامه رویش سبز
          </h2>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
            <div className="w-12 h-12 mx-auto mb-3 bg-teal-100 rounded-full flex items-center justify-center">
              <span className="text-teal-600 text-xl">📑</span>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">اشتراک فصلنامه</h3>
            <p className="text-xs text-gray-500 mb-2">عضویت سازمان نظام صنفی کشاورزی</p>
            <button className="text-xs text-teal-600 bg-teal-50 px-3 py-1 rounded">جزئیات شرایط</button>
          </div>
          
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
            <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xl">📊</span>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">آمار کشاورزها</h3>
            <p className="text-xs text-gray-500 mb-2">آمار تولید کشاورزان نطنز در سال جاری</p>
            <button className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded">مطالعه آمارها</button>
          </div>
          
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
            <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xl">📰</span>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">شماره جدید</h3>
            <p className="text-xs text-gray-500 mb-2">شماره ۴ - زمستان ۱۴۰۳</p>
            <button className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded">خواندن آنلاین</button>
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