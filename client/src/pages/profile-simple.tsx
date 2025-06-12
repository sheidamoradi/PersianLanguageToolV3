import { useQuery } from "@tanstack/react-query";
import { 
  User, 
  Mail, 
  Calendar,
  Settings,
  LogOut,
  BookOpen,
  Download,
  Eye,
  Award
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
  const { data: user = {} as User, isLoading } = useQuery<User>({
    queryKey: ['/api/user'],
  });

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

  return (
    <div className="p-4 pb-24" dir="rtl">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {user.username || "کاربر"}
          </h1>
          <p className="text-gray-600 mb-4">{user.email || "user@example.com"}</p>
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
          <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
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

      {/* Achievements */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">دستاوردها</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { name: "دانشجوی نمونه", icon: "🏆", earned: true },
            { name: "پیشرو", icon: "⭐", earned: true },
            { name: "متخصص", icon: "🎯", earned: false }
          ].map((achievement, index) => (
            <div 
              key={index} 
              className={`text-center p-3 rounded-lg border ${
                achievement.earned 
                  ? "bg-yellow-50 border-yellow-200" 
                  : "bg-gray-50 border-gray-200 opacity-50"
              }`}
            >
              <div className="text-2xl mb-1">{achievement.icon}</div>
              <div className="text-xs text-gray-700">{achievement.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}