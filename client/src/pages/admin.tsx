import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { type Course, type Project, type Document, type MediaContent, type Magazine, type Article, type ArticleContent, type Slide, type Workshop, type WorkshopSection, type WorkshopRegistration } from "@shared/schema";
import { Calendar, Edit, Eye, File, Folder, Image, Lock, LockOpen, MoreHorizontal, Plus, RefreshCw, Trash, Upload, Video } from "lucide-react";
import WorkshopsTab from "@/components/admin/WorkshopsTab";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("courses");

  const tabs = [
    { id: "courses", label: "دوره‌ها", icon: Video },
    { id: "projects", label: "پروژه‌ها", icon: Folder },
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
          {activeTab === "projects" && <ProjectsTab />}
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

function ProjectsTab() {
  return <div>پروژه‌ها</div>;
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