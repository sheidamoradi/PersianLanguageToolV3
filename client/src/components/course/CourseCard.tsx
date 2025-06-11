import { Link } from "wouter";
import { type CourseCardProps } from "@/lib/types";

export default function CourseCard({
  id,
  title,
  description,
  thumbnailUrl,
  progress,
  totalModules,
  completedModules,
  isNew,
  isPopular,
  level
}: CourseCardProps) {
  const remainingModules = totalModules - completedModules;
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden" dir="rtl">
      <img src={thumbnailUrl} alt={title} className="w-full h-36 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-neutral-600">{title}</h3>
          
          {progress > 0 && (
            <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">{progress}%</span>
          )}
          {isNew && (
            <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">جدید</span>
          )}
          {isPopular && (
            <span className="px-2 py-1 bg-amber-500 text-white text-xs rounded-full">محبوب</span>
          )}
          {level && progress === 0 && !isNew && !isPopular && (
            <span className={`px-2 py-1 text-white text-xs rounded-full ${level === 'Beginner' ? 'bg-blue-500' : 'bg-gray-500'}`}>
              {level === 'Beginner' ? 'مبتدی' : level === 'Intermediate' ? 'متوسط' : 'پیشرفته'}
            </span>
          )}
        </div>
        <p className="text-sm text-neutral-400 mb-3">{description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="material-icons text-sm text-neutral-400 ml-1">schedule</span>
            <span className="text-xs text-neutral-400">
              {progress > 0 ? `${remainingModules} ماژول باقیمانده` : `${totalModules} ماژول`}
            </span>
          </div>
          <Link href={progress > 0 ? `/courses/${id}/continue` : `/courses/${id}`}>
            <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors">
              {progress > 0 ? 'ادامه' : 'ثبت‌نام'}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
