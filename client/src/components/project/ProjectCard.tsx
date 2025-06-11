import { Link } from "wouter";
import { type ProjectCardProps } from "@/lib/types";

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
        <div className="locked-overlay rounded-xl absolute inset-0 bg-gray-500/70 flex items-center justify-center z-10">
          <div className="text-center">
            <span className="text-white text-3xl mb-2">🔒</span>
            <p className="text-white font-medium mb-2">محتوای ویژه</p>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">دسترسی</button>
          </div>
        </div>
      )}
      
      <img src={thumbnailUrl} alt={title} className="w-full h-36 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-600">{title}</h3>
          <span className={`px-2 py-1 text-white text-xs rounded-full ${
            type === "project" ? "bg-blue-500" : "bg-gray-400"
          }`}>
            {type === "project" ? "پروژه" : "مجله"}
          </span>
        </div>
        <p className="text-sm text-gray-400 mb-3">{description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {type === "project" && dueDate && (
              <span className="text-xs text-gray-400">مهلت: {dueDate}</span>
            )}
            {type === "magazine" && pages && (
              <span className="text-xs text-gray-400">{pages} صفحه</span>
            )}
          </div>
          <Link href={type === "project" ? `/projects/${id}` : `/documents/${id}`}>
            <button className={`px-3 py-1 text-white text-sm rounded-md transition-colors ${
              type === "project" ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 hover:bg-gray-500"
            }`}>
              مشاهده
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}