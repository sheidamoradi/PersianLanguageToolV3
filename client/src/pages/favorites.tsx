import { useState } from "react";
import { 
  Heart, 
  BookOpen, 
  Users, 
  FileText,
  Video,
  ShoppingCart,
  Eye,
  Download,
  Calendar,
  Trash2,
  ArrowRight
} from "lucide-react";

export default function Favorites() {
  const [activeTab, setActiveTab] = useState("courses");

  const favoriteItems = {
    courses: [
      {
        id: 1,
        title: "دوره کامل React و TypeScript",
        description: "یادگیری مدرن React با TypeScript",
        instructor: "محمد احمدی",
        duration: "۱۲ ساعت",
        price: "۲۹۹,۰۰۰ تومان",
        image: "/api/placeholder/300/200"
      }
    ],
    projects: [
      {
        id: 1,
        title: "پروژه سایت فروشگاهی",
        description: "ساخت فروشگاه آنلاین با React",
        difficulty: "پیشرفته",
        duration: "۸ ساعت",
        price: "۱۹۹,۰۰۰ تومان"
      }
    ],
    documents: [
      {
        id: 1,
        title: "راهنمای کامل JavaScript",
        description: "مرجع جامع زبان جاوااسکریپت",
        author: "علی رضایی",
        pages: "۲۵۰ صفحه",
        format: "PDF"
      }
    ],
    media: [
      {
        id: 1,
        title: "ویدیو آموزش Node.js",
        description: "آموزش کامل Node.js از مبتدی تا پیشرفته",
        duration: "۳ ساعت",
        quality: "۱۰۸۰p",
        size: "۲.۵ گیگابایت"
      }
    ]
  };

  const tabs = [
    { id: "courses", label: "دوره‌ها", icon: BookOpen },
    { id: "projects", label: "پروژه‌ها", icon: Users },
    { id: "documents", label: "کتابخانه", icon: FileText },
    { id: "media", label: "رسانه", icon: Video }
  ];

  return (
    <div className="container mx-auto px-4 py-8 pb-20" dir="rtl">
      <button 
        onClick={() => window.postMessage({ type: 'SHOW_HOME' }, '*')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowRight className="h-5 w-5" />
        بازگشت
      </button>
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">علاقه‌مندی‌ها</h1>
        <p className="text-gray-600">محتواهای مورد علاقه شما</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b">
        {tabs.map(tab => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? 'border-blue-500 text-blue-600 font-medium' 
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <IconComponent className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteItems[activeTab as keyof typeof favoriteItems].map((item: any) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {item.description}
                </p>
              </div>
              <button className="text-red-500 hover:text-red-700 p-1">
                <Heart className="h-5 w-5 fill-current" />
              </button>
            </div>

            {/* Item specific info */}
            <div className="space-y-2 mb-4">
              {activeTab === "courses" && (
                <>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 ml-1" />
                    <span>{item.instructor}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 ml-1" />
                    <span>{item.duration}</span>
                  </div>
                </>
              )}
              
              {activeTab === "projects" && (
                <div className="flex items-center text-sm text-gray-600">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    {item.difficulty}
                  </span>
                  <span className="mr-2">{item.duration}</span>
                </div>
              )}
              
              {activeTab === "documents" && (
                <>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 ml-1" />
                    <span>{item.author}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText className="h-4 w-4 ml-1" />
                    <span>{item.pages} • {item.format}</span>
                  </div>
                </>
              )}
              
              {activeTab === "media" && (
                <div className="flex items-center text-sm text-gray-600">
                  <Video className="h-4 w-4 ml-1" />
                  <span>{item.duration} • {item.quality} • {item.size}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                <Eye className="h-4 w-4" />
                مشاهده
              </button>
              {(activeTab === "courses" || activeTab === "projects") && (
                <button className="flex-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-1">
                  <ShoppingCart className="h-4 w-4" />
                  خرید
                </button>
              )}
              {(activeTab === "documents" || activeTab === "media") && (
                <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center gap-1">
                  <Download className="h-4 w-4" />
                  دانلود
                </button>
              )}
              <button className="px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {favoriteItems[activeTab as keyof typeof favoriteItems].length === 0 && (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ موردی یافت نشد</h3>
          <p className="text-gray-600">شما هنوز هیچ {tabs.find(t => t.id === activeTab)?.label} را به علاقه‌مندی‌ها اضافه نکرده‌اید</p>
        </div>
      )}
    </div>
  );
}