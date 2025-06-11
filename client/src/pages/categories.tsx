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
      description: "وبینارهای آموزشی و تخصصی",
      icon: <Video className="h-12 w-12" />,
      link: "/projects",
      color: "bg-blue-500",
      count: "۱۲ وبینار"
    },
    {
      id: 2,
      title: "کارگاه",
      description: "کارگاه‌های عملی و آموزشی",
      icon: <Users className="h-12 w-12" />,
      link: "/courses",
      color: "bg-green-500",
      count: "۸ کارگاه"
    },
    {
      id: 3,
      title: "فصلنامه رویش سبز",
      description: "مجله تخصصی کشاورزی",
      icon: <FileText className="h-12 w-12" />,
      link: "/magazine",
      color: "bg-purple-500",
      count: "۴ شماره"
    },
    {
      id: 4,
      title: "کتابخانه",
      description: "منابع آموزشی و اسناد",
      icon: <BookOpen className="h-12 w-12" />,
      link: "/library",
      color: "bg-orange-500",
      count: "۸ سند"
    }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-right mb-2">دسته‌بندی‌های آموزشی</h1>
        <p className="text-muted-foreground text-right">
          انتخاب کنید که به کدام بخش می‌خواهید بروید
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {categories.map((category) => (
          <Link key={category.id} href={category.link}>
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
              <CardHeader className="text-center">
                <div className={`${category.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-white group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>
                <CardTitle className="text-xl mb-2">{category.title}</CardTitle>
                <CardDescription className="text-center">
                  {category.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{category.count}</span>
                  <div className="flex items-center gap-1 group-hover:text-primary transition-colors">
                    <span>مشاهده</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">۱۲</div>
          <div className="text-sm text-blue-700">وبینار فعال</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">۸</div>
          <div className="text-sm text-green-700">کارگاه آموزشی</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">۴</div>
          <div className="text-sm text-purple-700">شماره فصلنامه</div>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">۸</div>
          <div className="text-sm text-orange-700">سند کتابخانه</div>
        </div>
      </div>
    </div>
  );
}