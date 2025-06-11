import { Link } from "wouter";
import { 
  BookOpen, 
  Video, 
  Users, 
  FileText,
  ArrowRight
} from "lucide-react";

export default function Categories() {
  const categories = [
    {
      id: 1,
      title: "وبینار",
      description: "آموزش‌های آنلاین و جلسات زنده",
      icon: Video,
      link: "/projects?type=webinar",
      color: "bg-gradient-to-br from-red-500 to-pink-600",
      count: "۱۲+ وبینار"
    },
    {
      id: 2,
      title: "دوره‌های آموزشی",
      description: "دوره‌های جامع و تخصصی",
      icon: BookOpen,
      link: "/courses",
      color: "bg-gradient-to-br from-blue-500 to-indigo-600",
      count: "۸+ دوره"
    },
    {
      id: 3,
      title: "پروژه‌ها",
      description: "پروژه‌های عملی و کاربردی",
      icon: FileText,
      link: "/projects?type=project",
      color: "bg-gradient-to-br from-green-500 to-emerald-600",
      count: "۱۵+ پروژه"
    },
    {
      id: 4,
      title: "انجمن",
      description: "گفتگو و تبادل نظر با سایرین",
      icon: Users,
      link: "/community",
      color: "bg-gradient-to-br from-purple-500 to-violet-600",
      count: "۵۰۰+ عضو"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/50 p-4 pb-24" dir="rtl">
      {/* Header */}
      <div className="text-center mb-12 pt-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          دسته‌بندی‌ها
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          محتوای آموزشی متنوع و با کیفیت در انتظار شماست
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {categories.map((category) => (
          <Link key={category.id} href={category.link}>
            <div className="hover:shadow-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer group bg-white rounded-xl border">
              <div className="text-center p-6">
                <div className={`${category.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-white group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl mb-2 font-bold text-gray-900">{category.title}</h3>
                <p className="text-center text-gray-600 mb-4">
                  {category.description}
                </p>
              </div>
              
              <div className="px-6 pb-6">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{category.count}</span>
                  <div className="flex items-center gap-1 group-hover:text-blue-600 transition-colors">
                    <span>مشاهده</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
        <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-blue-600">۱۲+</div>
          <div className="text-sm text-gray-600">وبینار</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-green-600">۸+</div>
          <div className="text-sm text-gray-600">دوره</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-purple-600">۱۵+</div>
          <div className="text-sm text-gray-600">پروژه</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-red-600">۵۰۰+</div>
          <div className="text-sm text-gray-600">کاربر</div>
        </div>
      </div>
    </div>
  );
}