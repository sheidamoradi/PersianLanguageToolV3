import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { type Course, type Document, type MediaContent, type Magazine, type Article, type ArticleContent, type Slide, type Workshop, type WorkshopSection, type WorkshopRegistration } from "@shared/schema";
import { Calendar, Edit, Eye, File, Folder, Image, Lock, LockOpen, MoreHorizontal, Plus, RefreshCw, Trash, Upload, Video, X } from "lucide-react";
import WorkshopsTab from "@/components/admin/WorkshopsTab";
import WebinarSectionsTab from "@/components/admin/WebinarSectionsTab";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("workshop-registrations");

  const tabs = [
    { id: "courses", label: "دوره‌ها", icon: Video },
    { id: "webinars", label: "وبینارهای آموزشی", icon: Video },
    { id: "webinar-sections", label: "بخش‌های وبینار", icon: Folder },
    { id: "educational-videos", label: "ویدیوهای آموزشی", icon: Video },
    { id: "documents", label: "اسناد", icon: File },
    { id: "media", label: "کتابخانه رسانه", icon: Image },
    { id: "slides", label: "اسلایدها", icon: Image },
    { id: "magazines", label: "مجله‌ها", icon: Calendar },
    { id: "workshops", label: "کارگاه‌ها", icon: Calendar },
    { id: "workshop-registrations", label: "ثبت‌نام کارگاه‌ها", icon: Edit },
    { id: "users", label: "کاربران", icon: Lock }
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">پنل مدیریت</h1>
          <p className="text-gray-600">مدیریت محتوا و تنظیمات سایت</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white rounded-lg border p-4 h-fit shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">دسته‌بندی‌ها</h3>
          <nav className="space-y-1">
            {tabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-right ${
                    activeTab === tab.id 
                      ? 'bg-blue-50 text-blue-600 font-medium border-r-2 border-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {activeTab === "courses" && <CoursesTab />}
          {activeTab === "webinars" && <WebinarsManagerTab />}
          {activeTab === "webinar-sections" && <WebinarSectionsTab />}
          {activeTab === "educational-videos" && <EducationalVideosTab />}
          {activeTab === "documents" && <DocumentsTab />}
          {activeTab === "media" && <MediaTab />}
          {activeTab === "slides" && <SlidesTab />}
          {activeTab === "magazines" && <MagazinesTab />}
          {activeTab === "workshops" && <WorkshopsTab />}
          {activeTab === "workshop-registrations" && <WorkshopRegistrationsTab />}
          {activeTab === "users" && <UsersTab />}
        </div>
      </div>
    </div>
  );
}

function WebinarsManagerTab() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingWebinar, setEditingWebinar] = useState<any>(null);
  const [createData, setCreateData] = useState({
    title: '',
    description: '',
    instructor: '',
    duration: '',
    eventDate: '',
    imageUrl: '',
    level: 'beginner' as const,
    category: '',
    price: 0,
    maxParticipants: 0
  });

  const { data: webinars, isLoading } = useQuery<any[]>({
    queryKey: ['/api/webinars'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/webinars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create error:', errorText);
        throw new Error('خطا در ایجاد وبینار');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/webinars'] });
      queryClient.refetchQueries({ queryKey: ['/api/webinars'] });
      setShowCreateForm(false);
      setCreateData({
        title: '',
        description: '',
        instructor: '',
        duration: '',
        eventDate: '',
        imageUrl: '',
        level: 'beginner',
        category: '',
        price: 0,
        maxParticipants: 0
      });
      alert('وبینار با موفقیت ایجاد شد');
    },
    onError: (error) => {
      console.error('Create error:', error);
      alert('خطا در ایجاد وبینار');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await fetch(`/api/webinars/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('خطا در ویرایش وبینار');
      }
      
      return response.json();
    },
    onSuccess: (updatedWebinar) => {
      // Immediately update the cache with the new data
      queryClient.setQueryData(['/api/webinars'], (oldData: any[]) => {
        if (!oldData) return [];
        return oldData.map(webinar => 
          webinar.id === updatedWebinar.id ? updatedWebinar : webinar
        );
      });
      queryClient.invalidateQueries({ queryKey: ['/api/webinars'] });
      queryClient.refetchQueries({ queryKey: ['/api/webinars'] });
      setEditingWebinar(null);
      // Show success message
      alert('وبینار با موفقیت ویرایش شد');
    },
    onError: (error) => {
      console.error('Update error:', error);
      alert('خطا در ویرایش وبینار');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/webinars/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('خطا در حذف وبینار');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/webinars'] });
      queryClient.refetchQueries({ queryKey: ['/api/webinars'] });
      alert('وبینار با موفقیت حذف شد');
    },
    onError: (error) => {
      console.error('Delete error:', error);
      alert('خطا در حذف وبینار');
    }
  });

  const handleCreate = () => {
    // Only require title - all other fields are optional
    if (!createData.title.trim()) {
      alert('عنوان وبینار الزامی است');
      return;
    }
    
    createMutation.mutate(createData);
  };

  const handleEdit = (webinar: any) => {
    setEditingWebinar({ ...webinar });
  };

  const handleUpdate = () => {
    if (editingWebinar) {
      updateMutation.mutate({
        id: editingWebinar.id,
        data: editingWebinar
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('آیا مطمئن هستید که می‌خواهید این وبینار را حذف کنید؟')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">وبینارهای آموزشی</h2>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          وبینار جدید
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">ایجاد وبینار جدید</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">عنوان</label>
              <input
                type="text"
                value={createData.title}
                onChange={(e) => setCreateData({...createData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">مدرس</label>
              <input
                type="text"
                value={createData.instructor}
                onChange={(e) => setCreateData({...createData, instructor: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">مدت زمان</label>
              <input
                type="text"
                value={createData.duration}
                onChange={(e) => setCreateData({...createData, duration: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تاریخ برگزاری</label>
              <input
                type="date"
                value={createData.eventDate}
                onChange={(e) => setCreateData({...createData, eventDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">قیمت (تومان)</label>
              <input
                type="number"
                value={createData.price}
                onChange={(e) => setCreateData({...createData, price: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">حداکثر شرکت‌کننده</label>
              <input
                type="number"
                value={createData.maxParticipants}
                onChange={(e) => setCreateData({...createData, maxParticipants: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">دسته‌بندی</label>
              <input
                type="text"
                value={createData.category}
                onChange={(e) => setCreateData({...createData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات</label>
            <textarea
              value={createData.description}
              onChange={(e) => setCreateData({...createData, description: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">عکس پوستر</label>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={createData.imageUrl}
                onChange={(e) => setCreateData({...createData, imageUrl: e.target.value})}
                placeholder="آدرس عکس پوستر"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => {
                  window.postMessage({ type: 'SWITCH_TAB', tab: 'media-library' }, '*');
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                انتخاب از کتابخانه
              </button>
            </div>
            {createData.imageUrl && (
              <div className="mt-2">
                <img
                  src={createData.imageUrl}
                  alt="پیش‌نمایش"
                  className="max-h-32 rounded-md border"
                />
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleCreate}
              disabled={createMutation.isPending}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {createMutation.isPending ? 'در حال ایجاد...' : 'ایجاد'}
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              لغو
            </button>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {editingWebinar && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">ویرایش وبینار</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">عنوان</label>
              <input
                type="text"
                value={editingWebinar.title}
                onChange={(e) => setEditingWebinar({...editingWebinar, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">مدرس</label>
              <input
                type="text"
                value={editingWebinar.instructor}
                onChange={(e) => setEditingWebinar({...editingWebinar, instructor: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">مدت زمان</label>
              <input
                type="text"
                value={editingWebinar.duration}
                onChange={(e) => setEditingWebinar({...editingWebinar, duration: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تاریخ برگزاری</label>
              <input
                type="date"
                value={editingWebinar.eventDate}
                onChange={(e) => setEditingWebinar({...editingWebinar, eventDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">قیمت (تومان)</label>
              <input
                type="number"
                value={editingWebinar.price || 0}
                onChange={(e) => setEditingWebinar({...editingWebinar, price: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">حداکثر شرکت‌کننده</label>
              <input
                type="number"
                value={editingWebinar.maxParticipants || 0}
                onChange={(e) => setEditingWebinar({...editingWebinar, maxParticipants: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">دسته‌بندی</label>
              <input
                type="text"
                value={editingWebinar.category || ''}
                onChange={(e) => setEditingWebinar({...editingWebinar, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات</label>
            <textarea
              value={editingWebinar.description}
              onChange={(e) => setEditingWebinar({...editingWebinar, description: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">عکس پوستر</label>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={editingWebinar.imageUrl || ''}
                onChange={(e) => setEditingWebinar({...editingWebinar, imageUrl: e.target.value})}
                placeholder="آدرس عکس پوستر"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => {
                  window.postMessage({ type: 'SWITCH_TAB', tab: 'media-library' }, '*');
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                انتخاب از کتابخانه
              </button>
            </div>
            {editingWebinar.imageUrl && (
              <div className="mt-2">
                <img
                  src={editingWebinar.imageUrl}
                  alt="پیش‌نمایش"
                  className="max-h-32 rounded-md border"
                />
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleUpdate}
              disabled={updateMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {updateMutation.isPending ? 'در حال ویرایش...' : 'ویرایش'}
            </button>
            <button
              onClick={() => setEditingWebinar(null)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              لغو
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h4 className="font-semibold">وبینارهای موجود</h4>
        </div>
        <div className="divide-y">
          {webinars && webinars.map((webinar: any) => (
            <div key={webinar.id} className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <h5 className="font-medium">{webinar.title}</h5>
                <p className="text-sm text-gray-600">{webinar.description}</p>
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                  {webinar.instructor && <span>👨‍🏫 {webinar.instructor}</span>}
                  {webinar.duration && <span>⏱️ {webinar.duration}</span>}
                  {webinar.eventDate && <span>📅 {webinar.eventDate}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleEdit(webinar)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDelete(webinar.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          
          {(!webinars || webinars.length === 0) && (
            <div className="p-8 text-center text-gray-500">
              هنوز وبیناری اضافه نشده است.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CoursesTab() {
  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">دوره‌ها</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          دوره جدید
        </button>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h4 className="font-semibold">دوره‌های موجود</h4>
        </div>
        <div className="divide-y">
          {courses && courses.map((course: Course) => (
            <div key={course.id} className="p-4 flex items-center justify-between">
              <div>
                <h5 className="font-medium">{course.title}</h5>
                <p className="text-sm text-gray-600">{course.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-blue-600 hover:text-blue-800">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="text-red-600 hover:text-red-800">
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DocumentsTab() {
  return <div>اسناد</div>;
}

function MediaTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: mediaFiles, isLoading } = useQuery<any[]>({
    queryKey: ['/api/media-library', searchQuery],
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('خطا در آپلود فایل');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/media-library'] });
      alert('فایل با موفقیت آپلود شد');
    },
    onError: () => {
      alert('خطا در آپلود فایل');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/media-library/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('خطا در حذف فایل');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/media-library'] });
      setSelectedFile(null);
      alert('فایل حذف شد');
    },
    onError: () => {
      alert('خطا در حذف فایل');
    },
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 بایت';
    const k = 1024;
    const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type?.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (type?.startsWith('video/')) return <Video className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('آدرس فایل کپی شد');
  };

  // Sample data for demonstration
  const sampleMediaFiles = [
    {
      id: 1,
      filename: "logo-pistach.png",
      originalName: "لوگو پیستاط.png",
      size: 45632,
      type: "image/png",
      url: "/uploads/logo-pistach.png",
      uploadedAt: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      filename: "course-agriculture.jpg",
      originalName: "دوره کشاورزی.jpg",
      size: 234567,
      type: "image/jpeg",
      url: "/uploads/course-agriculture.jpg",
      uploadedAt: "2024-01-14T15:45:00Z"
    },
    {
      id: 3,
      filename: "video-irrigation.mp4",
      originalName: "آموزش آبیاری.mp4",
      size: 15678901,
      type: "video/mp4",
      url: "/uploads/video-irrigation.mp4",
      uploadedAt: "2024-01-13T09:20:00Z"
    }
  ];

  const displayFiles = mediaFiles || sampleMediaFiles;
  const filteredFiles = displayFiles.filter((file: any) =>
    file.originalName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.filename?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">کتابخانه رسانه</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="جستجو در فایل‌ها..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-3 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
            <Upload className="h-4 w-4" />
            آپلود فایل
            <input
              type="file"
              accept="image/*,video/*,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h4 className="font-semibold">فایل‌های رسانه</h4>
        </div>
        
        {isLoading ? (
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredFiles.map((file: any) => (
                <div
                  key={file.id}
                  className={`group relative border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                    selectedFile?.id === file.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedFile(file)}
                >
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    {file.type?.startsWith('image/') ? (
                      <img
                        src={file.url}
                        alt={file.originalName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400">
                        {getFileIcon(file.type)}
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-gray-900 truncate font-medium">
                      {file.originalName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyUrl(file.url);
                        }}
                        className="p-1 bg-black/50 text-white rounded hover:bg-black/70"
                      >
                        <Eye className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMutation.mutate(file.id);
                        }}
                        className="p-1 bg-red-500/80 text-white rounded hover:bg-red-600"
                      >
                        <Trash className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {(!filteredFiles || filteredFiles.length === 0) && (
              <div className="p-8 text-center text-gray-500">
                هنوز فایلی آپلود نشده است.
              </div>
            )}
          </div>
        )}
      </div>

      {/* File Details Sidebar */}
      {selectedFile && (
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">جزئیات فایل</h3>
            <button
              onClick={() => setSelectedFile(null)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Preview */}
            <div className="aspect-square bg-gray-100 rounded-lg border p-4 flex items-center justify-center">
              {selectedFile.type?.startsWith('image/') ? (
                <img
                  src={selectedFile.url}
                  alt={selectedFile.originalName}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-gray-400">
                  {getFileIcon(selectedFile.type)}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">نام فایل</label>
                <p className="text-sm text-gray-900 mt-1">{selectedFile.originalName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">نوع فایل</label>
                <p className="text-sm text-gray-900 mt-1">{selectedFile.type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">حجم</label>
                <p className="text-sm text-gray-900 mt-1">{formatFileSize(selectedFile.size)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">آدرس فایل</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={selectedFile.url}
                    readOnly
                    className="flex-1 text-sm bg-gray-100 px-2 py-1 rounded border"
                  />
                  <button
                    onClick={() => copyUrl(selectedFile.url)}
                    className="p-1 text-gray-600 hover:text-gray-800"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <button
                  onClick={() => copyUrl(selectedFile.url)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  کپی آدرس
                </button>
                <button
                  onClick={() => deleteMutation.mutate(selectedFile.id)}
                  className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SlidesTab() {
  return <div>اسلایدها</div>;
}

function MagazinesTab() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingMagazine, setEditingMagazine] = useState<any>(null);
  const [createData, setCreateData] = useState({
    title: '',
    description: '',
    issueNumber: 1,
    publishDate: '',
    coverImageUrl: '',
    isActive: true
  });

  const { data: magazines, isLoading } = useQuery<any[]>({
    queryKey: ['/api/magazines'],
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/magazines', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/magazines'] });
      setShowCreateForm(false);
      setCreateData({
        title: '',
        description: '',
        issueNumber: 1,
        publishDate: '',
        coverImageUrl: '',
        isActive: true
      });
    },
    onError: (error) => {
      console.error('Error creating magazine:', error);
      alert('خطا در ایجاد مجله: ' + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => apiRequest(`/api/magazines/${editingMagazine.id}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/magazines'] });
      setEditingMagazine(null);
    },
    onError: (error) => {
      console.error('Error updating magazine:', error);
      alert('خطا در بروزرسانی مجله: ' + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/magazines/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/magazines'] });
    },
    onError: (error) => {
      console.error('Error deleting magazine:', error);
      alert('خطا در حذف مجله: ' + error.message);
    },
  });

  const handleCreateSubmit = () => {
    if (!createData.title.trim()) {
      alert('لطفاً عنوان مجله را وارد کنید');
      return;
    }
    console.log('Creating magazine with data:', createData);
    createMutation.mutate(createData);
  };

  const handleUpdateSubmit = () => {
    updateMutation.mutate(editingMagazine);
  };

  const handleEdit = (magazine: any) => {
    setEditingMagazine({ ...magazine });
  };

  const handleDelete = (id: number) => {
    if (confirm('آیا از حذف این مجله اطمینان دارید؟')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">فصلنامه رویش سبز</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          افزودن مجله جدید
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">افزودن مجله جدید</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">عنوان</label>
              <input
                type="text"
                value={createData.title}
                onChange={(e) => setCreateData({...createData, title: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="عنوان مجله"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
              <textarea
                value={createData.description}
                onChange={(e) => setCreateData({...createData, description: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="توضیحات مجله"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">شماره</label>
              <input
                type="number"
                value={createData.issueNumber}
                onChange={(e) => setCreateData({...createData, issueNumber: parseInt(e.target.value) || 1})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="شماره مجله"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">تاریخ انتشار</label>
              <input
                type="date"
                value={createData.publishDate}
                onChange={(e) => setCreateData({...createData, publishDate: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">آدرس تصویر جلد</label>
              <input
                type="url"
                value={createData.coverImageUrl}
                onChange={(e) => setCreateData({...createData, coverImageUrl: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={createData.isActive}
                onChange={(e) => setCreateData({...createData, isActive: e.target.checked})}
                className="rounded"
              />
              <label className="text-sm text-gray-700">فعال</label>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCreateSubmit}
                disabled={createMutation.isPending}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {createMutation.isPending ? 'در حال ایجاد...' : 'ایجاد مجله'}
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                لغو
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Magazines List */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h4 className="font-semibold">لیست مجله‌ها</h4>
        </div>
        
        {magazines && magazines.length > 0 ? (
          <div className="divide-y">
            {magazines.map((magazine) => (
              <div key={magazine.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {magazine.coverImageUrl ? (
                        <img 
                          src={magazine.coverImageUrl} 
                          alt={magazine.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Calendar className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{magazine.title}</h3>
                      <p className="text-sm text-gray-600">{magazine.description}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-gray-500">شماره {magazine.issueNumber}</span>
                        <span className="text-xs text-gray-500">{magazine.publishDate}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          magazine.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {magazine.isActive ? 'فعال' : 'غیرفعال'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(magazine)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(magazine.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ مجله‌ای یافت نشد</h3>
            <p className="text-gray-600">برای شروع، مجله جدیدی اضافه کنید</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingMagazine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">ویرایش مجله</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">عنوان</label>
                <input
                  type="text"
                  value={editingMagazine.title}
                  onChange={(e) => setEditingMagazine({...editingMagazine, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
                <textarea
                  value={editingMagazine.description}
                  onChange={(e) => setEditingMagazine({...editingMagazine, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">شماره</label>
                <input
                  type="number"
                  value={editingMagazine.issueNumber}
                  onChange={(e) => setEditingMagazine({...editingMagazine, issueNumber: parseInt(e.target.value) || 1})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">تاریخ انتشار</label>
                <input
                  type="date"
                  value={editingMagazine.publishDate}
                  onChange={(e) => setEditingMagazine({...editingMagazine, publishDate: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">آدرس تصویر جلد</label>
                <input
                  type="url"
                  value={editingMagazine.coverImageUrl}
                  onChange={(e) => setEditingMagazine({...editingMagazine, coverImageUrl: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingMagazine.isActive}
                  onChange={(e) => setEditingMagazine({...editingMagazine, isActive: e.target.checked})}
                  className="rounded"
                />
                <label className="text-sm text-gray-700">فعال</label>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleUpdateSubmit}
                  disabled={updateMutation.isPending}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {updateMutation.isPending ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                </button>
                <button
                  onClick={() => setEditingMagazine(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  لغو
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function UsersTab() {
  return <div>کاربران</div>;
}

function WorkshopRegistrationsTab() {
  const { data: registrations = [], isLoading } = useQuery<WorkshopRegistration[]>({
    queryKey: ['/api/workshop-registrations']
  });

  const { data: workshops = [] } = useQuery<Workshop[]>({
    queryKey: ['/api/workshops']
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => 
      fetch(`/api/workshop-registrations/${id}`, {
        method: 'DELETE'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workshop-registrations'] });
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  const getWorkshopName = (workshopId: number) => {
    const workshop = workshops.find(w => w.id === workshopId);
    return workshop?.title || 'نامشخص';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">ثبت‌نام‌های کارگاه</h2>
        <span className="text-sm text-gray-600">تعداد: {registrations.length}</span>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h4 className="font-semibold">لیست ثبت‌نام‌ها</h4>
        </div>
        
        {registrations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            هنوز ثبت‌نامی انجام نشده است.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">نام کارگاه</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">نام کاربر</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">ایمیل</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">تلفن</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">وضعیت</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاریخ ثبت‌نام</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {registrations.map((registration) => (
                  <tr key={registration.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                      {getWorkshopName(registration.workshopId)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {registration.userName}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {registration.userEmail}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {registration.userPhone || '-'}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        registration.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : registration.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {registration.status === 'confirmed' ? 'تایید شده' : 
                         registration.status === 'pending' ? 'در انتظار' : 'لغو شده'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {registration.registrationDate 
                        ? new Date(registration.registrationDate).toLocaleDateString('fa-IR')
                        : '-'
                      }
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <button
                        onClick={() => deleteMutation.mutate(registration.id)}
                        disabled={deleteMutation.isPending}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function EducationalVideosTab() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<any>(null);
  const [createData, setCreateData] = useState({
    title: '',
    videoUrl: '',
    orderPosition: 0
  });

  const { data: videos, isLoading } = useQuery<any[]>({
    queryKey: ['/api/educational-videos'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/educational-videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create error:', errorText);
        throw new Error('خطا در ایجاد ویدیو');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/educational-videos'] });
      setShowCreateForm(false);
      setCreateData({
        title: '',
        videoUrl: '',
        orderPosition: 0
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/educational-videos/${editingVideo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update error:', errorText);
        throw new Error('خطا در به‌روزرسانی ویدیو');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/educational-videos'] });
      setEditingVideo(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/educational-videos/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete error:', errorText);
        throw new Error('خطا در حذف ویدیو');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/educational-videos'] });
    }
  });

  const handleCreateSubmit = () => {
    // Only require title - all other fields are optional
    if (!createData.title.trim()) {
      alert('عنوان الزامی است');
      return;
    }
    
    const tagsArray = createData.tags ? createData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    createMutation.mutate({
      ...createData,
      tags: tagsArray
    });
  };

  const handleUpdateSubmit = () => {
    if (!editingVideo) return;
    
    const tagsArray = editingVideo.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag);
    updateMutation.mutate({
      ...editingVideo,
      tags: tagsArray
    });
  };

  const handleEdit = (video: any) => {
    setEditingVideo({
      ...video,
      tags: Array.isArray(video.tags) ? video.tags.join(', ') : video.tags
    });
  };

  if (isLoading) return <div>در حال بارگذاری...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">ویدیوهای آموزشی</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          ایجاد ویدیو جدید
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">ایجاد ویدیو جدید</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان
              </label>
              <input
                type="text"
                value={createData.title}
                onChange={(e) => setCreateData({...createData, title: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="عنوان ویدیو..."
              />
            </div>



            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  آدرس ویدیو
                </label>
                <input
                  type="url"
                  value={createData.videoUrl}
                  onChange={(e) => setCreateData({...createData, videoUrl: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/video.mp4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تصویر کوچک
                </label>
                <input
                  type="url"
                  value={createData.thumbnailUrl}
                  onChange={(e) => setCreateData({...createData, thumbnailUrl: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="/uploads/thumbnail.jpg"
                />
              </div>
            </div>



            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ترتیب
                </label>
                <input
                  type="number"
                  value={createData.orderPosition}
                  onChange={(e) => setCreateData({...createData, orderPosition: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                برچسب‌ها (با کاما جدا کنید)
              </label>
              <input
                type="text"
                value={createData.tags}
                onChange={(e) => setCreateData({...createData, tags: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="کشاورزی, باغبانی, آموزش"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCreateSubmit}
                disabled={createMutation.isPending}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {createMutation.isPending ? 'در حال ایجاد...' : 'ایجاد ویدیو'}
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                لغو
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h4 className="font-semibold">لیست ویدیوهای آموزشی</h4>
        </div>
        
        {!videos || videos.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            هنوز ویدیویی اضافه نشده است.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {videos.map((video) => (
              <div key={video.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900">{video.title}</h5>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>ترتیب: {video.orderPosition}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(video)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(video.id)}
                      disabled={deleteMutation.isPending}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">ویرایش ویدیو</h3>
                <button
                  onClick={() => setEditingVideo(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان
                  </label>
                  <input
                    type="text"
                    value={editingVideo.title}
                    onChange={(e) => setEditingVideo({...editingVideo, title: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>



                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      آدرس ویدیو
                    </label>
                    <input
                      type="url"
                      value={editingVideo.videoUrl}
                      onChange={(e) => setEditingVideo({...editingVideo, videoUrl: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تصویر کوچک
                    </label>
                    <input
                      type="url"
                      value={editingVideo.thumbnailUrl}
                      onChange={(e) => setEditingVideo({...editingVideo, thumbnailUrl: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>



                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ترتیب
                    </label>
                    <input
                      type="number"
                      value={editingVideo.orderPosition}
                      onChange={(e) => setEditingVideo({...editingVideo, orderPosition: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    برچسب‌ها (با کاما جدا کنید)
                  </label>
                  <input
                    type="text"
                    value={editingVideo.tags}
                    onChange={(e) => setEditingVideo({...editingVideo, tags: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateSubmit}
                    disabled={updateMutation.isPending}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {updateMutation.isPending ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                  </button>
                  <button
                    onClick={() => setEditingVideo(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    لغو
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}