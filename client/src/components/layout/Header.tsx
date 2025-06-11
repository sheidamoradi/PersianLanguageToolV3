import { Link, useLocation } from "wouter";
import { User, Menu, X } from "lucide-react";
import { useState } from "react";
import logoPath from "@assets/logo.png";

export default function Header() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-20" dir="rtl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Hamburger Menu */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <Link href="/" className="flex items-center">
            <img 
              src={logoPath} 
              alt="پیستاط" 
              className="h-10 w-auto"
            />
          </Link>
        </div>

        {/* User Profile Icon */}
        <div className="flex items-center">
          <Link href="/profile" className="p-2 rounded-full hover:bg-gray-100">
            <User className="h-6 w-6 text-gray-600" />
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)}></div>
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">منو</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mt-6">
                {/* User Profile Section */}
                <div className="bg-gray-100 rounded-lg p-4 mb-6">
                  <div className="flex items-center mb-3">
                    <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium ml-3">
                      کا
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">کاربر مهمان</p>
                      <p className="text-sm text-gray-500">عضویت ساده</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500">پیشرفت</p>
                      <p className="font-medium text-gray-700">0%</p>
                    </div>
                    <div className="h-2 w-24 bg-gray-300 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Main Menu */}
                <div className="space-y-1 mb-6">
                  <h3 className="text-xs uppercase text-gray-500 font-medium mb-3">منوی اصلی</h3>
                  <Link 
                    href="/" 
                    className={`flex items-center p-3 rounded-lg transition-colors ${location === "/" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>خانه</span>
                  </Link>
                  <Link 
                    href="/courses" 
                    className={`flex items-center p-3 rounded-lg transition-colors ${location === "/courses" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>کارگاه‌های آموزشی</span>
                  </Link>
                  <Link 
                    href="/projects" 
                    className={`flex items-center p-3 rounded-lg transition-colors ${location === "/projects" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>وبینارها</span>
                  </Link>
                  <Link 
                    href="/library" 
                    className={`flex items-center p-3 rounded-lg transition-colors ${location === "/library" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>کتابخانه</span>
                  </Link>
                  <Link 
                    href="/magazine" 
                    className={`flex items-center p-3 rounded-lg transition-colors ${location === "/magazine" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>مجله</span>
                  </Link>
                </div>

                {/* Secondary Menu */}
                <div className="space-y-1">
                  <h3 className="text-xs uppercase text-gray-500 font-medium mb-3">حساب کاربری</h3>
                  <Link 
                    href="/profile" 
                    className={`flex items-center p-3 rounded-lg transition-colors ${location === "/profile" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>پروفایل</span>
                  </Link>
                  <Link 
                    href="/cart" 
                    className={`flex items-center p-3 rounded-lg transition-colors ${location === "/cart" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>سبد خرید</span>
                  </Link>
                  <Link 
                    href="/favorites" 
                    className={`flex items-center p-3 rounded-lg transition-colors ${location === "/favorites" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>علاقه‌مندی‌ها</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}