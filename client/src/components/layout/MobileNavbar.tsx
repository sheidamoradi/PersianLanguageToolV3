import { Link, useLocation } from "wouter";
import { Home, Grid3X3, User } from "lucide-react";

export default function MobileNavbar() {
  const [location] = useLocation();
  
  const isActive = (path: string) => location === path;
  const isCategoryActive = () => {
    return ['/courses', '/projects', '/library', '/magazine', '/categories'].includes(location);
  };
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-4 py-3 z-20" dir="rtl">
      <div className="flex justify-around items-center">
        {/* خانه */}
        <Link href="/" className={`relative flex flex-col items-center p-3 transition-all duration-200 ${isActive('/') ? 'text-primary' : 'text-neutral-400'}`}>
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">خانه</span>
          {isActive('/') && (
            <div className="absolute -top-1 w-2 h-2 bg-primary rounded-full"></div>
          )}
        </Link>

        {/* دسته‌بندی‌ها (۴ خانه) */}
        <Link href="/categories" className={`relative flex flex-col items-center p-3 transition-all duration-200 ${isCategoryActive() ? 'text-primary' : 'text-neutral-400'}`}>
          <Grid3X3 className="h-6 w-6" />
          <span className="text-xs mt-1">دسته‌ها</span>
          {isCategoryActive() && (
            <div className="absolute -top-1 w-2 h-2 bg-primary rounded-full"></div>
          )}
        </Link>

        {/* پروفایل */}
        <Link href="/profile" className={`relative flex flex-col items-center p-3 transition-all duration-200 ${isActive('/profile') ? 'text-primary' : 'text-neutral-400'}`}>
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">پروفایل</span>
          {isActive('/profile') && (
            <div className="absolute -top-1 w-2 h-2 bg-primary rounded-full"></div>
          )}
        </Link>
      </div>
    </nav>
  );
}
