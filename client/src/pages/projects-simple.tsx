import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { type Project } from "@shared/schema";
import ProjectCard from "@/components/project/ProjectCard";
import { AuthGuard } from "@/components/AuthGuard";

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  interface Project {
    id: number;
    title: string;
    description?: string;
    type?: string;
    dueDate?: string;
    thumbnailUrl?: string;
    pages?: number;
    isLocked?: boolean;
  }

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const filteredProjects = projects.filter((project: Project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && project.type === activeTab;
  });

  const webinars = filteredProjects.filter((p: Project) => p.type === "webinar");

  return (
    <AuthGuard>
      <div className="p-4 pb-24" dir="rtl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">پروژه‌ها و وبینارها</h1>
        
        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="جستجو در پروژه‌ها..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 space-x-reverse bg-gray-100 p-1 rounded-lg mb-4">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "all" 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            همه
          </button>
          <button
            onClick={() => setActiveTab("project")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "project" 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            پروژه‌ها
          </button>
          <button
            onClick={() => setActiveTab("webinar")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "webinar" 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            وبینارها
          </button>
          <button
            onClick={() => setActiveTab("magazine")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "magazine" 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            مجله‌ها
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
              <div className="w-full h-36 bg-gray-200"></div>
              <div className="p-4">
                <div className="w-3/4 h-6 bg-gray-200 rounded mb-2"></div>
                <div className="w-full h-4 bg-gray-200 rounded mb-3"></div>
                <div className="flex justify-between items-center">
                  <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
                  <div className="w-20 h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))
        ) : filteredProjects.length > 0 ? (
          filteredProjects.map((project: Project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              title={project.title}
              description={project.description || ''}
              thumbnailUrl={project.thumbnailUrl || ''}
              type={project.type as "project" | "magazine"}
              dueDate={project.dueDate || ''}
              pages={project.pages || 0}
              isLocked={project.isLocked || false}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-neutral-400">هیچ پروژه‌ای با معیارهای شما یافت نشد.</p>
            <button 
              className="text-blue-600 hover:underline mt-2"
              onClick={() => setSearchTerm("")}
            >
              پاک کردن جستجو
            </button>
          </div>
        )}
      </div>
      </div>
    </AuthGuard>
  );
}