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
              {activeTab === "courses" && <CoursesTab />}
              {activeTab === "projects" && <ProjectsTab />}
              {activeTab === "documents" && <DocumentsTab />}
              {activeTab === "slides" && <SlidesTab />}
              {activeTab === "magazines" && <MagazinesTab />}
              {activeTab === "media" && <MediaTab />}
              {activeTab === "posts" && <PostsTab />}
              {activeTab === "users" && <UsersTab />}
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
  const [uploadedFiles, setUploadedFiles] = useState([
    { id: 1, name: 'course-cover.jpg', url: '/uploads/course-cover.jpg', type: 'image', size: '245 KB', uploadedAt: '1403/10/15' },
    { id: 2, name: 'slider-bg.png', url: '/uploads/slider-bg.png', type: 'image', size: '512 KB', uploadedAt: '1403/10/14' },
    { id: 3, name: 'document-sample.pdf', url: '/uploads/document-sample.pdf', type: 'document', size: '1.2 MB', uploadedAt: '1403/10/13' },
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [showCopyDialog, setShowCopyDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setIsUploading(true);
      
      try {
        const formData = new FormData();
        Array.from(files).forEach(file => {
          formData.append('files', file);
        });

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          setUploadedFiles(prev => [...prev, ...result.files]);
        } else {
          console.error('Upload failed');
        }
      } catch (error) {
        console.error('Upload error:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  const allFiles = uploadedFiles;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">کتابخانه رسانه</h2>
            <div className="flex items-center gap-3">
              <label className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-2">
                <Upload className="h-4 w-4" />
                {isUploading ? 'در حال آپلود...' : 'آپلود فایل'}
                <input
                  type="file"
                  multiple
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {allFiles && allFiles.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {allFiles.map(file => (
                <div key={file.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    {file.type === 'image' ? (
                      <img 
                        src={file.url} 
                        alt={file.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling!.classList.remove('hidden');
                        }}
                      />
                    ) : (
                      <File className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-medium truncate" title={file.name}>{file.name}</h4>
                    <p className="text-xs text-gray-500">{file.size}</p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setSelectedFile(file);
                          setShowCopyDialog(true);
                        }}
                        className="flex-1 px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                      >
                        کپی لینک
                      </button>
                      <button className="p-1 text-red-500 hover:bg-red-50 rounded">
                        <Trash className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Upload className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ فایلی آپلود نشده</h3>
              <p className="text-gray-600">برای شروع، فایل‌های خود را آپلود کنید</p>
            </div>
          )}
        </div>
      </div>

      {/* Copy Link Dialog */}
      {showCopyDialog && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">کپی لینک فایل</h3>
              <button 
                onClick={() => setShowCopyDialog(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  لینک فایل:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={selectedFile.url}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(selectedFile.url)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    <Copy className="h-4 w-4" />
                    کپی
                  </button>
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                <p>از این لینک برای اضافه کردن تصویر به اسلایدها، نوشته‌ها یا هر جای دیگری استفاده کنید.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CoursesTab() {
  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  if (isLoading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">دوره‌ها</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" />
            افزودن دوره جدید
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {courses && courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(course => (
              <div key={course.id} className="border rounded-lg p-4">
                <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                  <Video className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="font-medium mb-1">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{course.category}</span>
                  <span>پیشرفت: {course.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Video className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ دوره‌ای یافت نشد</h3>
            <p className="text-gray-600">برای شروع، دوره جدیدی اضافه کنید</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectsTab() {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  if (isLoading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">پروژه‌ها</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" />
            افزودن پروژه جدید
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(project => (
              <div key={project.id} className="border rounded-lg p-4">
                <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                  <Folder className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="font-medium mb-1">{project.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{project.category}</span>
                  <span>سطح: {project.difficulty}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Folder className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ پروژه‌ای یافت نشد</h3>
            <p className="text-gray-600">برای شروع، پروژه جدیدی اضافه کنید</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SlidesTab() {
  const { data: slides, isLoading } = useQuery<Slide[]>({
    queryKey: ['/api/slides'],
  });

  if (isLoading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">اسلایدهای صفحه اصلی</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" />
            افزودن اسلاید جدید
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {slides && slides.length > 0 ? (
          <div className="space-y-4">
            {slides.map(slide => (
              <div key={slide.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                    {slide.imageUrl ? (
                      <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover rounded" />
                    ) : (
                      <Image className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{slide.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{slide.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>ترتیب: {slide.order}</span>
                      <span className={slide.isActive ? 'text-green-600' : 'text-gray-400'}>
                        {slide.isActive ? 'فعال' : 'غیرفعال'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
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
            <Image className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ اسلایدی یافت نشد</h3>
            <p className="text-gray-600">برای شروع، اسلاید جدیدی اضافه کنید</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MagazinesTab() {
  const { data: magazines, isLoading } = useQuery<Magazine[]>({
    queryKey: ['/api/magazines'],
  });

  if (isLoading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">مجله‌ها</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" />
            افزودن مجله جدید
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {magazines && magazines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {magazines.map(magazine => (
              <div key={magazine.id} className="border rounded-lg p-4">
                <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                  <Calendar className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="font-medium mb-1">{magazine.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{magazine.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>شماره {magazine.issueNumber}</span>
                  <span>{magazine.year}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ مجله‌ای یافت نشد</h3>
            <p className="text-gray-600">برای شروع، مجله جدیدی اضافه کنید</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PostsTab() {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">نوشته‌ها</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" />
            افزودن نوشته جدید
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="text-center py-12">
          <Type className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">مدیریت نوشته‌ها</h3>
          <p className="text-gray-600">این بخش در حال توسعه است</p>
        </div>
      </div>
    </div>
  );
}

function UsersTab() {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">مدیریت کاربران</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" />
            افزودن کاربر جدید
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="text-center py-12">
          <Lock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">مدیریت کاربران</h3>
          <p className="text-gray-600">این بخش در حال توسعه است</p>
        </div>
      </div>
    </div>
  );
}