import { Link, useLocation } from "wouter";
import { User } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Header() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-20" dir="rtl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Hamburger Menu */}
        <div className="flex items-center">
          {/* Hamburger Menu Button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <button className="ml-3 p-2 text-neutral-400 hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80" dir="rtl">
              <SheetHeader>
                <SheetTitle className="text-right">منو</SheetTitle>
              </SheetHeader>
              
              <div className="mt-6">
                {/* User Profile Section */}
                <div className="bg-neutral-100 rounded-lg p-4 mb-6">
                  <div className="flex items-center mb-3">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-medium ml-3">
                      کا
                    </div>
                    <div>
                      <p className="font-medium text-neutral-700">کاربر مهمان</p>
                      <p className="text-sm text-neutral-500">عضویت ساده</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-neutral-500">پیشرفت</p>
                      <p className="font-medium text-neutral-700">0%</p>
                    </div>
                    <div className="h-2 w-24 bg-neutral-300 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Main Menu */}
                <div className="space-y-1 mb-6">
                  <h3 className="text-xs uppercase text-neutral-500 font-medium mb-3">منوی اصلی</h3>
                  <Link 
                    href="/" 
                    className={`flex items-center p-3 rounded-lg transition-colors ${location === "/" ? "bg-primary text-white" : "text-neutral-600 hover:bg-neutral-100"}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="material-icons ml-3">home</span>
                    <span>خانه</span>
                  </Link>
                  <Link 
                    href="/courses" 
                    className={`flex items-center p-3 rounded-lg transition-colors ${location === "/courses" ? "bg-primary text-white" : "text-neutral-600 hover:bg-neutral-100"}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="material-icons ml-3">menu_book</span>
                    <span>کارگاه‌های آموزشی</span>
                  </Link>
                  <Link 
                    href="/projects" 
                    className={`flex items-center p-3 rounded-lg transition-colors ${location === "/projects" ? "bg-primary text-white" : "text-neutral-600 hover:bg-neutral-100"}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="material-icons ml-3">assignment</span>
                    <span>وبینارها</span>
                  </Link>
                  <Link 
                    href="/library" 
                    className={`flex items-center p-3 rounded-lg transition-colors ${location === "/library" ? "bg-primary text-white" : "text-neutral-600 hover:bg-neutral-100"}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="material-icons ml-3">library_books</span>
                    <span>کتابخانه</span>
                  </Link>
                  <Link 
                    href="/magazine" 
                    className={`flex items-center p-3 rounded-lg transition-colors ${location === "/magazine" ? "bg-primary text-white" : "text-neutral-600 hover:bg-neutral-100"}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="material-icons ml-3">auto_stories</span>
                    <span>فصلنامه رویش سبز</span>
                  </Link>
                </div>

                {/* Account Menu */}
                <div className="space-y-1">
                  <h3 className="text-xs uppercase text-neutral-500 font-medium mb-3">حساب کاربری</h3>
                  <Link 
                    href="/admin" 
                    className={`flex items-center p-3 rounded-lg transition-colors ${location === "/admin" ? "bg-primary text-white" : "text-neutral-600 hover:bg-neutral-100"}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="material-icons ml-3">dashboard</span>
                    <span>پنل مدیریت</span>
                  </Link>
                  <Link 
                    href="/profile" 
                    className={`flex items-center p-3 rounded-lg transition-colors ${location === "/profile" ? "bg-primary text-white" : "text-neutral-600 hover:bg-neutral-100"}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="material-icons ml-3">person</span>
                    <span>پروفایل</span>
                  </Link>
                  <Link 
                    href="/settings" 
                    className={`flex items-center p-3 rounded-lg transition-colors ${location === "/settings" ? "bg-primary text-white" : "text-neutral-600 hover:bg-neutral-100"}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="material-icons ml-3">settings</span>
                    <span>تنظیمات</span>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary text-3xl w-7 h-7 ml-2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
          </svg>
          <h1 className="text-xl font-semibold text-neutral-500">پیستاط</h1>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 space-x-reverse">
          <Link href="/" className={location === "/" ? "text-primary font-medium" : "text-neutral-400 hover:text-primary transition-colors font-medium"}>
            خانه
          </Link>
          <Link href="/courses" className={location === "/courses" ? "text-primary font-medium" : "text-neutral-400 hover:text-primary transition-colors font-medium"}>
            کارگاه‌ها
          </Link>
          <Link href="/projects" className={location === "/projects" ? "text-primary font-medium" : "text-neutral-400 hover:text-primary transition-colors font-medium"}>
            وبینارها
          </Link>
          <Link href="/library" className={location === "/library" ? "text-primary font-medium" : "text-neutral-400 hover:text-primary transition-colors font-medium"}>
            کتابخانه
          </Link>
          <Link href="/magazine" className={location === "/magazine" ? "text-primary font-medium" : "text-neutral-400 hover:text-primary transition-colors font-medium"}>
            فصلنامه رویش سبز
          </Link>
          <Link href="/admin" className={location === "/admin" ? "text-primary font-medium" : "text-neutral-400 hover:text-primary transition-colors font-medium"}>
            پنل مدیریت
          </Link>
        </nav>
        
        {/* User Menu */}
        <div className="flex items-center">
          <button className="ml-4 text-neutral-400 hover:text-primary p-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
            کا
          </div>
        </div>
      </div>
    </header>
  );
}
