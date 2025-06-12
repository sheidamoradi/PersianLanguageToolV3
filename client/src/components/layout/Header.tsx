import { Link, useLocation } from "wouter";
import { User, Menu, X, Bell, Search } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-20" dir="rtl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Hamburger Menu */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-green-50 group transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6 text-gray-500 group-hover:text-green-600 transition-colors" /> : <Menu className="h-6 w-6 text-gray-500 group-hover:text-green-600 transition-colors" />}
          </button>
          <div 
            onClick={() => {
              const newCount = logoClickCount + 1;
              setLogoClickCount(newCount);
              if (newCount >= 5) {
                // Open admin panel by posting message to parent
                window.postMessage({ type: 'OPEN_ADMIN' }, '*');
                setLogoClickCount(0);
              }
              // Reset count after 3 seconds
              setTimeout(() => setLogoClickCount(0), 3000);
            }}
            className="flex items-center cursor-pointer"
          >
            <div className="flex items-center">
              <svg width="48" height="48" viewBox="0 0 200 200" className="hover:opacity-80 transition-opacity">
                {/* Main dark green leaf */}
                <path d="M45 70 C45 45, 65 25, 90 25 C100 25, 108 30, 113 38 C118 30, 126 25, 136 25 C161 25, 181 45, 181 70 C181 95, 161 115, 136 115 C126 115, 118 110, 113 102 C108 110, 100 115, 90 115 C65 115, 45 95, 45 70 Z" 
                      fill="#578057"/>
                {/* Light green accent leaf */}
                <path d="M120 65 C120 50, 130 40, 145 40 C155 40, 163 45, 168 53 C173 45, 181 40, 191 40 C206 40, 216 50, 216 65 C216 80, 206 90, 191 90 C181 90, 173 85, 168 77 C163 85, 155 90, 145 90 C130 90, 120 80, 120 65 Z" 
                      fill="#9CB891"/>
                {/* Text "Pistat" */}
                <text x="100" y="140" 
                      textAnchor="middle" 
                      fontFamily="Arial, sans-serif" 
                      fontSize="16" 
                      fontWeight="bold" 
                      fill="#6B7280">Pistat</text>
                {/* Green underline */}
                <line x1="65" y1="150" x2="135" y2="150" stroke="#9CB891" strokeWidth="2"/>
                {/* Persian text "پیستاط" */}
                <text x="100" y="170" 
                      textAnchor="middle" 
                      fontFamily="Arial, sans-serif" 
                      fontSize="14" 
                      fill="#6B7280">پیستاط</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Right side icons */}
        <div className="flex items-center gap-2">
          {/* Search Icon */}
          <button className="p-2 rounded-full hover:bg-green-50 group transition-colors">
            <Search className="h-6 w-6 text-gray-500 group-hover:text-green-600 transition-colors" />
          </button>
          
          {/* Notifications Icon */}
          <button className="p-2 rounded-full hover:bg-green-50 group transition-colors relative">
            <Bell className="h-6 w-6 text-gray-500 group-hover:text-green-600 transition-colors" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
              3
            </span>
          </button>
          
          {/* User Profile Icon */}
          <Link href="/profile" className="p-2 rounded-full hover:bg-green-50 group transition-colors">
            <User className="h-6 w-6 text-gray-500 group-hover:text-green-600 transition-colors" />
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
                  
                  {/* Admin Link */}
                  <div className="border-t pt-3 mt-3">
                    <h3 className="text-xs uppercase text-gray-500 font-medium mb-3">مدیریت</h3>
                    <button 
                      onClick={() => {
                        setIsMenuOpen(false);
                        // Function to switch to admin tab would be passed as prop
                        // For now using a simple approach
                        if (window.location.pathname !== '/admin') {
                          window.location.hash = 'admin';
                        }
                      }}
                      className="flex items-center p-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-100 w-full text-right"
                    >
                      <span>پنل مدیریت</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}