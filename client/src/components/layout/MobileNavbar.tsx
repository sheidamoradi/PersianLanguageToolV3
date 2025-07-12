import { Link, useLocation } from "wouter";
import { Home, Grid3X3, User, ShoppingCart, Heart, Info } from "lucide-react";

export default function MobileNavbar() {
  const [location] = useLocation();
  
  const isActive = (path: string) => location === path;
  const isCategoryActive = () => {
    return ['/courses', '/projects', '/library', '/magazine', '/categories'].includes(location);
  };
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-2 py-3 z-20" dir="rtl">
      <div className="flex justify-around items-center">
        {/* خانه */}
        <Link href="/" className={`relative flex flex-col items-center p-2 transition-all duration-200 ${isActive('/') ? 'text-primary' : 'text-neutral-400'}`}>
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">خانه</span>
          {isActive('/') && (
            <div className="absolute -top-1 w-2 h-2 bg-primary rounded-full"></div>
          )}
        </Link>

        {/* دسته‌بندی‌ها (۴ خانه) */}
        <Link href="/categories" className={`relative flex flex-col items-center p-2 transition-all duration-200 ${isCategoryActive() ? 'text-primary' : 'text-neutral-400'}`}>
          <Grid3X3 className="h-5 w-5" />
          <span className="text-xs mt-1">دسته‌بندی</span>
          {isCategoryActive() && (
            <div className="absolute -top-1 w-2 h-2 bg-primary rounded-full"></div>
          )}
        </Link>

        {/* درباره ما */}
        <button 
          onClick={() => window.postMessage({ type: 'SWITCH_TAB', tab: 'about-us' }, '*')}
          className={`relative flex flex-col items-center p-2 transition-all duration-200 ${isActive('/about-us') ? 'text-primary' : 'text-neutral-400'}`}
        >
          <Info className="h-5 w-5" />
          <span className="text-xs mt-1">درباره ما</span>
          {isActive('/about-us') && (
            <div className="absolute -top-1 w-2 h-2 bg-primary rounded-full"></div>
          )}
        </button>

        {/* سبد خرید */}
        <Link href="/cart" className={`relative flex flex-col items-center p-2 transition-all duration-200 ${isActive('/cart') ? 'text-primary' : 'text-neutral-400'}`}>
          <ShoppingCart className="h-5 w-5" />
          <span className="text-xs mt-1">سبد خرید</span>
          {isActive('/cart') && (
            <div className="absolute -top-1 w-2 h-2 bg-primary rounded-full"></div>
          )}
          {/* نشانگر تعداد آیتم‌ها */}
          <div className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            3
          </div>
        </Link>

        {/* علاقه‌مندی‌ها */}
        <Link href="/favorites" className={`relative flex flex-col items-center p-2 transition-all duration-200 ${isActive('/favorites') ? 'text-primary' : 'text-neutral-400'}`}>
          <Heart className="h-5 w-5" />
          <span className="text-xs mt-1">علاقه‌مندی</span>
          {isActive('/favorites') && (
            <div className="absolute -top-1 w-2 h-2 bg-primary rounded-full"></div>
          )}
        </Link>

        {/* پروفایل */}
        <Link href="/profile" className={`relative flex flex-col items-center p-2 transition-all duration-200 ${isActive('/profile') ? 'text-primary' : 'text-neutral-400'}`}>
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">پروفایل</span>
          {isActive('/profile') && (
            <div className="absolute -top-1 w-2 h-2 bg-primary rounded-full"></div>
          )}
        </Link>
      </div>
    </nav>
  );
}
