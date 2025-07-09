import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Plus, Edit, Trash, X, Upload } from "lucide-react";

export default function WorkshopsTab() {
  const [showForm, setShowForm] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<any>(null);
  
  const { data: workshops = [], isLoading, error, refetch } = useQuery<any[]>({
    queryKey: ['/api/workshops']
  });
  
  console.log('Workshops data:', workshops, 'Loading:', isLoading, 'Error:', error);

  const createMutation = useMutation({
    mutationFn: (data: any) => 
      fetch('/api/workshops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workshops'] });
      refetch();
      setShowForm(false);
      setEditingWorkshop(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      fetch(`/api/workshops/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workshops'] });
      refetch();
      setShowForm(false);
      setEditingWorkshop(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => 
      fetch(`/api/workshops/${id}`, {
        method: 'DELETE'
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workshops'] });
      refetch();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get('title') as string;
    
    // Only require title - all other fields are optional
    if (!title?.trim()) {
      alert('عنوان کارگاه الزامی است');
      return;
    }
    
    const data = {
      title: title.trim(),
      description: formData.get('description') as string || '',
      posterUrl: formData.get('posterUrl') as string || '',
      eventDate: formData.get('eventDate') as string || '',
      location: formData.get('location') as string || '',
      instructor: formData.get('instructor') as string || '',
      duration: formData.get('duration') as string || '',
      capacity: parseInt(formData.get('capacity') as string) || 0,
      level: formData.get('level') as string || '',
      category: formData.get('category') as string || '',
      isActive: formData.get('isActive') === 'on',
      registrationOpen: formData.get('registrationOpen') === 'on',
    };

    if (editingWorkshop) {
      updateMutation.mutate({ id: editingWorkshop.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        خطا در بارگذاری کارگاه‌ها: {error.message}
        <button 
          onClick={() => refetch()} 
          className="block mx-auto mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">کارگاه‌های آموزشی</h3>
        <button
          onClick={() => {
            setEditingWorkshop(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          افزودن کارگاه جدید
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold">
              {editingWorkshop ? 'ویرایش کارگاه' : 'افزودن کارگاه جدید'}
            </h4>
            <button 
              onClick={() => {
                setShowForm(false);
                setEditingWorkshop(null);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">عنوان کارگاه</label>
                <input
                  name="title"
                  type="text"
                  defaultValue={editingWorkshop?.title || ''}
                  placeholder="عنوان کارگاه"
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">مدرس</label>
                <input
                  name="instructor"
                  type="text"
                  defaultValue={editingWorkshop?.instructor || ''}
                  placeholder="نام مدرس"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">توضیحات</label>
              <textarea
                name="description"
                defaultValue={editingWorkshop?.description || ''}
                placeholder="توضیحات کارگاه"
                rows={3}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">تاریخ برگزاری</label>
                <input
                  name="eventDate"
                  type="text"
                  defaultValue={editingWorkshop?.eventDate || ''}
                  placeholder="مثال: ۱۵ اردیبهشت ۱۴۰۳"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">مکان برگزاری</label>
                <input
                  name="location"
                  type="text"
                  defaultValue={editingWorkshop?.location || ''}
                  placeholder="مکان برگزاری"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">مدت زمان</label>
                <input
                  name="duration"
                  type="text"
                  defaultValue={editingWorkshop?.duration || ''}
                  placeholder="مثال: ۲ ساعت"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">ظرفیت</label>
                <input
                  name="capacity"
                  type="number"
                  defaultValue={editingWorkshop?.capacity || ''}
                  placeholder="تعداد شرکت‌کنندگان"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">سطح</label>
                <select
                  name="level"
                  defaultValue={editingWorkshop?.level || 'مبتدی'}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="مبتدی">مبتدی</option>
                  <option value="متوسط">متوسط</option>
                  <option value="پیشرفته">پیشرفته</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">دسته‌بندی</label>
                <input
                  name="category"
                  type="text"
                  defaultValue={editingWorkshop?.category || ''}
                  placeholder="دسته‌بندی کارگاه"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">تصویر پوستر</label>
                <div className="flex gap-2">
                  <input
                    name="posterUrl"
                    type="text"
                    defaultValue={editingWorkshop?.posterUrl || ''}
                    placeholder="آدرس تصویر پوستر"
                    className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => window.open('/admin-simple#media', '_blank')}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-1"
                  >
                    <Upload className="h-4 w-4" />
                    رسانه
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <input
                  name="isActive"
                  type="checkbox"
                  defaultChecked={editingWorkshop?.isActive ?? true}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label className="text-sm">فعال</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  name="registrationOpen"
                  type="checkbox"
                  defaultChecked={editingWorkshop?.registrationOpen ?? true}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label className="text-sm">ثبت‌نام باز</label>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingWorkshop(null);
                }}
                className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
              >
                انصراف
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {createMutation.isPending || updateMutation.isPending ? 'در حال ذخیره...' : 'ذخیره'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h4 className="font-semibold">کارگاه‌های موجود</h4>
        </div>
        <div className="divide-y">
          {workshops && workshops.map((workshop: any) => (
            <div key={workshop.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {workshop.posterUrl && (
                  <img
                    src={workshop.posterUrl}
                    alt={workshop.title}
                    className="w-16 h-16 object-contain bg-gray-100 rounded-lg"
                  />
                )}
                <div>
                  <h5 className="font-medium text-lg">{workshop.title}</h5>
                  {workshop.description && (
                    <p className="text-sm text-gray-600 mt-1">{workshop.description}</p>
                  )}
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    {workshop.instructor && <span>مدرس: {workshop.instructor}</span>}
                    {workshop.eventDate && <span>تاریخ: {workshop.eventDate}</span>}
                    {workshop.duration && <span>مدت: {workshop.duration}</span>}
                    {workshop.level && <span>سطح: {workshop.level}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${workshop.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                <div className={`w-2 h-2 rounded-full ${workshop.registrationOpen ? 'bg-blue-500' : 'bg-red-300'}`} />
                <button
                  onClick={() => {
                    setEditingWorkshop(workshop);
                    setShowForm(true);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteMutation.mutate(workshop.id)}
                  disabled={deleteMutation.isPending}
                  className="text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {(!workshops || workshops?.length === 0) && (
            <div className="p-8 text-center text-gray-500">
              هیچ کارگاهی یافت نشد. اولین کارگاه را اضافه کنید.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}