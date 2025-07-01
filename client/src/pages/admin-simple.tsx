import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { type Course, type Project, type Document, type MediaContent, type Magazine, type Article, type ArticleContent, type Slide, type Workshop, type WorkshopSection } from "@shared/schema";
import { Calendar, Edit, Eye, File, Folder, Image, Lock, LockOpen, MoreHorizontal, Plus, RefreshCw, Trash, Upload, Video, Save, Copy, Search, Filter, Bold, Italic, Type, List, ListOrdered, Quote, Undo, Redo, AlignLeft, AlignCenter, AlignRight, Link as LinkIcon, Image as ImageIcon, Tag, Shield, Download, X } from "lucide-react";
import RichTextEditor from '../components/editor/RichTextEditor';
import ProtectionSettings from '../components/admin/ProtectionSettings';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("courses");

  const menuItems = [
    { id: "courses", label: "دوره‌ها", icon: Video },
    { id: "projects", label: "پروژه‌ها", icon: Folder },
    { id: "documents", label: "اسناد", icon: File },
    { id: "slides", label: "اسلایدها", icon: Image },
    { id: "magazines", label: "مجله‌ها", icon: Calendar },
    { id: "posts", label: "نوشته‌ها", icon: Type },
    { id: "users", label: "کاربران", icon: Lock }
  ];

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden" dir="rtl">

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg h-full flex-shrink-0">
        <div className="p-4 border-b bg-blue-600 text-white">
          <h2 className="text-xl font-bold">پنل مدیریت</h2>
        </div>
        
        <div className="p-4 h-full overflow-y-auto">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
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

        {/* Page content */}
        <main className="flex-1 p-6 overflow-hidden">
          <div className="mb-6 flex-shrink-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {menuItems.find(item => item.id === activeTab)?.label || 'پنل مدیریت'}
            </h1>
            <p className="text-gray-600">مدیریت محتوا و تنظیمات سایت</p>
          </div>

          {/* Content */}
          <div className="h-full overflow-y-auto">
            <div className="space-y-6 pb-6">
              {activeTab === "courses" && <CoursesTab />}
              {activeTab === "projects" && <ProjectsTab />}
              {activeTab === "documents" && <DocumentsTab />}
              {activeTab === "slides" && <SlidesTab />}
              {activeTab === "magazines" && <MagazinesTab />}
              {activeTab === "posts" && <PostsTab />}
              {activeTab === "users" && <UsersTab />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function CoursesTab() {
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [courseFormData, setCourseFormData] = useState({
    title: '',
    description: '',
    thumbnailUrl: '',
    category: '',
    level: '',
    accessLevel: 'free',
    price: 0,
    // Protection settings
    allowDownload: true,
    allowScreenshot: true,
    allowCopy: true,
    allowPrint: true,
    watermarkText: '',
    protectionLevel: 'none' as 'none' | 'basic' | 'strict'
  });

  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  const queryClient = useQueryClient();

  const updateProtectionMutation = useMutation({
    mutationFn: async ({ courseId, protectionField, value }: { courseId: number, protectionField: string, value: boolean }) => {
      return await apiRequest(`/api/courses/${courseId}/protection`, {
        method: 'PATCH',
        body: JSON.stringify({ [protectionField]: value })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
    },
  });

  const handleProtectionChange = (settings: any) => {
    setCourseFormData(prev => ({
      ...prev,
      ...settings
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Course Form */}
      {showForm && (
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingCourse ? 'ویرایش دوره' : 'افزودن دوره جدید'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان دوره *
                </label>
                <input
                  type="text"
                  value={courseFormData.title}
                  onChange={(e) => setCourseFormData({...courseFormData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="عنوان دوره آموزشی..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  دسته‌بندی
                </label>
                <select
                  value={courseFormData.category}
                  onChange={(e) => setCourseFormData({...courseFormData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">انتخاب دسته‌بندی</option>
                  <option value="کاشت">کاشت</option>
                  <option value="داشت">داشت</option>
                  <option value="برداشت">برداشت</option>
                  <option value="ابزار">ابزار و تجهیزات</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                توضیحات
              </label>
              <textarea
                value={courseFormData.description}
                onChange={(e) => setCourseFormData({...courseFormData, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="توضیحات دوره..."
              />
            </div>

            {/* Protection Settings */}
            <ProtectionSettings
              allowDownload={courseFormData.allowDownload}
              allowScreenshot={courseFormData.allowScreenshot}
              allowCopy={courseFormData.allowCopy}
              allowPrint={courseFormData.allowPrint}
              watermarkText={courseFormData.watermarkText}
              protectionLevel={courseFormData.protectionLevel}
              onChange={handleProtectionChange}
            />

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                انصراف
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Save className="h-4 w-4" />
                {editingCourse ? 'به‌روزرسانی' : 'ایجاد دوره'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Courses List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">دوره‌های آموزشی</h2>
            <button 
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              افزودن دوره جدید
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {courses && courses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-2">عنوان</th>
                    <th className="text-right py-2">حفاظت</th>
                    <th className="text-right py-2">وضعیت</th>
                    <th className="text-right py-2">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map(course => (
                    <tr key={course.id} className="border-b">
                      <td className="py-2">{course.title}</td>
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!course.allowDownload}
                              onChange={(e) => updateProtectionMutation.mutate({
                                courseId: course.id,
                                protectionField: 'allowDownload',
                                value: !e.target.checked
                              })}
                              className="w-4 h-4"
                            />
                            <Download className="h-3 w-3 text-red-500" />
                            <span className="text-xs text-gray-600">قفل دانلود</span>
                          </label>
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!course.allowScreenshot}
                              onChange={(e) => updateProtectionMutation.mutate({
                                courseId: course.id,
                                protectionField: 'allowScreenshot',
                                value: !e.target.checked
                              })}
                              className="w-4 h-4"
                            />
                            <Eye className="h-3 w-3 text-red-500" />
                            <span className="text-xs text-gray-600">قفل اسکرین‌شات</span>
                          </label>
                        </div>
                      </td>
                      <td className="py-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                          فعال
                        </span>
                      </td>
                      <td className="py-2">
                        <div className="flex gap-2">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded text-red-500">
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
    </div>
  );
}

function ProjectsTab() {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const queryClient = useQueryClient();

  const updateProjectProtectionMutation = useMutation({
    mutationFn: async ({ projectId, protectionField, value }: { projectId: number, protectionField: string, value: boolean }) => {
      return await apiRequest(`/api/projects/${projectId}/protection`, {
        method: 'PATCH',
        body: JSON.stringify({ [protectionField]: value })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">پروژه‌های عملی</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" />
            افزودن پروژه جدید
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map(project => (
              <div key={project.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{project.title}</h3>
                  <span className="text-sm text-gray-500">سطح {project.difficulty}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                
                {/* Protection Controls */}
                <div className="flex items-center gap-3 mb-3 text-xs">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!project.allowDownload}
                      onChange={(e) => updateProjectProtectionMutation.mutate({
                        projectId: project.id,
                        protectionField: 'allowDownload',
                        value: !e.target.checked
                      })}
                      className="w-3 h-3"
                    />
                    <Download className="h-3 w-3 text-red-500" />
                    <span className="text-gray-600">قفل دانلود</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!project.allowCopy}
                      onChange={(e) => updateProjectProtectionMutation.mutate({
                        projectId: project.id,
                        protectionField: 'allowCopy',
                        value: !e.target.checked
                      })}
                      className="w-3 h-3"
                    />
                    <Copy className="h-3 w-3 text-red-500" />
                    <span className="text-gray-600">قفل کپی</span>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{project.estimatedHours} ساعت</span>
                  <div className="flex gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded text-red-500">
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
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

function DocumentsTab() {
  const { data: documents, isLoading } = useQuery<Document[]>({
    queryKey: ['/api/documents'],
  });

  const queryClient = useQueryClient();

  const updateDocumentProtectionMutation = useMutation({
    mutationFn: async ({ documentId, protectionField, value }: { documentId: number, protectionField: string, value: boolean }) => {
      return await apiRequest(`/api/documents/${documentId}/protection`, {
        method: 'PATCH',
        body: JSON.stringify({ [protectionField]: value })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">کتابخانه اسناد</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2">
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
                
                {/* Protection Controls */}
                <div className="flex items-center gap-4 text-xs border-t pt-3">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!doc.allowDownload}
                      onChange={(e) => updateDocumentProtectionMutation.mutate({
                        documentId: doc.id,
                        protectionField: 'allowDownload',
                        value: !e.target.checked
                      })}
                      className="w-3 h-3"
                    />
                    <Download className="h-3 w-3 text-red-500" />
                    <span className="text-gray-600">قفل دانلود</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!doc.allowCopy}
                      onChange={(e) => updateDocumentProtectionMutation.mutate({
                        documentId: doc.id,
                        protectionField: 'allowCopy',
                        value: !e.target.checked
                      })}
                      className="w-3 h-3"
                    />
                    <Copy className="h-3 w-3 text-red-500" />
                    <span className="text-gray-600">قفل کپی</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!doc.allowPrint}
                      onChange={(e) => updateDocumentProtectionMutation.mutate({
                        documentId: doc.id,
                        protectionField: 'allowPrint',
                        value: !e.target.checked
                      })}
                      className="w-3 h-3"
                    />
                    <Shield className="h-3 w-3 text-red-500" />
                    <span className="text-gray-600">قفل چاپ</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <File className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ سندی یافت نشد</h3>
            <p className="text-gray-600">برای شروع، سند جدیدی اضافه کنید</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SlidesTab() {
  const [showForm, setShowForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    buttonText: '',
    buttonUrl: '',
    isActive: true,
    order: 0,
    gradientFrom: 'blue-500',
    gradientTo: 'purple-600',
    iconName: 'GraduationCap'
  });

  const { data: slides, isLoading } = useQuery<Slide[]>({
    queryKey: ['/api/slides'],
  });

  const queryClient = useQueryClient();

  const createSlideMutation = useMutation({
    mutationFn: async (slideData: any) => {
      return apiRequest('/api/slides', {
        method: 'POST',
        body: JSON.stringify(slideData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/slides'] });
      setShowForm(false);
      resetForm();
    },
  });

  const updateSlideMutation = useMutation({
    mutationFn: async ({ id, ...slideData }: any) => {
      return apiRequest(`/api/slides/${id}`, {
        method: 'PUT',
        body: JSON.stringify(slideData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/slides'] });
      setShowForm(false);
      setEditingSlide(null);
      resetForm();
    },
  });

  const deleteSlideMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/slides/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/slides'] });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      buttonText: '',
      buttonUrl: '',
      isActive: true,
      order: 0,
      gradientFrom: 'blue-500',
      gradientTo: 'purple-600',
      iconName: 'GraduationCap'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSlide) {
      updateSlideMutation.mutate({ id: editingSlide.id, ...formData });
    } else {
      createSlideMutation.mutate(formData);
    }
  };

  const handleEdit = (slide: Slide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      description: slide.description,
      imageUrl: slide.imageUrl || '',
      buttonText: slide.buttonText || '',
      buttonUrl: slide.buttonUrl || '',
      isActive: slide.isActive ?? true,
      order: slide.order ?? 0,
      gradientFrom: slide.gradientFrom || 'blue-500',
      gradientTo: slide.gradientTo || 'purple-600',
      iconName: slide.iconName || 'GraduationCap'
    });
    setShowForm(true);
  };

  if (isLoading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">اسلایدهای صفحه اصلی</h2>
            <button 
              onClick={() => {
                setShowForm(true);
                setEditingSlide(null);
                resetForm();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              افزودن اسلاید جدید
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {slides && slides.length > 0 ? (
            <div className="space-y-4">
              {slides.map(slide => (
                <div key={slide.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r from-${slide.gradientFrom} to-${slide.gradientTo} flex items-center justify-center text-white`}>
                      <span className="text-sm font-bold">{slide.order}</span>
                    </div>
                    <div>
                      <h3 className="font-medium">{slide.title}</h3>
                      <p className="text-sm text-gray-600">{slide.description}</p>
                      {slide.buttonText && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-1 inline-block">
                          {slide.buttonText}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${slide.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {slide.isActive ? 'فعال' : 'غیرفعال'}
                    </span>
                    <button 
                      onClick={() => handleEdit(slide)}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => deleteSlideMutation.mutate(slide.id)}
                      className="p-2 hover:bg-gray-100 rounded text-red-500"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
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

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editingSlide ? 'ویرایش اسلاید' : 'افزودن اسلاید جدید'}
              </h3>
              <button 
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  عنوان *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ترتیب نمایش
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                توضیحات
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  متن دکمه
                </label>
                <input
                  type="text"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({...formData, buttonText: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  لینک دکمه
                </label>
                <input
                  type="text"
                  value={formData.buttonUrl}
                  onChange={(e) => setFormData({...formData, buttonUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                آدرس تصویر
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                فعال
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                انصراف
              </button>
              <button
                type="submit"
                disabled={createSlideMutation.isPending || updateSlideMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {editingSlide ? 'به‌روزرسانی' : 'ایجاد'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function MagazinesTab() {
  const { data: magazines, isLoading } = useQuery<Magazine[]>({
    queryKey: ['/api/magazines'],
  });

  const queryClient = useQueryClient();

  const updateMagazineProtectionMutation = useMutation({
    mutationFn: async ({ magazineId, protectionField, value }: { magazineId: number, protectionField: string, value: boolean }) => {
      return await apiRequest(`/api/magazines/${magazineId}/protection`, {
        method: 'PATCH',
        body: JSON.stringify({ [protectionField]: value })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/magazines'] });
    },
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
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>شماره {magazine.issueNumber}</span>
                  <span>{magazine.publishDate ? new Date(magazine.publishDate).toLocaleDateString('fa-IR') : 'تاریخ نامشخص'}</span>
                </div>
                
                {/* Protection Controls */}
                <div className="flex flex-wrap items-center gap-2 text-xs mb-3 border-t pt-2">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!magazine.allowDownload}
                      onChange={(e) => updateMagazineProtectionMutation.mutate({
                        magazineId: magazine.id,
                        protectionField: 'allowDownload',
                        value: !e.target.checked
                      })}
                      className="w-3 h-3"
                    />
                    <Download className="h-3 w-3 text-red-500" />
                    <span className="text-gray-600">قفل</span>
                  </label>
                </div>
                
                <div className="flex gap-2">
                  <button className="flex-1 py-1 px-2 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200 transition-colors">
                    مشاهده
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded text-red-500">
                    <Trash className="h-4 w-4" />
                  </button>
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
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [postFormData, setPostFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    status: 'draft',
    publishDate: '',
    category: '',
    tags: '',
    seoTitle: '',
    seoDescription: '',
    featuredImage: ''
  });

  const resetPostForm = () => {
    setPostFormData({
      title: '',
      content: '',
      excerpt: '',
      status: 'draft',
      publishDate: '',
      category: '',
      tags: '',
      seoTitle: '',
      seoDescription: '',
      featuredImage: ''
    });
    setEditingPost(null);
  };

  // Sample posts data
  const [posts] = useState([
    {
      id: 1,
      title: 'آموزش کاشت گوجه فرنگی',
      excerpt: 'راهنمای کامل کاشت و نگهداری گوجه فرنگی در خانه',
      status: 'published',
      author: 'علی احمدی',
      publishDate: '2024-01-15',
      views: 150,
      likes: 23,
      category: 'آموزش کاشت',
      tags: ['گوجه فرنگی', 'کاشت خانگی']
    },
    {
      id: 2,
      title: 'بیماری‌های رایج گیاهان',
      excerpt: 'شناخت و درمان بیماری‌های شایع گیاهان باغچه',
      status: 'draft',
      author: 'مریم رضایی',
      publishDate: '2024-01-20',
      views: 85,
      likes: 12,
      category: 'بیماری‌ها',
      tags: ['بیماری گیاهان', 'درمان']
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">مدیریت نوشته‌ها</h1>
          <p className="text-gray-600 mt-1">ایجاد، ویرایش و مدیریت نوشته‌های وبسایت</p>
        </div>
        <button 
          onClick={() => {
            setShowPostForm(true);
            resetPostForm();
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          افزودن نوشته جدید
        </button>
      </div>

      {/* Post Form */}
      {showPostForm && (
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingPost ? 'ویرایش نوشته' : 'نوشته جدید'}
              </h2>
              <button
                onClick={() => setShowPostForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان نوشته *
              </label>
              <input
                type="text"
                value={postFormData.title}
                onChange={(e) => setPostFormData({...postFormData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="عنوان نوشته خود را وارد کنید..."
              />
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                محتوای نوشته *
              </label>
              <RichTextEditor
                content={postFormData.content}
                onChange={(content) => setPostFormData({...postFormData, content})}
              />
            </div>

            {/* Post Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    خلاصه
                  </label>
                  <textarea
                    value={postFormData.excerpt}
                    onChange={(e) => setPostFormData({...postFormData, excerpt: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="خلاصه‌ای از محتوای نوشته..."
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    دسته‌بندی
                  </label>
                  <select
                    value={postFormData.category}
                    onChange={(e) => setPostFormData({...postFormData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">انتخاب دسته‌بندی</option>
                    <option value="آموزش کاشت">آموزش کاشت</option>
                    <option value="بیماری‌ها">بیماری‌ها</option>
                    <option value="تغذیه گیاهان">تغذیه گیاهان</option>
                    <option value="ابزار کشاورزی">ابزار کشاورزی</option>
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    برچسب‌ها
                  </label>
                  <input
                    type="text"
                    value={postFormData.tags}
                    onChange={(e) => setPostFormData({...postFormData, tags: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="برچسب‌ها را با کاما جدا کنید..."
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وضعیت انتشار
                  </label>
                  <select
                    value={postFormData.status}
                    onChange={(e) => setPostFormData({...postFormData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="draft">پیش‌نویس</option>
                    <option value="published">منتشر شده</option>
                    <option value="scheduled">زمان‌بندی شده</option>
                  </select>
                </div>

                {/* Publish Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاریخ انتشار
                  </label>
                  <input
                    type="datetime-local"
                    value={postFormData.publishDate}
                    onChange={(e) => setPostFormData({...postFormData, publishDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Featured Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تصویر شاخص
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">تصویر را اینجا بکشید یا کلیک کنید</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">تنظیمات سئو</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان سئو
                  </label>
                  <input
                    type="text"
                    value={postFormData.seoTitle}
                    onChange={(e) => setPostFormData({...postFormData, seoTitle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="عنوان برای موتورهای جستجو..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    توضیحات سئو
                  </label>
                  <textarea
                    value={postFormData.seoDescription}
                    onChange={(e) => setPostFormData({...postFormData, seoDescription: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="توضیحات برای موتورهای جستجو..."
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <button
                onClick={() => setShowPostForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                انصراف
              </button>
              <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2">
                <Eye className="h-4 w-4" />
                پیش‌نمایش
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                <Save className="h-4 w-4" />
                {editingPost ? 'به‌روزرسانی' : 'انتشار'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="جستجو در نوشته‌ها..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Filter className="h-4 w-4" />
                فیلتر
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عنوان
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  نویسنده
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  دسته‌بندی
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  وضعیت
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاریخ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  آمار
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{post.title}</div>
                      <div className="text-sm text-gray-500">{post.excerpt}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{post.author}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      post.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.status === 'published' ? 'منتشر شده' : 'پیش‌نویس'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{post.publishDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="text-xs">
                      <div>👁 {post.views}</div>
                      <div>❤️ {post.likes}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingPost(post);
                          setPostFormData({
                            title: post.title,
                            content: '',
                            excerpt: post.excerpt,
                            status: post.status,
                            publishDate: post.publishDate,
                            category: post.category,
                            tags: post.tags.join(', '),
                            seoTitle: '',
                            seoDescription: '',
                            featuredImage: ''
                          });
                          setShowPostForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="ویرایش"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800 p-1" title="کپی">
                        <Copy className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800 p-1" title="حذف">
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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