import { Link } from "wouter";
import { type CourseCardProps } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
            <Badge className="bg-accent hover:bg-accent/90 text-white">{progress}%</Badge>
          )}
          {isNew && (
            <Badge className="bg-green-500 hover:bg-green-600 text-white">جدید</Badge>
          )}
          {isPopular && (
            <Badge className="bg-amber-500 hover:bg-amber-600 text-white">محبوب</Badge>
          )}
          {level && progress === 0 && !isNew && !isPopular && (
            <Badge 
              className={(level === 'Beginner' ? 'bg-primary' : 'bg-secondary') + ' hover:bg-opacity-90 text-white'}
            >
              {level === 'Beginner' ? 'مبتدی' : level === 'Intermediate' ? 'متوسط' : 'پیشرفته'}
            </Badge>
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
            <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90 text-white">
              {progress > 0 ? 'ادامه' : 'ثبت‌نام'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
