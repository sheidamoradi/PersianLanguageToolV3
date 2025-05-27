import { Link, useLocation } from "wouter";
import { type UserProfile, type NavLink } from "@/lib/types";
import { useMemo } from "react";

interface SidebarProps {
  user: UserProfile;
}

export default function Sidebar({ user }: SidebarProps) {
  const [location] = useLocation();
  
  const mainNavLinks: NavLink[] = useMemo(() => [
    { 
      label: "خانه", 
      path: "/", 
      icon: "home", 
      active: location === "/" 
    },
    { 
      label: "دوره‌های من", 
      path: "/courses", 
      icon: "menu_book", 
      active: location === "/courses" 
    },
    { 
      label: "پروژه‌ها", 
      path: "/projects", 
      icon: "assignment", 
      active: location === "/projects" 
    },
    { 
      label: "کتابخانه", 
      path: "/library", 
      icon: "library_books", 
      active: location === "/library" 
    },
    { 
      label: "پنل مدیریت", 
      path: "/admin", 
      icon: "dashboard", 
      active: location === "/admin" 
    },
  ], [location]);
  
  const accountNavLinks: NavLink[] = useMemo(() => [
    { 
      label: "پروفایل", 
      path: "/profile", 
      icon: "person", 
      active: location === "/profile" 
    },
    { 
      label: "تنظیمات", 
      path: "/settings", 
      icon: "settings", 
      active: location === "/settings" 
    },
    { 
      label: "راهنما", 
      path: "/help", 
      icon: "help", 
      active: location === "/help" 
    },
  ], [location]);

  return (
    <aside className="hidden md:block sidebar w-64 bg-white border-l border-neutral-200 overflow-y-auto" dir="rtl">
      <div className="p-4">
        <div className="bg-neutral-100 rounded-lg p-3 mb-6">
          <div className="flex items-center mb-2">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-medium ml-3">
              {user.name.split(' ').map(name => name[0]).join('')}
            </div>
            <div>
              <p className="font-medium text-neutral-500">{user.name}</p>
              <p className="text-sm text-neutral-300">عضویت {user.membershipType}</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-neutral-300">پیشرفت</p>
              <p className="font-medium text-neutral-500">{user.progress}%</p>
            </div>
            <div className="h-2 w-24 bg-neutral-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${user.progress}%` }}></div>
            </div>
          </div>
        </div>
        
        <nav>
          <p className="text-xs uppercase text-neutral-300 font-medium mb-2">منوی اصلی</p>
          <ul className="space-y-1 mb-6">
            <li>
              <Link href="/" className="flex items-center p-2 rounded-lg text-neutral-400 hover:bg-neutral-100">
                <span className="material-icons ml-3">home</span>
                <span>خانه</span>
              </Link>
            </li>
            <li>
              <Link href="/courses" className="flex items-center p-2 rounded-lg text-neutral-400 hover:bg-neutral-100">
                <span className="material-icons ml-3">menu_book</span>
                <span>کارگاه‌های آموزشی</span>
              </Link>
            </li>
            <li>
              <Link href="/projects" className="flex items-center p-2 rounded-lg text-neutral-400 hover:bg-neutral-100">
                <span className="material-icons ml-3">assignment</span>
                <span>وبینارها</span>
              </Link>
            </li>
            <li>
              <Link href="/library" className="flex items-center p-2 rounded-lg text-neutral-400 hover:bg-neutral-100">
                <span className="material-icons ml-3">library_books</span>
                <span>کتابخانه</span>
              </Link>
            </li>
            <li>
              <Link href="/magazine" className="flex items-center p-2 rounded-lg text-neutral-400 hover:bg-neutral-100">
                <span className="material-icons ml-3">auto_stories</span>
                <span>فصلنامه رویش سبز</span>
              </Link>
            </li>
          </ul>
          
          <p className="text-xs uppercase text-neutral-300 font-medium mb-2">حساب کاربری</p>
          <ul className="space-y-1">
            <li>
              <Link href="/admin" className="flex items-center p-2 rounded-lg text-neutral-400 hover:bg-neutral-100">
                <span className="material-icons ml-3">dashboard</span>
                <span>پنل مدیریت</span>
              </Link>
            </li>
            <li>
              <Link href="/profile" className="flex items-center p-2 rounded-lg text-neutral-400 hover:bg-neutral-100">
                <span className="material-icons ml-3">person</span>
                <span>پروفایل</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
