import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Upload, Play, FileText } from 'lucide-react';
import { queryClient } from '../../lib/queryClient';

interface WebinarSection {
  id: number;
  webinarId: number;
  title: string;
  description?: string;
  content?: string;
  videoUrl?: string;
  presentationUrl?: string;
  documentUrl?: string;
  order: number;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Webinar {
  id: number;
  title: string;
}

export default function WebinarSectionsTab() {
  const [selectedWebinarId, setSelectedWebinarId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSection, setEditingSection] = useState<WebinarSection | null>(null);

  // Fetch webinars list
  const { data: webinars, isLoading: webinarsLoading } = useQuery<Webinar[]>({
    queryKey: ['/api/webinars'],
    select: (data) => data.map(w => ({ id: w.id, title: w.title }))
  });

  // Fetch sections for selected webinar
  const { data: sections, isLoading: sectionsLoading } = useQuery<WebinarSection[]>({
    queryKey: ['/api/webinars', selectedWebinarId, 'sections'],
    enabled: !!selectedWebinarId
  });

  // Create section mutation
  const createMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      description?: string;
      content?: string;
      videoUrl?: string;
      presentationUrl?: string;
      documentUrl?: string;
      order: number;
      isLocked: boolean;
    }) => {
      const response = await fetch(`/api/webinars/${selectedWebinarId}/sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('خطا در ایجاد بخش');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/webinars', selectedWebinarId, 'sections'] });
      queryClient.refetchQueries({ queryKey: ['/api/webinars', selectedWebinarId, 'sections'] });
      setShowForm(false);
      alert('بخش با موفقیت ایجاد شد');
    },
    onError: (error) => {
      console.error('Create error:', error);
      alert('خطا در ایجاد بخش');
    }
  });

  // Update section mutation
  const updateMutation = useMutation({
    mutationFn: async (data: {
      id: number;
      title: string;
      description?: string;
      content?: string;
      videoUrl?: string;
      presentationUrl?: string;
      documentUrl?: string;
      order: number;
      isLocked: boolean;
    }) => {
      const response = await fetch(`/api/webinars/${selectedWebinarId}/sections/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('خطا در ویرایش بخش');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/webinars', selectedWebinarId, 'sections'] });
      queryClient.refetchQueries({ queryKey: ['/api/webinars', selectedWebinarId, 'sections'] });
      setEditingSection(null);
      setShowForm(false);
      alert('بخش با موفقیت ویرایش شد');
    },
    onError: (error) => {
      console.error('Update error:', error);
      alert('خطا در ویرایش بخش');
    }
  });

  // Delete section mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/webinars/${selectedWebinarId}/sections/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('خطا در حذف بخش');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/webinars', selectedWebinarId, 'sections'] });
      queryClient.refetchQueries({ queryKey: ['/api/webinars', selectedWebinarId, 'sections'] });
      alert('بخش با موفقیت حذف شد');
    },
    onError: (error) => {
      console.error('Delete error:', error);
      alert('خطا در حذف بخش');
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string || undefined,
      content: formData.get('content') as string || undefined,
      videoUrl: formData.get('videoUrl') as string || undefined,
      presentationUrl: formData.get('presentationUrl') as string || undefined,
      documentUrl: formData.get('documentUrl') as string || undefined,
      order: parseInt(formData.get('order') as string) || 1,
      isLocked: formData.get('isLocked') === 'on'
    };

    if (editingSection) {
      updateMutation.mutate({ ...data, id: editingSection.id });
    } else {
      createMutation.mutate(data);
    }
  };

  if (webinarsLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">مدیریت بخش‌های وبینار</h3>
      </div>

      {/* Webinar Selection */}
      <div className="bg-white rounded-lg border p-4">
        <h4 className="font-medium mb-4">انتخاب وبینار</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {webinars?.map((webinar) => (
            <button
              key={webinar.id}
              onClick={() => setSelectedWebinarId(webinar.id)}
              className={`p-4 rounded-lg border text-right transition-colors ${
                selectedWebinarId === webinar.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h5 className="font-medium">{webinar.title}</h5>
            </button>
          ))}
        </div>
      </div>

      {/* Sections Management */}
      {selectedWebinarId && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">
              بخش‌های وبینار: {webinars?.find(w => w.id === selectedWebinarId)?.title}
            </h4>
            <button
              onClick={() => {
                setEditingSection(null);
                setShowForm(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              افزودن بخش جدید
            </button>
          </div>

          {/* Section Form */}
          {showForm && (
            <div className="bg-white rounded-lg border p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold">
                  {editingSection ? 'ویرایش بخش' : 'افزودن بخش جدید'}
                </h4>
                <button 
                  onClick={() => {
                    setShowForm(false);
                    setEditingSection(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">عنوان بخش *</label>
                    <input
                      type="text"
                      name="title"
                      required
                      defaultValue={editingSection?.title || ''}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">ترتیب</label>
                    <input
                      type="number"
                      name="order"
                      min="1"
                      defaultValue={editingSection?.order || (sections?.length || 0) + 1}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">توضیحات</label>
                  <textarea
                    name="description"
                    rows={3}
                    defaultValue={editingSection?.description || ''}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">محتوای متنی</label>
                  <textarea
                    name="content"
                    rows={4}
                    defaultValue={editingSection?.content || ''}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      <Play className="inline h-4 w-4 ml-1" />
                      آدرس ویدئو
                    </label>
                    <input
                      type="url"
                      name="videoUrl"
                      defaultValue={editingSection?.videoUrl || ''}
                      placeholder="/uploads/video.mp4"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      <FileText className="inline h-4 w-4 ml-1" />
                      آدرس ارائه
                    </label>
                    <input
                      type="url"
                      name="presentationUrl"
                      defaultValue={editingSection?.presentationUrl || ''}
                      placeholder="/uploads/presentation.pdf"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      <Upload className="inline h-4 w-4 ml-1" />
                      آدرس سند
                    </label>
                    <input
                      type="url"
                      name="documentUrl"
                      defaultValue={editingSection?.documentUrl || ''}
                      placeholder="/uploads/document.pdf"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isLocked"
                    id="isLocked"
                    defaultChecked={editingSection?.isLocked || false}
                    className="rounded"
                  />
                  <label htmlFor="isLocked" className="text-sm">قفل شده (نیاز به اشتراک)</label>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingSection(null);
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

          {/* Sections List */}
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <h4 className="font-semibold">بخش‌های موجود</h4>
            </div>
            
            {sectionsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="divide-y">
                {sections && sections.length > 0 ? (
                  sections
                    .sort((a, b) => a.order - b.order)
                    .map((section) => (
                    <div key={section.id} className="p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {section.order}
                          </span>
                          <h5 className="font-medium">{section.title}</h5>
                          {section.isLocked && (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                              قفل شده
                            </span>
                          )}
                        </div>
                        
                        {section.description && (
                          <p className="text-sm text-gray-600 mb-2">{section.description}</p>
                        )}
                        
                        <div className="flex gap-4 text-xs text-gray-500">
                          {section.videoUrl && (
                            <span className="flex items-center gap-1">
                              <Play className="h-3 w-3" />
                              ویدئو
                            </span>
                          )}
                          {section.presentationUrl && (
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              ارائه
                            </span>
                          )}
                          {section.documentUrl && (
                            <span className="flex items-center gap-1">
                              <Upload className="h-3 w-3" />
                              سند
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingSection(section);
                            setShowForm(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('آیا از حذف این بخش اطمینان دارید؟')) {
                              deleteMutation.mutate(section.id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <p>هیچ بخشی برای این وبینار وجود ندارد</p>
                    <button
                      onClick={() => {
                        setEditingSection(null);
                        setShowForm(true);
                      }}
                      className="mt-2 text-blue-600 hover:text-blue-800"
                    >
                      اولین بخش را اضافه کنید
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}