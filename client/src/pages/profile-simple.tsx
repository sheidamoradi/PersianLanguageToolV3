import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { LoginModal } from "@/components/LoginModal";
import { 
  User, 
  Mail, 
  Calendar,
  Settings,
  LogOut,
  BookOpen,
  Download,
  Eye,
  Award,
  Heart,
  Bell,
  FileText,
  ArrowRight
} from "lucide-react";

interface User {
  id?: number;
  username?: string;
  email?: string;
  name?: string;
  role?: string;
  progress?: number;
  membershipType?: string;
}

export default function Profile() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Check if user is admin and redirect to admin panel
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      window.parent.postMessage({ type: 'SWITCH_TAB', tab: 'admin' }, '*');
    }
  }, [isAuthenticated, user]);
  
  // If not authenticated, show login modal
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [isLoading, isAuthenticated]);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      window.parent.postMessage({ type: 'SWITCH_TAB', tab: 'home' }, '*');
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 pb-24" dir="rtl">
        <div className="animate-pulse">
          <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div className="w-48 h-6 bg-gray-200 rounded mx-auto mb-2"></div>
          <div className="w-32 h-4 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  // Show login modal if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="p-4 pb-24" dir="rtl">
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">پروفایل کاربری</h2>
          <p className="text-gray-600 mb-4">برای مشاهده پروفایل خود وارد شوید</p>
        </div>
        
        {showLoginModal && (
          <LoginModal 
            isOpen={showLoginModal} 
            onClose={() => setShowLoginModal(false)} 
            message="برای مشاهده پروفایل خود وارد شوید"
          />
        )}
      </div>
    );
  }

  return (
    <div className="p-4 pb-24" dir="rtl">
      <button 
        onClick={() => window.postMessage({ type: 'SHOW_HOME' }, '*')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowRight className="h-5 w-5" />
        بازگشت
      </button>
      
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {user?.name || user?.username || "کاربر"}
          </h1>
          <p className="text-gray-600 mb-4">{user?.email || "user@example.com"}</p>
          <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
            <span>فعال</span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">12</div>
              <div className="text-sm text-gray-600">دوره تکمیل شده</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">45</div>
              <div className="text-sm text-gray-600">ساعت یادگیری</div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            <Settings className="w-4 h-4 inline ml-2" />
            ویرایش پروفایل
          </button>
          <button 
            onClick={handleLogout}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <LogOut className="w-4 h-4 inline ml-2" />
            خروج
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border text-center">
          <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-xl font-bold text-gray-900">8</div>
          <div className="text-sm text-gray-600">دوره‌ها</div>
        </div>
        <div className="bg-white p-4 rounded-lg border text-center">
          <Eye className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-xl font-bold text-gray-900">156</div>
          <div className="text-sm text-gray-600">بازدید</div>
        </div>
        <div className="bg-white p-4 rounded-lg border text-center">
          <Download className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-xl font-bold text-gray-900">23</div>
          <div className="text-sm text-gray-600">دانلود</div>
        </div>
        <div className="bg-white p-4 rounded-lg border text-center">
          <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <div className="text-xl font-bold text-gray-900">5</div>
          <div className="text-sm text-gray-600">جایزه</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">فعالیت‌های اخیر</h2>
        <div className="space-y-4">
          {[
            { action: "تکمیل دوره", title: "آموزش React", time: "2 ساعت پیش" },
            { action: "دانلود فایل", title: "راهنمای پروژه", time: "5 ساعت پیش" },
            { action: "شرکت در وبینار", title: "طراحی UI/UX", time: "1 روز پیش" }
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.action}:</span> {activity.title}
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Profile Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Favorites */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-gray-900">علاقه‌مندی‌ها</h2>
          </div>
          <div className="space-y-3">
            {[
              { title: "دوره React پیشرفته", type: "course" },
              { title: "وبینار طراحی UI", type: "webinar" },
              { title: "مقاله آموزش Node.js", type: "article" }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900">اعلانات</h2>
          </div>
          <div className="space-y-3">
            {[
              { title: "دوره جدید اضافه شد", time: "2 ساعت پیش" },
              { title: "وبینار فردا برگزار می‌شود", time: "5 ساعت پیش" },
              { title: "آپدیت سیستم", time: "1 روز پیش" }
            ].map((notification, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{notification.title}</p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Downloads */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Download className="w-5 h-5 text-green-500" />
            <h2 className="text-lg font-semibold text-gray-900">دانلودها</h2>
          </div>
          <div className="space-y-3">
            {[
              { title: "راهنمای پروژه.pdf", size: "2.5 MB", date: "امروز" },
              { title: "کتاب آموزش React.pdf", size: "15 MB", date: "دیروز" },
              { title: "فایل تمرین.zip", size: "800 KB", date: "3 روز پیش" }
            ].map((download, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <FileText className="w-4 h-4 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{download.title}</p>
                  <p className="text-xs text-gray-500">{download.size} • {download.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}