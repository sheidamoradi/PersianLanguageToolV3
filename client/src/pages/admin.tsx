import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { type Course, type Document, type MediaContent, type Magazine, type Article, type ArticleContent, type Slide, type Workshop, type WorkshopSection, type WorkshopRegistration } from "@shared/schema";
import { Calendar, Edit, Eye, File, Folder, Image, Lock, LockOpen, MoreHorizontal, Plus, RefreshCw, Trash, Upload, Video } from "lucide-react";
import WorkshopsTab from "@/components/admin/WorkshopsTab";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("workshop-registrations");

  const tabs = [
    { id: "courses", label: "دوره‌ها", icon: Video },
    { id: "webinars", label: "وبینارهای آموزشی", icon: Video },
    { id: "documents", label: "اسناد", icon: File },
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
          {activeTab === "documents" && <DocumentsTab />}
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
    mutationFn: (data: any) => apiRequest('/api/webinars', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/webinars'] });
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
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest(`/api/webinars/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/webinars'] });
      setEditingWebinar(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest(`/api/webinars/${id}`, {
        method: 'DELETE'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/webinars'] });
    }
  });

  const handleCreate = () => {
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

function SlidesTab() {
  return <div>اسلایدها</div>;
}

function MagazinesTab() {
  return <div>مجله‌ها</div>;
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