import { useQuery } from "@tanstack/react-query";
// کامپوننت‌های ساده
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

export default function Profile() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/user/1"],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">در حال بارگذاری پروفایل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-right mb-2">پروفایل کاربری</h1>
        <p className="text-muted-foreground text-right">
          مدیریت اطلاعات شخصی و تنظیمات حساب کاربری
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-12 w-12 text-white" />
              </div>
              <CardTitle className="text-xl">{user?.username || 'کاربر'}</CardTitle>
              <CardDescription>مدیر سیستم</CardDescription>
              <Badge variant="default" className="w-fit mx-auto">
                <Award className="h-3 w-3 ml-1" />
                کاربر فعال
              </Badge>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>admin@pistach.ir</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>عضو از: ۱۴۰۳/۰۱/۰۱</span>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 ml-2" />
                  تنظیمات حساب
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                  <LogOut className="h-4 w-4 ml-2" />
                  خروج از حساب
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">۸</div>
                <div className="text-sm text-muted-foreground">اسناد مطالعه شده</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Download className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">۱۵</div>
                <div className="text-sm text-muted-foreground">فایل دانلود شده</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Eye className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">۲۳</div>
                <div className="text-sm text-muted-foreground">ساعت مطالعه</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Award className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">۵</div>
                <div className="text-sm text-muted-foreground">کارگاه تکمیل شده</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>فعالیت‌های اخیر</CardTitle>
              <CardDescription>
                آخرین فعالیت‌های شما در پلتفرم
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">مطالعه راهنمای کشت گلخانه‌ای</p>
                    <p className="text-sm text-muted-foreground">۲ ساعت پیش</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Download className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">دانلود گزارش آبیاری قطره‌ای</p>
                    <p className="text-sm text-muted-foreground">۱ روز پیش</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">شرکت در کارگاه کود آلی</p>
                    <p className="text-sm text-muted-foreground">۳ روز پیش</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>دستاوردها</CardTitle>
              <CardDescription>
                نشان‌ها و مدارک کسب شده
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Award className="h-6 w-6 text-yellow-600" />
                  </div>
                  <p className="font-medium">خواننده فعال</p>
                  <p className="text-xs text-muted-foreground">۱۰ سند مطالعه شده</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="font-medium">علاقه‌مند به یادگیری</p>
                  <p className="text-xs text-muted-foreground">۵ کارگاه تکمیل</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg opacity-50">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Award className="h-6 w-6 text-gray-600" />
                  </div>
                  <p className="font-medium">کارشناس</p>
                  <p className="text-xs text-muted-foreground">۲۰ کارگاه تکمیل</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}