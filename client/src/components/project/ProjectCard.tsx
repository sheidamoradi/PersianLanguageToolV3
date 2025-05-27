import { Link } from "wouter";
import { type ProjectCardProps } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function ProjectCard({
  id,
  title,
  description,
  thumbnailUrl,
  type,
  dueDate,
  pages,
  isLocked
}: ProjectCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden relative" dir="rtl">
      {isLocked && (
        <div className="locked-overlay rounded-xl absolute inset-0 bg-neutral-500/70 flex items-center justify-center z-10">
          <div className="text-center px-4">
            <span className="material-icons text-white text-3xl mb-2">lock</span>
            <p className="text-white font-medium mb-2">محتوای ویژه</p>
            <Button className="bg-accent hover:bg-accent/90 text-white">دسترسی</Button>
          </div>
        </div>
      )}
      
      <img src={thumbnailUrl} alt={title} className="w-full h-36 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-neutral-600">{title}</h3>
          <Badge className={cn({
            "bg-secondary hover:bg-secondary/90 text-white": type === "project",
            "bg-neutral-300 hover:bg-neutral-300/90 text-white": type === "magazine"
          })}>
            {type === "project" ? "پروژه" : "مجله"}
          </Badge>
        </div>
        <p className="text-sm text-neutral-400 mb-3">{description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {type === "project" && dueDate && (
              <>
                <span className="material-icons text-sm text-neutral-400 ml-1">event</span>
                <span className="text-xs text-neutral-400">مهلت: {dueDate}</span>
              </>
            )}
            {type === "magazine" && pages && (
              <>
                <span className="material-icons text-sm text-neutral-400 ml-1">menu_book</span>
                <span className="text-xs text-neutral-400">{pages} صفحه</span>
              </>
            )}
          </div>
          <Link href={type === "project" ? `/projects/${id}` : `/documents/${id}`}>
            <Button 
              variant="default" 
              size="sm" 
              className={cn({
                "bg-secondary hover:bg-secondary/90 text-white": type === "project",
                "bg-neutral-300 hover:bg-neutral-300/90 text-white": type === "magazine"
              })}
            >
              {type === "project" ? "مشاهده" : "خواندن"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
