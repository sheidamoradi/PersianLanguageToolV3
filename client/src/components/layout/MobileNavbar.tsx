import { Link, useLocation } from "wouter";

export default function MobileNavbar() {
  const [location] = useLocation();
  
  const isActive = (path: string) => location === path;
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-2 py-3 z-20" dir="rtl">
      <div className="flex justify-around">
        <Link href="/" className={`relative flex flex-col items-center p-2 transition-all duration-200 ${isActive('/') ? 'text-primary' : 'text-neutral-400'}`}>
          <span className="material-icons text-2xl">home</span>
          <span className={`absolute -top-8 bg-black text-white text-xs px-2 py-1 rounded transition-opacity duration-200 ${isActive('/') ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
            خانه
          </span>
        </Link>
        <Link href="/courses" className={`relative flex flex-col items-center p-2 transition-all duration-200 ${isActive('/courses') ? 'text-primary' : 'text-neutral-400'}`}>
          <span className="material-icons text-2xl">menu_book</span>
          <span className={`absolute -top-8 bg-black text-white text-xs px-2 py-1 rounded transition-opacity duration-200 ${isActive('/courses') ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
            کارگاه‌ها
          </span>
        </Link>
        <Link href="/projects" className={`relative flex flex-col items-center p-2 transition-all duration-200 ${isActive('/projects') ? 'text-primary' : 'text-neutral-400'}`}>
          <span className="material-icons text-2xl">assignment</span>
          <span className={`absolute -top-8 bg-black text-white text-xs px-2 py-1 rounded transition-opacity duration-200 ${isActive('/projects') ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
            وبینارها
          </span>
        </Link>
        <Link href="/library" className={`relative flex flex-col items-center p-2 transition-all duration-200 ${isActive('/library') ? 'text-primary' : 'text-neutral-400'}`}>
          <span className="material-icons text-2xl">library_books</span>
          <span className={`absolute -top-8 bg-black text-white text-xs px-2 py-1 rounded transition-opacity duration-200 ${isActive('/library') ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
            کتابخانه
          </span>
        </Link>
        <Link href="/magazine" className={`relative flex flex-col items-center p-2 transition-all duration-200 ${isActive('/magazine') ? 'text-primary' : 'text-neutral-400'}`}>
          <span className="material-icons text-2xl">auto_stories</span>
          <span className={`absolute -top-8 bg-black text-white text-xs px-2 py-1 rounded transition-opacity duration-200 ${isActive('/magazine') ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
            رویش سبز
          </span>
        </Link>
        <Link href="/admin" className={`relative flex flex-col items-center p-2 transition-all duration-200 ${isActive('/admin') ? 'text-primary' : 'text-neutral-400'}`}>
          <span className="material-icons text-2xl">dashboard</span>
          <span className={`absolute -top-8 bg-black text-white text-xs px-2 py-1 rounded transition-opacity duration-200 ${isActive('/admin') ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
            مدیریت
          </span>
        </Link>
      </div>
    </nav>
  );
}
