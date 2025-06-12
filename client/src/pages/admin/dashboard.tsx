import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, FileText, Image, Settings, BarChart3 } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  const quickActions = [
    {
      title: "ایجاد درس جدید",
      description: "درس جدید اضافه کنید",
      icon: BookOpen,
      href: "/admin/courses/new",
      color: "bg-blue-500"
    },
    {
      title: "ایجاد کارگاه",
      description: "کارگاه آموزشی جدید",
      icon: Users,
      href: "/admin/workshops/new",
      color: "bg-green-500"
    },
    {
      title: "ایجاد نوشته",
      description: "مقاله یا نوشته جدید",
      icon: FileText,
      href: "/admin/posts/new",
      color: "bg-purple-500"
    },
    {
      title: "مدیریت رسانه",
      description: "آپلود تصاویر و فایل‌ها",
      icon: Image,
      href: "/admin/media",
      color: "bg-orange-500"
    }
  ];

  const recentActivities = [
    { action: "درس جدید ایجاد شد", user: "مدیر", time: "۲ ساعت پیش" },
    { action: "کارگاه به‌روزرسانی شد", user: "مدیر", time: "۵ ساعت پیش" },
    { action: "تصویر جدید آپلود شد", user: "مدیر", time: "۱ روز پیش" },
    { action: "تنظیمات تغییر کرد", user: "مدیر", time: "۲ روز پیش" }
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">پیشخوان</h1>
          <p className="text-gray-600 mt-1">مدیریت سیستم آموزشی پیستاط</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Settings className="w-4 h-4 ml-2" />
          تنظیمات
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">کل درس‌ها</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCourses || 12}</div>
            <p className="text-xs text-muted-foreground">+2 از ماه گذشته</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">کارگاه‌ها</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalWorkshops || 8}</div>
            <p className="text-xs text-muted-foreground">+1 از ماه گذشته</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">نوشته‌ها</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPosts || 24}</div>
            <p className="text-xs text-muted-foreground">+5 از ماه گذشته</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">فایل‌های رسانه</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalMedia || 156}</div>
            <p className="text-xs text-muted-foreground">+12 از ماه گذشته</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>اقدامات سریع</CardTitle>
              <CardDescription>
                دسترسی سریع به عملیات مهم
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <div
                    key={index}
                    className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className={`${action.color} p-3 rounded-lg ml-4`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>فعالیت‌های اخیر</CardTitle>
            <CardDescription>
              آخرین تغییرات سیستم
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 rtl:space-x-reverse">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500">
                      توسط {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>آمار بازدید</CardTitle>
            <CardDescription>
              بازدید از محتوا در ۳۰ روز گذشته
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">نمودار آمار</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>پربازدیدترین محتوا</CardTitle>
            <CardDescription>
              محتوای محبوب در این ماه
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { title: "کشاورزی هوشمند", views: "1,234", type: "درس" },
                { title: "مدیریت مزرعه", views: "987", type: "کارگاه" },
                { title: "سیستم آبیاری", views: "756", type: "درس" },
                { title: "کودهای ارگانیک", views: "543", type: "مقاله" }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.type}</p>
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    {item.views} بازدید
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}