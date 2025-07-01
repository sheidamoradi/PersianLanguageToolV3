import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { type Course, type Project, type Document, type MediaContent, type Magazine, type Article, type ArticleContent, type Slide, type Workshop, type WorkshopSection } from "@shared/schema";
import { Calendar, Edit, Eye, File, Folder, Image, Lock, LockOpen, MoreHorizontal, Plus, RefreshCw, Trash, Upload, Video } from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("courses");

  return (
    <div dir="rtl" className="container mx-auto py-6 pb-20">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">پنل مدیریت</h1>
        <p className="text-gray-600">مدیریت محتوا و تنظیمات سایت</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b overflow-x-auto">
        {[
          { id: "courses", label: "دوره‌ها", icon: Video },
          { id: "projects", label: "پروژه‌ها", icon: Folder },
          { id: "documents", label: "اسناد", icon: File },
          { id: "slides", label: "اسلایدها", icon: Image },
          { id: "magazines", label: "مجله‌ها", icon: Calendar },
          { id: "users", label: "کاربران", icon: Lock }
        ].map(tab => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-blue-500 text-blue-600 font-medium' 
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <IconComponent className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === "courses" && <CoursesTab />}
        {activeTab === "projects" && <ProjectsTab />}
        {activeTab === "documents" && <DocumentsTab />}
        {activeTab === "slides" && <SlidesTab />}
        {activeTab === "magazines" && <MagazinesTab />}
        {activeTab === "users" && <UsersTab />}
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
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">دوره‌های آموزشی</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2">
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
                  <th className="text-right py-2">وضعیت</th>
                  <th className="text-right py-2">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course.id} className="border-b">
                    <td className="py-3">{course.title}</td>
                    <td className="py-3">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        فعال
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
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
              <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-medium mb-2">{project.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{project.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">پروژه</span>
                  <div className="flex gap-1">
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
              <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
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

  const handleEdit = (slide: Slide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      description: slide.description,
      imageUrl: slide.imageUrl || '',
      buttonText: slide.buttonText,
      buttonUrl: slide.buttonUrl,
      isActive: slide.isActive || true,
      order: slide.order || 0,
      gradientFrom: slide.gradientFrom || 'blue-500',
      gradientTo: slide.gradientTo || 'purple-600',
      iconName: slide.iconName || 'GraduationCap'
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSlide) {
      updateSlideMutation.mutate({ id: editingSlide.id, ...formData });
    } else {
      createSlideMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('آیا از حذف این اسلاید اطمینان دارید؟')) {
      deleteSlideMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">مدیریت اسلایدها</h2>
            <button 
              onClick={() => {
                setShowForm(!showForm);
                setEditingSlide(null);
                resetForm();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {showForm ? 'لغو' : 'افزودن اسلاید جدید'}
            </button>
          </div>
        </div>
        
        {showForm && (
          <div className="p-6 border-t bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">
              {editingSlide ? 'ویرایش اسلاید' : 'افزودن اسلاید جدید'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    عنوان اسلاید
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    متن دکمه
                  </label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({...formData, buttonText: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    لینک دکمه
                  </label>
                  <input
                    type="text"
                    value={formData.buttonUrl}
                    onChange={(e) => setFormData({...formData, buttonUrl: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="/courses"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL تصویر (اختیاری)
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    رنگ شروع گرادیان
                  </label>
                  <select
                    value={formData.gradientFrom}
                    onChange={(e) => setFormData({...formData, gradientFrom: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="blue-500">آبی</option>
                    <option value="green-500">سبز</option>
                    <option value="purple-500">بنفش</option>
                    <option value="red-500">قرمز</option>
                    <option value="yellow-500">زرد</option>
                    <option value="pink-500">صورتی</option>
                    <option value="indigo-500">نیلی</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    رنگ پایان گرادیان
                  </label>
                  <select
                    value={formData.gradientTo}
                    onChange={(e) => setFormData({...formData, gradientTo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="purple-600">بنفش تیره</option>
                    <option value="blue-600">آبی تیره</option>
                    <option value="green-600">سبز تیره</option>
                    <option value="red-600">قرمز تیره</option>
                    <option value="yellow-600">زرد تیره</option>
                    <option value="pink-600">صورتی تیره</option>
                    <option value="indigo-600">نیلی تیره</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    آیکون
                  </label>
                  <select
                    value={formData.iconName}
                    onChange={(e) => setFormData({...formData, iconName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="GraduationCap">فارغ‌التحصیلی</option>
                    <option value="BookOpen">کتاب باز</option>
                    <option value="Rocket">موشک</option>
                    <option value="Star">ستاره</option>
                    <option value="Trophy">جام</option>
                    <option value="Target">هدف</option>
                    <option value="Lightbulb">لامپ</option>
                    <option value="Heart">قلب</option>
                    <option value="Globe">کره زمین</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ترتیب نمایش
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="mr-2 text-sm font-medium text-gray-700">
                    اسلاید فعال باشد
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={createSlideMutation.isPending || updateSlideMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {createSlideMutation.isPending || updateSlideMutation.isPending ? 'در حال ذخیره...' : 
                   editingSlide ? 'بروزرسانی اسلاید' : 'ایجاد اسلاید'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingSlide(null);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  لغو
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="p-6">
          {slides && slides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {slides.map(slide => (
                <div key={slide.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium">{slide.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      slide.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {slide.isActive ? 'فعال' : 'غیرفعال'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{slide.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">ترتیب: {slide.order}</span>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => handleEdit(slide)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(slide.id)}
                        className="p-1 hover:bg-gray-100 rounded text-red-500"
                      >
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
          <div className="space-y-4">
            {magazines.map(magazine => (
              <div key={magazine.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-medium">{magazine.title}</h3>
                    <p className="text-sm text-gray-600">{magazine.description}</p>
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

// Users Tab Component
function UsersTab() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<number>(0);
  const [accessType, setAccessType] = useState<string>("granted");
  const [expiryDate, setExpiryDate] = useState<string>("");

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["/api/users"],
  });

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["/api/courses"],
  });

  const { data: userAccess = [], isLoading: accessLoading } = useQuery({
    queryKey: ["/api/users", selectedUserId, "course-access"],
    enabled: !!selectedUserId,
  });

  const grantAccessMutation = useMutation({
    mutationFn: async (data: { userId: number; courseId: number; accessType: string; expiryDate?: string }) => {
      return apiRequest(`/api/users/${data.userId}/grant-course-access`, {
        method: "POST",
        body: JSON.stringify({
          courseId: data.courseId,
          accessType: data.accessType,
          expiryDate: data.expiryDate,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", selectedUserId, "course-access"] });
      setSelectedCourseId(0);
      setExpiryDate("");
    },
  });

  const revokeAccessMutation = useMutation({
    mutationFn: async (data: { userId: number; courseId: number }) => {
      return apiRequest(`/api/users/${data.userId}/revoke-course-access/${data.courseId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", selectedUserId, "course-access"] });
    },
  });

  const handleGrantAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId && selectedCourseId) {
      grantAccessMutation.mutate({
        userId: selectedUserId,
        courseId: selectedCourseId,
        accessType,
        expiryDate: expiryDate || undefined,
      });
    }
  };

  const handleRevokeAccess = (courseId: number) => {
    if (selectedUserId) {
      revokeAccessMutation.mutate({
        userId: selectedUserId,
        courseId,
      });
    }
  };

  if (usersLoading || coursesLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Selection */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">انتخاب کاربر</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(users as any[]).map((user: any) => (
            <div
              key={user.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedUserId === user.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedUserId(user.id)}
            >
              <h3 className="font-medium text-gray-900">
                {user.name || user.username}
              </h3>
              <p className="text-sm text-gray-600">@{user.username}</p>
              <div className="mt-2 flex gap-2">
                <span className={`px-2 py-1 text-xs rounded ${
                  user.role === 'admin' 
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.role === 'admin' ? 'مدیر' : 'کاربر'}
                </span>
                <span className={`px-2 py-1 text-xs rounded ${
                  user.subscriptionStatus === 'vip'
                    ? 'bg-purple-100 text-purple-800'
                    : user.subscriptionStatus === 'premium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.subscriptionStatus === 'vip' ? 'ویژه' : 
                   user.subscriptionStatus === 'premium' ? 'پریمیوم' : 'رایگان'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedUserId && (
        <>
          {/* Grant Access Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">اعطای دسترسی دوره</h2>
            <form onSubmit={handleGrantAccess} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  انتخاب دوره
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                >
                  <option value={0}>انتخاب کنید...</option>
                  {(courses as any[]).map((course: any) => (
                    <option key={course.id} value={course.id}>
                      {course.title} - {course.accessLevel === 'free' ? 'رایگان' : 
                                       course.accessLevel === 'premium' ? 'پریمیوم' : 'ویژه'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع دسترسی
                </label>
                <select
                  value={accessType}
                  onChange={(e) => setAccessType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="granted">اعطا شده</option>
                  <option value="purchased">خریداری شده</option>
                  <option value="trial">آزمایشی</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاریخ انقضا (اختیاری)
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>

              <button
                type="submit"
                disabled={grantAccessMutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50"
              >
                {grantAccessMutation.isPending ? "در حال اعطا..." : "اعطای دسترسی"}
              </button>
            </form>
          </div>

          {/* Current Access */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">دسترسی‌های فعلی</h2>
            {accessLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : (userAccess as any[]).length === 0 ? (
              <p className="text-gray-600 text-center py-4">
                هیچ دسترسی‌ای برای این کاربر وجود ندارد
              </p>
            ) : (
              <div className="space-y-3">
                {(userAccess as any[]).map((access: any) => {
                  const course = (courses as any[]).find((c: any) => c.id === access.courseId);
                  return (
                    <div
                      key={access.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {course?.title || `دوره شماره ${access.courseId}`}
                        </h3>
                        <div className="flex gap-2 mt-1">
                          <span className="text-sm text-gray-600">
                            نوع: {access.accessType === 'granted' ? 'اعطا شده' : 
                                  access.accessType === 'purchased' ? 'خریداری شده' : 'آزمایشی'}
                          </span>
                          {access.expiryDate && (
                            <span className="text-sm text-gray-600">
                              انقضا: {new Date(access.expiryDate).toLocaleDateString('fa-IR')}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRevokeAccess(access.courseId)}
                        disabled={revokeAccessMutation.isPending}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm disabled:opacity-50"
                      >
                        لغو دسترسی
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}