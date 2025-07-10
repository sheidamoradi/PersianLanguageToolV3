import { Link, useLocation } from "wouter";
import { User, Menu, X, Bell, Search, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import logoImage from "@assets/logo.png";

export default function Header() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const { user, isAuthenticated, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
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
              <img 
                src={logoImage} 
                alt="پیستاط" 
                className="h-12 w-auto hover:opacity-80 transition-opacity"
              />
            </div>
          </div>
        </div>

        {/* Right side icons */}
        <div className="flex items-center gap-2">
          {/* Search Icon */}
          <button 
            onClick={() => window.postMessage({ type: 'SHOW_SEARCH' }, '*')}
            className="p-2 rounded-full hover:bg-green-50 group transition-colors"
          >
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
          <button 
            onClick={() => window.postMessage({ type: 'SHOW_PROFILE' }, '*')}
            className="p-2 rounded-full hover:bg-green-50 group transition-colors"
          >
            <User className="h-6 w-6 text-gray-500 group-hover:text-green-600 transition-colors" />
          </button>
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
                  {isLoading ? (
                    <div className="animate-pulse">
                      <div className="flex items-center mb-3">
                        <div className="h-12 w-12 rounded-full bg-gray-300 ml-3"></div>
                        <div>
                          <div className="h-4 w-20 bg-gray-300 rounded mb-2"></div>
                          <div className="h-3 w-16 bg-gray-300 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ) : isAuthenticated && user ? (
                    <div>
                      <div className="flex items-center mb-3">
                        <div className="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center text-white font-medium ml-3">
                          {user.name ? user.name.charAt(0) : user.username?.charAt(0) || 'ک'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">{user.name || user.username}</p>
                          <p className="text-sm text-gray-500">
                            {user.role === 'admin' ? 'مدیر سیستم' : 'کاربر عادی'}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-gray-500">پیشرفت</p>
                          <p className="font-medium text-gray-700">75%</p>
                        </div>
                        <div className="h-2 w-24 bg-gray-300 rounded-full overflow-hidden">
                          <div className="h-full bg-green-600 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center mb-3">
                        <div className="h-12 w-12 rounded-full bg-gray-400 flex items-center justify-center text-white font-medium ml-3">
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
                          <div className="h-full bg-gray-400 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
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
                  
                  {/* User Actions */}
                  <div className="border-t pt-3 mt-3">
                    {isAuthenticated && user ? (
                      <div>
                        <h3 className="text-xs uppercase text-gray-500 font-medium mb-3">عملیات کاربری</h3>
                        
                        {/* Admin Link - Only for admin users */}
                        {user.role === 'admin' && (
                          <button 
                            onClick={() => {
                              setIsMenuOpen(false);
                              window.postMessage({ type: 'SHOW_ADMIN_PANEL' }, '*');
                            }}
                            className="flex items-center p-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-100 w-full text-right mb-2"
                          >
                            <span>پنل مدیریت</span>
                          </button>
                        )}
                        
                        <button 
                          onClick={() => {
                            setIsMenuOpen(false);
                            handleLogout();
                          }}
                          className="flex items-center p-3 rounded-lg transition-colors text-red-600 hover:bg-red-50 w-full text-right"
                        >
                          <LogOut className="h-4 w-4 ml-2" />
                          <span>خروج</span>
                        </button>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xs uppercase text-gray-500 font-medium mb-3">احراز هویت</h3>
                        <button 
                          onClick={() => {
                            setIsMenuOpen(false);
                            window.postMessage({ type: 'SWITCH_TAB', tab: 'profile' }, '*');
                          }}
                          className="flex items-center p-3 rounded-lg transition-colors text-green-600 hover:bg-green-50 w-full text-right"
                        >
                          <User className="h-4 w-4 ml-2" />
                          <span>ورود / ثبت نام</span>
                        </button>
                      </div>
                    )}
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