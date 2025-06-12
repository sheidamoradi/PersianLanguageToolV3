import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  BookOpen,
  Users,
  FileText,
  Image,
  Settings,
  BarChart3,
  Menu,
  X,
  LogOut,
  User,
  Palette,
  Monitor,
  Sliders
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();

  const menuItems = [
    {
      title: "پیشخوان",
      icon: Home,
      href: "/admin",
      active: location === "/admin"
    },
    {
      title: "درس‌ها",
      icon: BookOpen,
      href: "/admin/courses",
      active: location.startsWith("/admin/courses")
    },
    {
      title: "کارگاه‌ها",
      icon: Users,
      href: "/admin/workshops",
      active: location.startsWith("/admin/workshops")
    },
    {
      title: "نوشته‌ها",
      icon: FileText,
      href: "/admin/posts",
      active: location.startsWith("/admin/posts")
    },
    {
      title: "رسانه",
      icon: Image,
      href: "/admin/media",
      active: location.startsWith("/admin/media")
    },
    {
      title: "اسلایدر",
      icon: Sliders,
      href: "/admin/slider",
      active: location.startsWith("/admin/slider")
    },
    {
      title: "آمار",
      icon: BarChart3,
      href: "/admin/analytics",
      active: location.startsWith("/admin/analytics")
    },
    {
      title: "ظاهر",
      icon: Palette,
      href: "/admin/appearance",
      active: location.startsWith("/admin/appearance")
    },
    {
      title: "تنظیمات",
      icon: Settings,
      href: "/admin/settings",
      active: location.startsWith("/admin/settings")
    }
  ];

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
          {/* Logo and close button */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">پ</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">پنل مدیریت</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <a className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}>
                  <item.icon className="h-5 w-5 ml-3" />
                  {item.title}
                </a>
              </Link>
            ))}
          </nav>

          {/* User menu */}
          <div className="p-4 border-t">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                  <Avatar className="h-8 w-8 ml-2">
                    <AvatarImage src="/avatars/admin.jpg" alt="مدیر" />
                    <AvatarFallback>م</AvatarFallback>
                  </Avatar>
                  <div className="text-right">
                    <p className="text-sm font-medium">مدیر سیستم</p>
                    <p className="text-xs text-gray-500">admin@pistach.com</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>حساب کاربری</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="ml-2 h-4 w-4" />
                  <span>پروفایل</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Monitor className="ml-2 h-4 w-4" />
                  <span>مشاهده سایت</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="ml-2 h-4 w-4" />
                  <span>خروج</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pr-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b lg:hidden">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-lg font-semibold text-gray-900">پنل مدیریت</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Page content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}