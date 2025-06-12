import { useState } from "react";

interface AdminStats {
  totalCourses: number;
  totalWorkshops: number;
  totalPosts: number;
  totalMedia: number;
}

export default function AdminSimple() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Sample stats
  const stats: AdminStats = {
    totalCourses: 12,
    totalWorkshops: 8,
    totalPosts: 24,
    totalMedia: 156
  };

  const menuItems = [
    { id: 'dashboard', title: 'پیشخوان', icon: '🏠' },
    { id: 'courses', title: 'درس‌ها', icon: '📚' },
    { id: 'workshops', title: 'کارگاه‌ها', icon: '👥' },
    { id: 'posts', title: 'نوشته‌ها', icon: '📝' },
    { id: 'media', title: 'رسانه', icon: '🖼️' },
    { id: 'slider', title: 'اسلایدر', icon: '🎞️' },
    { id: 'appearance', title: 'ظاهر', icon: '🎨' },
    { id: 'settings', title: 'تنظیمات', icon: '⚙️' }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">پیشخوان</h1>
        <p className="text-gray-600 mt-1">مدیریت سیستم آموزشی پیستاط</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">کل درس‌ها</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
            </div>
            <span className="text-2xl">📚</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">کارگاه‌ها</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalWorkshops}</p>
            </div>
            <span className="text-2xl">👥</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">نوشته‌ها</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
            </div>
            <span className="text-2xl">📝</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">فایل‌های رسانه</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMedia}</p>
            </div>
            <span className="text-2xl">🖼️</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">اقدامات سریع</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => setActiveSection('posts')}
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mb-2">📝</span>
            <span className="text-sm font-medium">ایجاد نوشته</span>
          </button>
          
          <button 
            onClick={() => setActiveSection('media')}
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mb-2">📤</span>
            <span className="text-sm font-medium">آپلود رسانه</span>
          </button>
          
          <button 
            onClick={() => setActiveSection('appearance')}
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mb-2">🎨</span>
            <span className="text-sm font-medium">تنظیم ظاهر</span>
          </button>
          
          <button 
            onClick={() => setActiveSection('settings')}
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mb-2">⚙️</span>
            <span className="text-sm font-medium">تنظیمات</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderAppearance = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">ظاهر سایت</h1>
        <p className="text-gray-600 mt-1">تنظیمات ظاهری و رنگ‌بندی</p>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">تنظیمات رنگ آیکون‌ها</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رنگ اصلی آیکون‌ها (فعلی: سبز لوگو)
            </label>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <input
                type="color"
                defaultValue="#578057"
                className="w-16 h-10 border rounded cursor-pointer"
              />
              <span className="text-sm text-gray-600">#578057</span>
            </div>
          </div>
          
          <div className="pt-4">
            <h4 className="font-medium mb-3">پیش‌نمایش تغییرات:</h4>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <div className="flex items-center">
                <span className="text-2xl ml-2" style={{color: '#578057'}}>🎓</span>
                <span className="text-sm">کارگاه‌های آموزشی</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl ml-2" style={{color: '#578057'}}>🎬</span>
                <span className="text-sm">وبینار</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl ml-2" style={{color: '#578057'}}>📚</span>
                <span className="text-sm">کتابخانه</span>
              </div>
            </div>
          </div>
          
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
            ذخیره تغییرات
          </button>
        </div>
      </div>
    </div>
  );

  const renderMedia = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">مدیریت رسانه</h1>
          <p className="text-gray-600 mt-1">آپلود و مدیریت تصاویر و فایل‌ها</p>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
          آپلود فایل جدید
        </button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <span className="text-4xl mb-4 block">📤</span>
          <p className="text-lg font-medium text-gray-900 mb-2">آپلود فایل</p>
          <p className="text-sm text-gray-500 mb-4">فایل را اینجا بکشید یا کلیک کنید</p>
          <input
            type="file"
            multiple
            className="block w-full text-sm text-gray-500 file:ml-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-white rounded-lg border shadow-sm p-4">
            <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
              <span className="text-2xl">🖼️</span>
            </div>
            <p className="text-sm font-medium">تصویر نمونه {item}</p>
            <p className="text-xs text-gray-500">۱۲۳ کیلوبایت</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return renderDashboard();
      case 'appearance': return renderAppearance();
      case 'media': return renderMedia();
      case 'posts': 
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">مدیریت نوشته‌ها</h1>
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <p className="text-gray-600">صفحه مدیریت نوشته‌ها به زودی تکمیل می‌شود</p>
            </div>
          </div>
        );
      default: 
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{menuItems.find(item => item.id === activeSection)?.title}</h1>
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <p className="text-gray-600">این بخش به زودی تکمیل می‌شود</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">پ</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">پنل مدیریت</h1>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="text-lg ml-3">{item.icon}</span>
                {item.title}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pr-64">
        {/* Mobile header */}
        <div className="bg-white shadow-sm border-b lg:hidden">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-lg font-semibold text-gray-900">پنل مدیریت</h1>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <span className="text-xl">☰</span>
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}