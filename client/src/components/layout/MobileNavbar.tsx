import { Link, useLocation } from "wouter";

export default function MobileNavbar() {
  const [location] = useLocation();
  
  const isActive = (path: string) => location === path;
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-4 py-2 z-20" dir="rtl">
      <div className="flex justify-around">
        <Link href="/" className={`flex flex-col items-center ${isActive('/') ? 'text-primary' : 'text-neutral-300'}`}>
          <span className="material-icons">home</span>
          <span className="text-xs mt-1">خانه</span>
        </Link>
        <Link href="/courses" className={`flex flex-col items-center ${isActive('/courses') ? 'text-primary' : 'text-neutral-300'}`}>
          <span className="material-icons">menu_book</span>
          <span className="text-xs mt-1">کارگاه‌ها</span>
        </Link>
        <Link href="/projects" className={`flex flex-col items-center ${isActive('/projects') ? 'text-primary' : 'text-neutral-300'}`}>
          <span className="material-icons">assignment</span>
          <span className="text-xs mt-1">وبینارها</span>
        </Link>
        <Link href="/library" className={`flex flex-col items-center ${isActive('/library') ? 'text-primary' : 'text-neutral-300'}`}>
          <span className="material-icons">library_books</span>
          <span className="text-xs mt-1">کتابخانه</span>
        </Link>
        <Link href="/magazine" className={`flex flex-col items-center ${isActive('/magazine') ? 'text-primary' : 'text-neutral-300'}`}>
          <span className="material-icons">auto_stories</span>
          <span className="text-xs mt-1">رویش سبز</span>
        </Link>
        <Link href="/admin" className={`flex flex-col items-center ${isActive('/admin') ? 'text-primary' : 'text-neutral-300'}`}>
          <span className="material-icons">dashboard</span>
          <span className="text-xs mt-1">مدیریت</span>
        </Link>
      </div>
    </nav>
  );
}
