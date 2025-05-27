import { Link, useLocation } from "wouter";
import { User } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-20" dir="rtl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
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
            دوره‌ها
          </Link>
          <Link href="/projects" className={location === "/projects" ? "text-primary font-medium" : "text-neutral-400 hover:text-primary transition-colors font-medium"}>
            پروژه‌ها
          </Link>
          <Link href="/library" className={location === "/library" ? "text-primary font-medium" : "text-neutral-400 hover:text-primary transition-colors font-medium"}>
            کتابخانه
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
