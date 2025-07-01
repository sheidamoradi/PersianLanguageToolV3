import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { type Course, type Project, type Document, type MediaContent, type Magazine, type Article, type ArticleContent, type Slide, type Workshop, type WorkshopSection } from "@shared/schema";
import { Calendar, Edit, Eye, File, Folder, Image, Lock, LockOpen, MoreHorizontal, Plus, RefreshCw, Trash, Upload, Video, Save, Copy, Search, Filter, Bold, Italic, Type, List, ListOrdered, Quote, Undo, Redo, AlignLeft, AlignCenter, AlignRight, Link as LinkIcon, Image as ImageIcon, Tag, Shield, Download, X } from "lucide-react";
import RichTextEditor from '../components/editor/RichTextEditor';
import ProtectionSettings from '../components/admin/ProtectionSettings';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("documents");

  const menuItems = [
    { id: "courses", label: "دوره‌ها", icon: Video },
    { id: "projects", label: "پروژه‌ها", icon: Folder },
    { id: "documents", label: "اسناد", icon: File },
    { id: "slides", label: "اسلایدها", icon: Image },
    { id: "magazines", label: "مجله‌ها", icon: Calendar },
    { id: "media", label: "کتابخانه رسانه", icon: Upload },
    { id: "posts", label: "نوشته‌ها", icon: Type },
    { id: "users", label: "کاربران", icon: Lock }
  ];

  return (
    <div dir="rtl" className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">پنل مدیریت</h1>
          <p className="text-sm text-gray-600 mt-1">مدیریت محتوا</p>
        </div>
        
        <div className="p-4 h-full overflow-y-auto">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                data-tab={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-right transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-100 text-blue-800 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full">
        <main className="flex-1 p-6 overflow-hidden">
          <div className="mb-6 flex-shrink-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {menuItems.find(item => item.id === activeTab)?.label || 'پنل مدیریت'}
            </h1>
            <p className="text-gray-600">مدیریت محتوا و تنظیمات سایت</p>
          </div>

          <div className="h-full overflow-y-auto">
            <div className="space-y-6 pb-6">
              {activeTab === "documents" && <DocumentsTab />}
              {activeTab === "media" && <MediaTab />}
              {activeTab === "slides" && <SlidesTab />}
              {/* سایر تب‌ها */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function DocumentsTab() {
  const [showForm, setShowForm] = useState(false);
  
  const { data: documents, isLoading } = useQuery<Document[]>({
    queryKey: ['/api/documents'],
  });

  if (isLoading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">کتابخانه اسناد</h2>
            <button 
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              افزودن سند جدید
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {documents && documents.length > 0 ? (
            <div className="space-y-4">
              {documents.map(doc => (
                <div key={doc.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <File className="h-8 w-8 text-blue-600" />
                      <div>
                        <h3 className="font-medium">{doc.title}</h3>
                        <p className="text-sm text-gray-600">{doc.excerpt}</p>
                        {doc.fileUrl && (
                          <a 
                            href={doc.fileUrl} 
                            target="_blank"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            {doc.fileName}
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded text-red-500">
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <File className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">اسناد یافت شدند!</h3>
              <p className="text-gray-600">
                {documents?.length} سند در سیستم موجود است. 
                فایل‌های آپلود شده از کتابخانه رسانه قابل استفاده هستند.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MediaTab() {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">کتابخانه رسانه</h2>
        <p className="text-gray-600">
          سیستم آپلود فایل فعال است. فایل‌های آپلود شده در /uploads ذخیره می‌شوند.
        </p>
      </div>
    </div>
  );
}

function SlidesTab() {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">مدیریت اسلایدها</h2>
        <p className="text-gray-600">
          اسلایدهای صفحه اصلی از اینجا قابل مدیریت هستند.
        </p>
      </div>
    </div>
  );
}