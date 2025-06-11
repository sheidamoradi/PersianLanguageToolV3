import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { type Course, type Project, type Document, type MediaContent, type Magazine, type Article, type ArticleContent, type Slide, type Workshop, type WorkshopSection } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Edit, Eye, File, Folder, Image, Lock, LockOpen, MoreHorizontal, Plus, RefreshCw, Trash, Upload, Video } from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("courses");
  const { toast } = useToast();

  return (
    <div dir="rtl" className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-neutral-700">پنل مدیریت</h1>
        <Button variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          بروزرسانی
        </Button>
      </div>

      <Tabs defaultValue="courses" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid grid-cols-7 mb-8">
          <TabsTrigger value="courses">دوره‌ها</TabsTrigger>
          <TabsTrigger value="workshops">کارگاه‌های آموزشی</TabsTrigger>
          <TabsTrigger value="projects">وبینارها</TabsTrigger>
          <TabsTrigger value="magazines">فصلنامه رویش سبز</TabsTrigger>
          <TabsTrigger value="documents">اسناد</TabsTrigger>
          <TabsTrigger value="media">رسانه</TabsTrigger>
          <TabsTrigger value="slides">اسلایدر</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <CoursesTab />
        </TabsContent>

        <TabsContent value="workshops">
          <WorkshopsTab />
        </TabsContent>

        <TabsContent value="projects">
          <ProjectsTab />
        </TabsContent>

        <TabsContent value="magazines">
          <MagazinesTab />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentsTab />
        </TabsContent>

        <TabsContent value="media">
          <MediaTab />
        </TabsContent>

        <TabsContent value="slides">
          <SlidesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CoursesTab() {
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { toast } = useToast();

  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses']
  });

  const createCourseMutation = useMutation({
    mutationFn: (courseData: Omit<Course, 'id'>) => 
      apiRequest('/api/courses', { method: 'POST', body: JSON.stringify(courseData) }),
    onSuccess: () => {
      toast({ title: "دوره با موفقیت ایجاد شد", description: "دوره جدید شما به سیستم اضافه شد" });
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      setShowForm(false);
    },
    onError: (error) => {
      toast({ 
        title: "خطا در ایجاد دوره", 
        description: "لطفا دوباره تلاش کنید",
        variant: "destructive"
      });
    }
  });

  const handleAddCourse = () => {
    setFormMode('create');
    setSelectedCourse(null);
    setShowForm(true);
  };

  const handleEditCourse = (course: Course) => {
    setFormMode('edit');
    setSelectedCourse(course);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-neutral-700">مدیریت دوره‌ها</h2>
        <Button onClick={handleAddCourse} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          افزودن دوره جدید
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-72" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : showForm ? (
        <CourseForm 
          mode={formMode}
          course={selectedCourse}
          onCancel={() => setShowForm(false)}
          onSubmit={(data) => {
            if (formMode === 'create') {
              createCourseMutation.mutate(data as Omit<Course, 'id'>);
            } else {
              // Handle edit logic
              toast({ title: "ویرایش موفق", description: "دوره با موفقیت بروزرسانی شد" });
              setShowForm(false);
            }
          }}
        />
      ) : (
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>عنوان</TableHead>
                <TableHead>دسته‌بندی</TableHead>
                <TableHead>سطح</TableHead>
                <TableHead>مدول‌ها</TableHead>
                <TableHead>پیشرفت</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-neutral-400">
                    هیچ دوره‌ای یافت نشد. اولین دوره خود را اضافه کنید!
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell>{course.category || "-"}</TableCell>
                    <TableCell>{course.level || "-"}</TableCell>
                    <TableCell>{course.completedModules}/{course.totalModules}</TableCell>
                    <TableCell>{course.progress}%</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditCourse(course)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-red-500"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function WorkshopsTab() {
  const [showForm, setShowForm] = useState(false);
  const [showSections, setShowSections] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const { toast } = useToast();

  const { data: workshops = [], isLoading } = useQuery<Workshop[]>({
    queryKey: ['/api/workshops']
  });

  const createWorkshopMutation = useMutation({
    mutationFn: (workshopData: Omit<Workshop, 'id' | 'createdAt' | 'updatedAt'>) => 
      apiRequest('/api/workshops', { method: 'POST', body: JSON.stringify(workshopData) }),
    onSuccess: () => {
      toast({ title: "کارگاه با موفقیت ایجاد شد", description: "کارگاه جدید شما به سیستم اضافه شد" });
      queryClient.invalidateQueries({ queryKey: ['/api/workshops'] });
      setShowForm(false);
    },
    onError: (error) => {
      toast({ 
        title: "خطا در ایجاد کارگاه", 
        description: "لطفا دوباره تلاش کنید",
        variant: "destructive"
      });
    }
  });

  const updateWorkshopMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Workshop> }) => 
      apiRequest(`/api/workshops/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => {
      toast({ title: "کارگاه با موفقیت بروزرسانی شد" });
      queryClient.invalidateQueries({ queryKey: ['/api/workshops'] });
      setShowForm(false);
    },
    onError: (error) => {
      toast({ 
        title: "خطا در بروزرسانی کارگاه", 
        description: "لطفا دوباره تلاش کنید",
        variant: "destructive"
      });
    }
  });

  const deleteWorkshopMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest(`/api/workshops/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast({ title: "کارگاه با موفقیت حذف شد" });
      queryClient.invalidateQueries({ queryKey: ['/api/workshops'] });
    },
    onError: (error) => {
      toast({ 
        title: "خطا در حذف کارگاه", 
        description: "لطفا دوباره تلاش کنید",
        variant: "destructive"
      });
    }
  });

  const handleAddWorkshop = () => {
    setFormMode('create');
    setSelectedWorkshop(null);
    setShowForm(true);
    setShowSections(false);
  };

  const handleEditWorkshop = (workshop: Workshop) => {
    setFormMode('edit');
    setSelectedWorkshop(workshop);
    setShowForm(true);
    setShowSections(false);
  };

  const handleDeleteWorkshop = (id: number) => {
    if (window.confirm('آیا از حذف این کارگاه اطمینان دارید؟')) {
      deleteWorkshopMutation.mutate(id);
    }
  };

  const handleManageSections = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setShowSections(true);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-neutral-700">
          {showSections && selectedWorkshop 
            ? `بخش‌های کارگاه "${selectedWorkshop.title}"` 
            : "مدیریت کارگاه‌های آموزشی"}
        </h2>
        <div className="flex gap-2">
          {showSections && (
            <Button 
              onClick={() => setShowSections(false)} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              بازگشت به لیست کارگاه‌ها
            </Button>
          )}
          <Button 
            onClick={showSections && selectedWorkshop ? () => handleAddSection(selectedWorkshop.id) : handleAddWorkshop} 
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {showSections ? 'افزودن بخش جدید' : 'افزودن کارگاه جدید'}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-72" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : showForm ? (
        <WorkshopForm 
          mode={formMode}
          workshop={selectedWorkshop}
          onCancel={() => setShowForm(false)}
          onSubmit={(data) => {
            if (formMode === 'create') {
              createWorkshopMutation.mutate(data as Omit<Workshop, 'id' | 'createdAt' | 'updatedAt'>);
            } else if (selectedWorkshop) {
              updateWorkshopMutation.mutate({ 
                id: selectedWorkshop.id, 
                data 
              });
            }
          }}
        />
      ) : showSections && selectedWorkshop ? (
        <WorkshopSectionsManager workshopId={selectedWorkshop.id} />
      ) : (
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>عنوان</TableHead>
                <TableHead>مدرس</TableHead>
                <TableHead>دسته‌بندی</TableHead>
                <TableHead>سطح</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workshops.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-neutral-400">
                    هیچ کارگاهی یافت نشد. اولین کارگاه خود را اضافه کنید!
                  </TableCell>
                </TableRow>
              ) : (
                workshops.map((workshop) => (
                  <TableRow key={workshop.id}>
                    <TableCell className="font-medium">{workshop.title}</TableCell>
                    <TableCell>{workshop.instructor || "-"}</TableCell>
                    <TableCell>{workshop.category || "-"}</TableCell>
                    <TableCell>{workshop.level || "-"}</TableCell>
                    <TableCell>
                      {workshop.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          فعال
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          غیرفعال
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleManageSections(workshop)}
                          title="مدیریت بخش‌ها"
                        >
                          <Folder className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditWorkshop(workshop)}
                          title="ویرایش کارگاه"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-red-500"
                          onClick={() => handleDeleteWorkshop(workshop.id)}
                          title="حذف کارگاه"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );

  function handleAddSection(workshopId: number) {
    // This will be handled in WorkshopSectionsManager
  }
}

function WorkshopSectionsManager({ workshopId }: { workshopId: number }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedContent, setSelectedContent] = useState<any | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const { toast } = useToast();

  const { data: contents = [], isLoading } = useQuery<any[]>({
    queryKey: [`/api/workshops/${workshopId}/contents`]
  });

  const createContentMutation = useMutation({
    mutationFn: (contentData: any) => 
      apiRequest('/api/workshop-contents', { method: 'POST', body: JSON.stringify({
        ...contentData,
        workshopId
      }) }),
    onSuccess: () => {
      toast({ title: "محتوا با موفقیت ایجاد شد", description: "محتوای جدید شما به کارگاه اضافه شد" });
      queryClient.invalidateQueries({ queryKey: [`/api/workshops/${workshopId}/contents`] });
      setShowForm(false);
    },
    onError: (error) => {
      toast({ 
        title: "خطا در ایجاد محتوا", 
        description: "لطفا دوباره تلاش کنید",
        variant: "destructive"
      });
    }
  });

  const updateContentMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest(`/api/workshop-contents/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => {
      toast({ title: "محتوا با موفقیت بروزرسانی شد" });
      queryClient.invalidateQueries({ queryKey: [`/api/workshops/${workshopId}/contents`] });
      setShowForm(false);
    },
    onError: (error) => {
      toast({ 
        title: "خطا در بروزرسانی محتوا", 
        description: "لطفا دوباره تلاش کنید",
        variant: "destructive"
      });
    }
  });

  const deleteContentMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest(`/api/workshop-contents/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast({ title: "محتوا با موفقیت حذف شد" });
      queryClient.invalidateQueries({ queryKey: [`/api/workshops/${workshopId}/contents`] });
    },
    onError: (error) => {
      toast({ 
        title: "خطا در حذف محتوا", 
        description: "لطفا دوباره تلاش کنید",
        variant: "destructive"
      });
    }
  });

  const handleAddContent = () => {
    setFormMode('create');
    setSelectedContent(null);
    setShowForm(true);
  };

  const handleEditContent = (content: any) => {
    setFormMode('edit');
    setSelectedContent(content);
    setShowForm(true);
  };

  const handleDeleteContent = (id: number) => {
    if (window.confirm('آیا از حذف این محتوا اطمینان دارید؟')) {
      deleteContentMutation.mutate(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">محتوای کارگاه</h3>
        <Button 
          onClick={handleAddContent} 
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          افزودن محتوای جدید
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-72" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : showForm ? (
        <WorkshopContentForm 
          mode={formMode}
          content={selectedContent}
          workshopId={workshopId}
          onCancel={() => setShowForm(false)}
          onSubmit={(data) => {
            if (formMode === 'create') {
              createContentMutation.mutate(data);
            } else if (selectedContent) {
              updateContentMutation.mutate({ 
                id: selectedContent.id, 
                data 
              });
            }
          }}
        />
      ) : (
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>عنوان</TableHead>
                <TableHead>نوع محتوا</TableHead>
                <TableHead>ترتیب</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-neutral-400">
                    هیچ محتوایی یافت نشد. اولین محتوای خود را اضافه کنید!
                  </TableCell>
                </TableRow>
              ) : (
                contents
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((content) => (
                    <TableRow key={content.id}>
                      <TableCell className="font-medium">{content.title || "بدون عنوان"}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {content.contentType === 'text' ? 'متن' : 
                           content.contentType === 'video' ? 'ویدیو' : 
                           content.contentType === 'image' ? 'تصویر' : 
                           'سایر'}
                        </span>
                      </TableCell>
                      <TableCell>{content.order || 0}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditContent(content)}
                            title="ویرایش محتوا"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-red-500"
                            onClick={() => handleDeleteContent(content.id)}
                            title="حذف محتوا"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function WorkshopContentForm({ 
  mode = 'create', 
  content = null,
  workshopId,
  onCancel, 
  onSubmit 
}: { 
  mode?: 'create' | 'edit';
  content?: any | null;
  workshopId: number;
  onCancel: () => void;
  onSubmit: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    title: content?.title || '',
    content: content?.content || '',
    contentType: content?.contentType || 'text',
    order: content?.order || 1
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'افزودن محتوای جدید' : 'ویرایش محتوا'}</CardTitle>
        <CardDescription>
          {mode === 'create' 
            ? 'محتوای جدید کارگاه خود را وارد کنید.' 
            : 'محتوای کارگاه را ویرایش کنید.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان محتوا</Label>
                <Input 
                  id="title" 
                  placeholder="عنوان بخش..."
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contentType">نوع محتوا</Label>
                <Select 
                  value={formData.contentType} 
                  onValueChange={(value) => handleChange('contentType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="نوع محتوا را انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">متن</SelectItem>
                    <SelectItem value="video">ویدیو</SelectItem>
                    <SelectItem value="image">تصویر</SelectItem>
                    <SelectItem value="document">سند</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">ترتیب نمایش</Label>
                <Input 
                  id="order" 
                  type="number"
                  min={1}
                  value={formData.order}
                  onChange={(e) => handleChange('order', parseInt(e.target.value) || 1)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">محتوا *</Label>
                <Textarea 
                  id="content" 
                  placeholder="محتوای کارگاه را وارد کنید..."
                  value={formData.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  required
                  rows={8}
                  className="min-h-[200px]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-2 space-x-reverse">
            <Button type="button" variant="outline" onClick={onCancel}>انصراف</Button>
            <Button type="submit">{mode === 'create' ? 'ایجاد محتوا' : 'بروزرسانی'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function CourseForm({ 
  mode = 'create', 
  course = null, 
  onCancel, 
  onSubmit 
}: { 
  mode?: 'create' | 'edit';
  course?: Course | null;
  onCancel: () => void;
  onSubmit: (data: Partial<Course>) => void;
}) {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    thumbnailUrl: course?.thumbnailUrl || '',
    category: course?.category || '',
    level: course?.level || 'Beginner',
    isNew: course?.isNew || false,
    isPopular: course?.isPopular || false,
    totalModules: course?.totalModules || 0,
    completedModules: course?.completedModules || 0,
    progress: course?.progress || 0
  });

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'افزودن دوره جدید' : 'ویرایش دوره'}</CardTitle>
        <CardDescription>
          {mode === 'create' 
            ? 'اطلاعات دوره جدید خود را وارد کنید.' 
            : 'اطلاعات دوره را ویرایش کنید.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان دوره *</Label>
                <Input 
                  id="title" 
                  placeholder="برنامه‌نویسی وب مقدماتی"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">توضیحات *</Label>
                <Textarea 
                  id="description" 
                  placeholder="توضیحات دوره را وارد کنید..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  required
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnailUrl">آدرس تصویر</Label>
                <Input 
                  id="thumbnailUrl" 
                  placeholder="https://example.com/image.jpg"
                  value={formData.thumbnailUrl}
                  onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">دسته‌بندی</Label>
                <Input 
                  id="category" 
                  placeholder="توسعه وب"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">سطح</Label>
                <Select 
                  value={formData.level} 
                  onValueChange={(value) => handleChange('level', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="سطح دوره را انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">مبتدی</SelectItem>
                    <SelectItem value="Intermediate">متوسط</SelectItem>
                    <SelectItem value="Advanced">پیشرفته</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalModules">تعداد کل مدول‌ها</Label>
                <Input 
                  id="totalModules" 
                  type="number"
                  min={0}
                  value={formData.totalModules}
                  onChange={(e) => handleChange('totalModules', parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch 
                    id="isNew"
                    checked={formData.isNew}
                    onCheckedChange={(checked) => handleChange('isNew', checked)}
                  />
                  <Label htmlFor="isNew">نشان دادن به عنوان جدید</Label>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch 
                    id="isPopular"
                    checked={formData.isPopular}
                    onCheckedChange={(checked) => handleChange('isPopular', checked)}
                  />
                  <Label htmlFor="isPopular">نشان دادن به عنوان محبوب</Label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-2 space-x-reverse">
            <Button type="button" variant="outline" onClick={onCancel}>انصراف</Button>
            <Button type="submit">{mode === 'create' ? 'ایجاد دوره' : 'بروزرسانی'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function MagazinesTab() {
  const [showForm, setShowForm] = useState(false);
  const [showArticles, setShowArticles] = useState(false);
  const [selectedMagazine, setSelectedMagazine] = useState<Magazine | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const { toast } = useToast();

  const { data: magazines = [], isLoading } = useQuery<Magazine[]>({
    queryKey: ['/api/magazines']
  });

  const createMagazineMutation = useMutation({
    mutationFn: (magazineData: Omit<Magazine, 'id' | 'createdAt' | 'updatedAt'>) => 
      apiRequest('/api/magazines', { method: 'POST', body: JSON.stringify(magazineData) }),
    onSuccess: () => {
      toast({ title: "مجله با موفقیت ایجاد شد", description: "مجله جدید شما به سیستم اضافه شد" });
      queryClient.invalidateQueries({ queryKey: ['/api/magazines'] });
      setShowForm(false);
    },
    onError: (error) => {
      toast({ 
        title: "خطا در ایجاد مجله", 
        description: "لطفا دوباره تلاش کنید",
        variant: "destructive"
      });
    }
  });

  const updateMagazineMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Magazine> }) => 
      apiRequest(`/api/magazines/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => {
      toast({ title: "مجله با موفقیت بروزرسانی شد" });
      queryClient.invalidateQueries({ queryKey: ['/api/magazines'] });
      setShowForm(false);
    },
    onError: (error) => {
      toast({ 
        title: "خطا در بروزرسانی مجله", 
        description: "لطفا دوباره تلاش کنید",
        variant: "destructive"
      });
    }
  });

  const deleteMagazineMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest(`/api/magazines/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast({ title: "مجله با موفقیت حذف شد" });
      queryClient.invalidateQueries({ queryKey: ['/api/magazines'] });
    },
    onError: (error) => {
      toast({ 
        title: "خطا در حذف مجله", 
        description: "لطفا دوباره تلاش کنید",
        variant: "destructive"
      });
    }
  });

  const handleAddMagazine = () => {
    setFormMode('create');
    setSelectedMagazine(null);
    setShowForm(true);
    setShowArticles(false);
  };

  const handleEditMagazine = (magazine: Magazine) => {
    setFormMode('edit');
    setSelectedMagazine(magazine);
    setShowForm(true);
    setShowArticles(false);
  };

  const handleDeleteMagazine = (id: number) => {
    if (window.confirm('آیا از حذف این مجله اطمینان دارید؟')) {
      deleteMagazineMutation.mutate(id);
    }
  };

  const handleManageArticles = (magazine: Magazine) => {
    setSelectedMagazine(magazine);
    setShowArticles(true);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-neutral-700">
          {showArticles && selectedMagazine 
            ? `مقالات فصلنامه "${selectedMagazine.title}"` 
            : "مدیریت فصلنامه رویش سبز"}
        </h2>
        <div className="flex gap-2">
          {showArticles && (
            <Button 
              onClick={() => setShowArticles(false)} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              بازگشت به لیست فصلنامه‌ها
            </Button>
          )}
          <Button 
            onClick={showArticles && selectedMagazine ? () => handleAddArticle(selectedMagazine.id) : handleAddMagazine} 
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {showArticles ? 'افزودن مقاله جدید' : 'افزودن شماره جدید فصلنامه'}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-72" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : showForm ? (
        <MagazineForm 
          mode={formMode}
          magazine={selectedMagazine}
          onCancel={() => setShowForm(false)}
          onSubmit={(data) => {
            if (formMode === 'create') {
              createMagazineMutation.mutate(data as Omit<Magazine, 'id' | 'createdAt' | 'updatedAt'>);
            } else if (selectedMagazine) {
              updateMagazineMutation.mutate({ 
                id: selectedMagazine.id, 
                data 
              });
            }
          }}
        />
      ) : showArticles && selectedMagazine ? (
        <ArticlesManager magazineId={selectedMagazine.id} />
      ) : (
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>عنوان</TableHead>
                <TableHead>شماره</TableHead>
                <TableHead>تاریخ انتشار</TableHead>
                <TableHead>تعداد صفحات</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {magazines.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-neutral-400">
                    هیچ شماره‌ای از فصلنامه یافت نشد. اولین شماره را اضافه کنید!
                  </TableCell>
                </TableRow>
              ) : (
                magazines.map((magazine) => (
                  <TableRow key={magazine.id}>
                    <TableCell className="font-medium">{magazine.title}</TableCell>
                    <TableCell>{magazine.issueNumber || "-"}</TableCell>
                    <TableCell>{magazine.publishDate || "-"}</TableCell>
                    <TableCell>{magazine.totalPages || 0}</TableCell>
                    <TableCell>
                      {magazine.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          فعال
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          غیرفعال
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleManageArticles(magazine)}
                          title="مدیریت مقالات"
                        >
                          <File className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditMagazine(magazine)}
                          title="ویرایش مجله"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-red-500"
                          onClick={() => handleDeleteMagazine(magazine.id)}
                          title="حذف مجله"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function MagazineForm({ 
  mode = 'create', 
  magazine = null, 
  onCancel, 
  onSubmit 
}: { 
  mode?: 'create' | 'edit';
  magazine?: Magazine | null;
  onCancel: () => void;
  onSubmit: (data: Partial<Magazine>) => void;
}) {
  const [formData, setFormData] = useState({
    title: magazine?.title || '',
    description: magazine?.description || '',
    coverImageUrl: magazine?.coverImageUrl || '',
    issueNumber: magazine?.issueNumber || 0,
    publishDate: magazine?.publishDate || '',
    season: magazine?.season || '',
    year: magazine?.year || new Date().getFullYear(),
    totalPages: magazine?.totalPages || 0,
    pdfUrl: magazine?.pdfUrl || '',
    isActive: magazine?.isActive ?? true
  });

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'افزودن مجله جدید' : 'ویرایش مجله'}</CardTitle>
        <CardDescription>
          {mode === 'create' 
            ? 'اطلاعات مجله جدید خود را وارد کنید.' 
            : 'اطلاعات مجله را ویرایش کنید.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان مجله *</Label>
                <Input 
                  id="title" 
                  placeholder="مجله تخصصی آموزش"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">توضیحات</Label>
                <Textarea 
                  id="description" 
                  placeholder="توضیحات مجله را وارد کنید..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverImageUrl">آدرس تصویر جلد</Label>
                <Input 
                  id="coverImageUrl" 
                  placeholder="https://example.com/cover.jpg"
                  value={formData.coverImageUrl}
                  onChange={(e) => handleChange('coverImageUrl', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pdfUrl">آدرس فایل PDF</Label>
                <Input 
                  id="pdfUrl" 
                  placeholder="https://example.com/magazine.pdf"
                  value={formData.pdfUrl}
                  onChange={(e) => handleChange('pdfUrl', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issueNumber">شماره مجله</Label>
                  <Input 
                    id="issueNumber" 
                    type="number"
                    min={0}
                    value={formData.issueNumber}
                    onChange={(e) => handleChange('issueNumber', parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalPages">تعداد صفحات</Label>
                  <Input 
                    id="totalPages" 
                    type="number"
                    min={0}
                    value={formData.totalPages}
                    onChange={(e) => handleChange('totalPages', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="publishDate">تاریخ انتشار</Label>
                  <Input 
                    id="publishDate" 
                    placeholder="1402/01/01"
                    value={formData.publishDate}
                    onChange={(e) => handleChange('publishDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="season">فصل</Label>
                  <Select 
                    value={formData.season} 
                    onValueChange={(value) => handleChange('season', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="فصل را انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="بهار">بهار</SelectItem>
                      <SelectItem value="تابستان">تابستان</SelectItem>
                      <SelectItem value="پاییز">پاییز</SelectItem>
                      <SelectItem value="زمستان">زمستان</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">سال</Label>
                <Input 
                  id="year" 
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleChange('year', parseInt(e.target.value) || new Date().getFullYear())}
                />
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch 
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleChange('isActive', checked)}
                />
                <Label htmlFor="isActive">فعال</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-2 space-x-reverse">
            <Button type="button" variant="outline" onClick={onCancel}>انصراف</Button>
            <Button type="submit">{mode === 'create' ? 'ایجاد مجله' : 'بروزرسانی'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function ArticlesManager({ magazineId }: { magazineId: number }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const { toast } = useToast();

  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: [`/api/magazines/${magazineId}/articles`]
  });

  const createArticleMutation = useMutation({
    mutationFn: (articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) => 
      apiRequest('/api/articles', { method: 'POST', body: JSON.stringify(articleData) }),
    onSuccess: () => {
      toast({ title: "مقاله با موفقیت ایجاد شد", description: "مقاله جدید شما به سیستم اضافه شد" });
      queryClient.invalidateQueries({ queryKey: [`/api/magazines/${magazineId}/articles`] });
      setShowForm(false);
    },
    onError: (error) => {
      toast({ 
        title: "خطا در ایجاد مقاله", 
        description: "لطفا دوباره تلاش کنید",
        variant: "destructive"
      });
    }
  });

  const updateArticleMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Article> }) => 
      apiRequest(`/api/articles/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => {
      toast({ title: "مقاله با موفقیت بروزرسانی شد" });
      queryClient.invalidateQueries({ queryKey: [`/api/magazines/${magazineId}/articles`] });
      setShowForm(false);
    },
    onError: (error) => {
      toast({ 
        title: "خطا در بروزرسانی مقاله", 
        description: "لطفا دوباره تلاش کنید",
        variant: "destructive"
      });
    }
  });

  const deleteArticleMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest(`/api/articles/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast({ title: "مقاله با موفقیت حذف شد" });
      queryClient.invalidateQueries({ queryKey: [`/api/magazines/${magazineId}/articles`] });
    },
    onError: (error) => {
      toast({ 
        title: "خطا در حذف مقاله", 
        description: "لطفا دوباره تلاش کنید",
        variant: "destructive"
      });
    }
  });

  const handleAddArticle = () => {
    setFormMode('create');
    setSelectedArticle(null);
    setShowForm(true);
  };

  const handleEditArticle = (article: Article) => {
    setFormMode('edit');
    setSelectedArticle(article);
    setShowForm(true);
  };

  const handleDeleteArticle = (id: number) => {
    if (window.confirm('آیا از حذف این مقاله اطمینان دارید؟')) {
      deleteArticleMutation.mutate(id);
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-72" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : showForm ? (
        <ArticleForm 
          mode={formMode}
          article={selectedArticle}
          magazineId={magazineId}
          onCancel={() => setShowForm(false)}
          onSubmit={(data) => {
            if (formMode === 'create') {
              createArticleMutation.mutate({
                ...data,
                magazineId
              } as Omit<Article, 'id' | 'createdAt' | 'updatedAt'>);
            } else if (selectedArticle) {
              updateArticleMutation.mutate({ 
                id: selectedArticle.id, 
                data 
              });
            }
          }}
        />
      ) : (
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>عنوان</TableHead>
                <TableHead>نویسنده</TableHead>
                <TableHead>تاریخ انتشار</TableHead>
                <TableHead>ترتیب</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-neutral-400">
                    هیچ مقاله‌ای یافت نشد. اولین مقاله خود را اضافه کنید!
                  </TableCell>
                </TableRow>
              ) : (
                articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">{article.title}</TableCell>
                    <TableCell>{article.author || "-"}</TableCell>
                    <TableCell>{article.publishDate || "-"}</TableCell>
                    <TableCell>{article.order || 0}</TableCell>
                    <TableCell>
                      {article.isPublished ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          منتشر شده
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          پیش‌نویس
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          title="مشاهده مقاله"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditArticle(article)}
                          title="ویرایش مقاله"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-red-500"
                          onClick={() => handleDeleteArticle(article.id)}
                          title="حذف مقاله"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function ArticleForm({ 
  mode = 'create', 
  article = null,
  magazineId,
  onCancel, 
  onSubmit 
}: { 
  mode?: 'create' | 'edit';
  article?: Article | null;
  magazineId: number;
  onCancel: () => void;
  onSubmit: (data: Partial<Article>) => void;
}) {
  const [formData, setFormData] = useState({
    title: article?.title || '',
    author: article?.author || '',
    summary: article?.summary || '',
    publishDate: article?.publishDate || '',
    content: article?.content || '',
    featuredImageUrl: article?.featuredImageUrl || '',
    thumbnailUrl: article?.thumbnailUrl || '',
    readTime: article?.readTime || 0,
    pdfUrl: article?.pdfUrl || '',
    order: article?.order || 0,
    isPublished: article?.isPublished ?? false
  });

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'افزودن مقاله جدید' : 'ویرایش مقاله'}</CardTitle>
        <CardDescription>
          {mode === 'create' 
            ? 'اطلاعات مقاله جدید خود را وارد کنید.' 
            : 'اطلاعات مقاله را ویرایش کنید.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان مقاله *</Label>
                <Input 
                  id="title" 
                  placeholder="عنوان مقاله را وارد کنید"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">نویسنده</Label>
                <Input 
                  id="author" 
                  placeholder="نام نویسنده"
                  value={formData.author}
                  onChange={(e) => handleChange('author', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">خلاصه</Label>
                <Textarea 
                  id="summary" 
                  placeholder="خلاصه مقاله را وارد کنید..."
                  value={formData.summary}
                  onChange={(e) => handleChange('summary', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">محتوا</Label>
                <Textarea 
                  id="content" 
                  placeholder="محتوای اصلی مقاله را وارد کنید..."
                  value={formData.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="featuredImageUrl">آدرس تصویر شاخص</Label>
                <Input 
                  id="featuredImageUrl" 
                  placeholder="https://example.com/image.jpg"
                  value={formData.featuredImageUrl}
                  onChange={(e) => handleChange('featuredImageUrl', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnailUrl">آدرس تصویر بندانگشتی</Label>
                <Input 
                  id="thumbnailUrl" 
                  placeholder="https://example.com/thumbnail.jpg"
                  value={formData.thumbnailUrl}
                  onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pdfUrl">آدرس فایل PDF</Label>
                <Input 
                  id="pdfUrl" 
                  placeholder="https://example.com/article.pdf"
                  value={formData.pdfUrl}
                  onChange={(e) => handleChange('pdfUrl', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="publishDate">تاریخ انتشار</Label>
                  <Input 
                    id="publishDate" 
                    placeholder="1402/01/01"
                    value={formData.publishDate}
                    onChange={(e) => handleChange('publishDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="readTime">زمان مطالعه (دقیقه)</Label>
                  <Input 
                    id="readTime" 
                    type="number"
                    min={0}
                    value={formData.readTime}
                    onChange={(e) => handleChange('readTime', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">ترتیب</Label>
                <Input 
                  id="order" 
                  type="number"
                  min={0}
                  value={formData.order}
                  onChange={(e) => handleChange('order', parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch 
                  id="isPublished"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) => handleChange('isPublished', checked)}
                />
                <Label htmlFor="isPublished">منتشر شده</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-2 space-x-reverse">
            <Button type="button" variant="outline" onClick={onCancel}>انصراف</Button>
            <Button type="submit">{mode === 'create' ? 'ایجاد مقاله' : 'بروزرسانی'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function ProjectsTab() {
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const { data: projects = [], isLoading } = useQuery<Project[]>({ 
    queryKey: ['/api/projects'] 
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-neutral-700">مدیریت وبینارها</h2>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          افزودن وبینار جدید
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-72" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : showForm ? (
        <ProjectForm 
          onCancel={() => setShowForm(false)}
          onSubmit={(data) => {
            toast({ title: "پروژه با موفقیت ایجاد شد", description: "پروژه جدید شما به سیستم اضافه شد" });
            setShowForm(false);
          }}
        />
      ) : (
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>عنوان</TableHead>
                <TableHead>مدت زمان</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-neutral-400">
                    هیچ وبیناری یافت نشد. اولین وبینار خود را اضافه کنید!
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell>
                      {project.dueDate || 'نامحدود'}
                    </TableCell>
                    <TableCell>
                      {project.isLocked ? (
                        <span className="flex items-center text-amber-600">
                          <Lock className="h-4 w-4 mr-1" />
                          قفل شده
                        </span>
                      ) : (
                        <span className="flex items-center text-green-600">
                          <LockOpen className="h-4 w-4 mr-1" />
                          باز
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function ProjectForm({ 
  mode = 'create', 
  project = null, 
  onCancel, 
  onSubmit 
}: { 
  mode?: 'create' | 'edit';
  project?: Project | null;
  onCancel: () => void;
  onSubmit: (data: Partial<Project>) => void;
}) {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    thumbnailUrl: project?.thumbnailUrl || '',
    type: project?.type || 'project',
    contentUrl: project?.contentUrl || '',
    dueDate: project?.dueDate || '',
    pages: project?.pages || 0,
    isLocked: project?.isLocked || false
  });

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'افزودن وبینار جدید' : 'ویرایش وبینار'}</CardTitle>
        <CardDescription>
          {mode === 'create' 
            ? 'اطلاعات وبینار جدید خود را وارد کنید.' 
            : 'اطلاعات وبینار را ویرایش کنید.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان *</Label>
                <Input 
                  id="title" 
                  placeholder="وبینار آموزشی برنامه‌نویسی"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">توضیحات *</Label>
                <Textarea 
                  id="description" 
                  placeholder="توضیحات پروژه یا مجله را وارد کنید..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  required
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnailUrl">آدرس تصویر</Label>
                <Input 
                  id="thumbnailUrl" 
                  placeholder="https://example.com/image.jpg"
                  value={formData.thumbnailUrl}
                  onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="duration">مدت زمان وبینار</Label>
                <Input 
                  id="duration" 
                  placeholder="90 دقیقه"
                  value={formData.dueDate}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contentUrl">آدرس محتوا</Label>
                <Input 
                  id="contentUrl" 
                  placeholder="/documents/example.pdf"
                  value={formData.contentUrl}
                  onChange={(e) => handleChange('contentUrl', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contentUrl">لینک وبینار</Label>
                <Input 
                  id="contentUrl" 
                  placeholder="https://zoom.us/j/..."
                  value={formData.contentUrl}
                  onChange={(e) => handleChange('contentUrl', e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2 space-x-reverse pt-4">
                <Switch 
                  id="isLocked"
                  checked={formData.isLocked}
                  onCheckedChange={(checked) => handleChange('isLocked', checked)}
                />
                <Label htmlFor="isLocked">محدود کردن دسترسی (فقط برای کاربران ویژه)</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-2 space-x-reverse">
            <Button type="button" variant="outline" onClick={onCancel}>انصراف</Button>
            <Button type="submit">{mode === 'create' ? 'ایجاد' : 'بروزرسانی'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function DocumentsTab() {
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const { data: documents = [], isLoading } = useQuery<Document[]>({ 
    queryKey: ['/api/documents'] 
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-neutral-700">مدیریت اسناد</h2>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          افزودن سند جدید
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-72" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : showForm ? (
        <DocumentForm 
          onCancel={() => setShowForm(false)}
          onSubmit={(data) => {
            toast({ title: "سند با موفقیت ایجاد شد", description: "سند جدید شما به سیستم اضافه شد" });
            setShowForm(false);
          }}
        />
      ) : (
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>عنوان</TableHead>
                <TableHead>نام فایل</TableHead>
                <TableHead>نوع</TableHead>
                <TableHead>امکان دانلود</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-neutral-400">
                    هیچ سندی یافت نشد. اولین سند خود را اضافه کنید!
                  </TableCell>
                </TableRow>
              ) : (
                documents.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell className="font-medium">{document.title}</TableCell>
                    <TableCell>{document.fileName}</TableCell>
                    <TableCell>{document.fileType}</TableCell>
                    <TableCell>
                      {document.allowDownload ? (
                        <span className="text-green-600">فعال</span>
                      ) : (
                        <span className="text-red-600">غیرفعال</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function DocumentForm({ 
  mode = 'create', 
  document = null, 
  onCancel, 
  onSubmit 
}: { 
  mode?: 'create' | 'edit';
  document?: Document | null;
  onCancel: () => void;
  onSubmit: (data: Partial<Document>) => void;
}) {
  const [formData, setFormData] = useState({
    title: document?.title || '',
    fileName: document?.fileName || '',
    fileUrl: document?.fileUrl || '',
    fileType: document?.fileType || 'pdf',
    totalPages: document?.totalPages || 0,
    lastUpdated: document?.lastUpdated || new Date().toLocaleDateString('fa-IR'),
    allowDownload: document?.allowDownload || true
  });

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'افزودن سند جدید' : 'ویرایش سند'}</CardTitle>
        <CardDescription>
          {mode === 'create' 
            ? 'اطلاعات سند جدید خود را وارد کنید.' 
            : 'اطلاعات سند را ویرایش کنید.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان سند *</Label>
                <Input 
                  id="title" 
                  placeholder="راهنمای برنامه‌نویسی وب"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fileName">نام فایل *</Label>
                <Input 
                  id="fileName" 
                  placeholder="web-development-handbook.pdf"
                  value={formData.fileName}
                  onChange={(e) => handleChange('fileName', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fileUrl">آدرس فایل *</Label>
                <Input 
                  id="fileUrl" 
                  placeholder="/documents/example.pdf"
                  value={formData.fileUrl}
                  onChange={(e) => handleChange('fileUrl', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fileType">نوع فایل</Label>
                <Select 
                  value={formData.fileType} 
                  onValueChange={(value) => handleChange('fileType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="نوع فایل را انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="doc">DOC</SelectItem>
                    <SelectItem value="txt">TXT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="totalPages">تعداد صفحات</Label>
                <Input 
                  id="totalPages" 
                  type="number"
                  min={0}
                  value={formData.totalPages}
                  onChange={(e) => handleChange('totalPages', parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastUpdated">آخرین بروزرسانی</Label>
                <Input 
                  id="lastUpdated" 
                  value={formData.lastUpdated}
                  onChange={(e) => handleChange('lastUpdated', e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2 space-x-reverse pt-4">
                <Switch 
                  id="allowDownload"
                  checked={formData.allowDownload}
                  onCheckedChange={(checked) => handleChange('allowDownload', checked)}
                />
                <Label htmlFor="allowDownload">اجازه دانلود به کاربران</Label>
              </div>

              <div className="border-2 border-dashed border-neutral-200 rounded-lg p-4 text-center">
                <Input 
                  id="file-upload" 
                  type="file" 
                  className="hidden" 
                />
                <Label 
                  htmlFor="file-upload" 
                  className="cursor-pointer flex flex-col items-center justify-center gap-2 text-neutral-500"
                >
                  <Upload className="h-8 w-8" />
                  <span>برای آپلود فایل کلیک کنید یا فایل را اینجا رها کنید</span>
                  <span className="text-xs text-neutral-400">پشتیبانی از PDF، DOC، DOCX</span>
                </Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-2 space-x-reverse">
            <Button type="button" variant="outline" onClick={onCancel}>انصراف</Button>
            <Button type="submit">{mode === 'create' ? 'ایجاد سند' : 'بروزرسانی'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function MediaTab() {
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const { data: mediaContents = [], isLoading } = useQuery<MediaContent[]>({ 
    queryKey: ['/api/media'] 
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-neutral-700">مدیریت رسانه</h2>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          افزودن رسانه جدید
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-72" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : showForm ? (
        <MediaForm 
          onCancel={() => setShowForm(false)}
          onSubmit={(data) => {
            toast({ title: "رسانه با موفقیت ایجاد شد", description: "رسانه جدید شما به سیستم اضافه شد" });
            setShowForm(false);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mediaContents.length === 0 ? (
            <div className="col-span-full text-center py-8 bg-white rounded-lg shadow">
              <Video className="h-12 w-12 mx-auto text-neutral-300 mb-2" />
              <p className="text-neutral-400 mb-2">هیچ محتوای رسانه‌ای یافت نشد.</p>
              <Button onClick={() => setShowForm(true)} variant="outline">
                افزودن اولین رسانه
              </Button>
            </div>
          ) : (
            mediaContents.map((media) => (
              <Card key={media.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{media.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{media.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md bg-neutral-100 h-32 flex items-center justify-center mb-4">
                    {media.thumbnailUrl ? (
                      <img 
                        src={media.thumbnailUrl} 
                        alt={media.title} 
                        className="h-full w-full object-cover rounded-md" 
                      />
                    ) : (
                      <Video className="h-10 w-10 text-neutral-400" />
                    )}
                  </div>
                  <div className="flex items-center text-sm text-neutral-500 mb-2">
                    <span className="material-icons text-lg ml-1">person</span>
                    <span>{media.instructorName || 'بدون مدرس'}</span>
                    <span className="mx-2">•</span>
                    <span className="material-icons text-lg ml-1">schedule</span>
                    <span>{media.duration || '00:00'}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Edit className="h-3 w-3" />
                    ویرایش
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1 text-red-500">
                    <Trash className="h-3 w-3" />
                    حذف
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function MediaForm({ 
  mode = 'create', 
  media = null, 
  onCancel, 
  onSubmit 
}: { 
  mode?: 'create' | 'edit';
  media?: MediaContent | null;
  onCancel: () => void;
  onSubmit: (data: Partial<MediaContent>) => void;
}) {
  const [formData, setFormData] = useState({
    title: media?.title || '',
    description: media?.description || '',
    thumbnailUrl: media?.thumbnailUrl || '',
    contentUrl: media?.contentUrl || '',
    duration: media?.duration || '',
    instructorName: media?.instructorName || '',
    instructorTitle: media?.instructorTitle || '',
    instructorAvatar: media?.instructorAvatar || ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'افزودن رسانه جدید' : 'ویرایش رسانه'}</CardTitle>
        <CardDescription>
          {mode === 'create' 
            ? 'اطلاعات رسانه جدید خود را وارد کنید.' 
            : 'اطلاعات رسانه را ویرایش کنید.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان *</Label>
                <Input 
                  id="title" 
                  placeholder="معرفی فریم‌ورک‌های جاوااسکریپت"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">توضیحات</Label>
                <Textarea 
                  id="description" 
                  placeholder="توضیحات رسانه را وارد کنید..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnailUrl">آدرس تصویر</Label>
                <Input 
                  id="thumbnailUrl" 
                  placeholder="https://example.com/image.jpg"
                  value={formData.thumbnailUrl}
                  onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
                />
              </div>

              <div className="border-2 border-dashed border-neutral-200 rounded-lg p-4 text-center">
                <Input 
                  id="video-upload" 
                  type="file" 
                  className="hidden" 
                  accept="video/*,audio/*"
                />
                <Label 
                  htmlFor="video-upload" 
                  className="cursor-pointer flex flex-col items-center justify-center gap-2 text-neutral-500"
                >
                  <Upload className="h-8 w-8" />
                  <span>برای آپلود ویدیو/صوت کلیک کنید یا فایل را اینجا رها کنید</span>
                  <span className="text-xs text-neutral-400">پشتیبانی از MP4، MP3، WebM</span>
                </Label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contentUrl">آدرس محتوا *</Label>
                <Input 
                  id="contentUrl" 
                  placeholder="/media/video.mp4"
                  value={formData.contentUrl}
                  onChange={(e) => handleChange('contentUrl', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">مدت زمان</Label>
                <Input 
                  id="duration" 
                  placeholder="12:34"
                  value={formData.duration}
                  onChange={(e) => handleChange('duration', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructorName">نام مدرس</Label>
                <Input 
                  id="instructorName" 
                  placeholder="دکتر سارا جانسون"
                  value={formData.instructorName}
                  onChange={(e) => handleChange('instructorName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructorTitle">عنوان مدرس</Label>
                <Input 
                  id="instructorTitle" 
                  placeholder="مدرس برنامه‌نویسی وب"
                  value={formData.instructorTitle}
                  onChange={(e) => handleChange('instructorTitle', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructorAvatar">آدرس تصویر مدرس</Label>
                <Input 
                  id="instructorAvatar" 
                  placeholder="https://example.com/avatar.jpg"
                  value={formData.instructorAvatar}
                  onChange={(e) => handleChange('instructorAvatar', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-2 space-x-reverse">
            <Button type="button" variant="outline" onClick={onCancel}>انصراف</Button>
            <Button type="submit">{mode === 'create' ? 'ایجاد رسانه' : 'بروزرسانی'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function WorkshopForm({ 
  mode = 'create', 
  workshop = null, 
  onCancel, 
  onSubmit 
}: { 
  mode?: 'create' | 'edit';
  workshop?: Workshop | null;
  onCancel: () => void;
  onSubmit: (data: Partial<Workshop>) => void;
}) {
  const [formData, setFormData] = useState({
    title: workshop?.title || '',
    description: workshop?.description || '',
    posterUrl: workshop?.posterUrl || '',
    instructor: workshop?.instructor || '',
    category: workshop?.category || '',
    level: workshop?.level || 'مبتدی',
    duration: workshop?.duration || '',
    capacity: workshop?.capacity || 0,
    location: workshop?.location || '',
    eventDate: workshop?.eventDate || '',
    isActive: workshop?.isActive ?? true,
    registrationOpen: workshop?.registrationOpen ?? true
  });

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'افزودن کارگاه جدید' : 'ویرایش کارگاه'}</CardTitle>
        <CardDescription>
          {mode === 'create' 
            ? 'اطلاعات کارگاه آموزشی جدید خود را وارد کنید.' 
            : 'اطلاعات کارگاه آموزشی را ویرایش کنید.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان کارگاه *</Label>
                <Input 
                  id="title" 
                  placeholder="آبیاری درختان پسته"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">توضیحات کلی</Label>
                <Textarea 
                  id="description" 
                  placeholder="توضیحات کلی کارگاه را وارد کنید..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructor">مدرس</Label>
                <Input 
                  id="instructor" 
                  placeholder="نام مدرس"
                  value={formData.instructor}
                  onChange={(e) => handleChange('instructor', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="posterUrl">آدرس پوستر</Label>
                <Input 
                  id="posterUrl" 
                  placeholder="https://example.com/poster.jpg"
                  value={formData.posterUrl}
                  onChange={(e) => handleChange('posterUrl', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">دسته‌بندی</Label>
                  <Input 
                    id="category" 
                    placeholder="کشاورزی"
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">سطح</Label>
                  <Select 
                    value={formData.level} 
                    onValueChange={(value) => handleChange('level', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="سطح را انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="مبتدی">مبتدی</SelectItem>
                      <SelectItem value="متوسط">متوسط</SelectItem>
                      <SelectItem value="پیشرفته">پیشرفته</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">مدت زمان</Label>
                  <Input 
                    id="duration" 
                    placeholder="2 ساعت"
                    value={formData.duration}
                    onChange={(e) => handleChange('duration', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">ظرفیت</Label>
                  <Input 
                    id="capacity" 
                    type="number"
                    min={0}
                    value={formData.capacity}
                    onChange={(e) => handleChange('capacity', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">مکان برگزاری</Label>
                <Input 
                  id="location" 
                  placeholder="سالن کنفرانس مرکز پیستاط"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventDate">تاریخ برگزاری</Label>
                <Input 
                  id="eventDate" 
                  placeholder="1403/01/15"
                  value={formData.eventDate}
                  onChange={(e) => handleChange('eventDate', e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch 
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleChange('isActive', checked)}
                  />
                  <Label htmlFor="isActive">فعال</Label>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch 
                    id="registrationOpen"
                    checked={formData.registrationOpen}
                    onCheckedChange={(checked) => handleChange('registrationOpen', checked)}
                  />
                  <Label htmlFor="registrationOpen">ثبت‌نام باز</Label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-2 space-x-reverse">
            <Button type="button" variant="outline" onClick={onCancel}>انصراف</Button>
            <Button type="submit">{mode === 'create' ? 'ایجاد کارگاه' : 'بروزرسانی'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function SlidesTab() {
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);
  const { toast } = useToast();

  const { data: slides = [], isLoading } = useQuery<Slide[]>({
    queryKey: ['/api/slides']
  });

  const createSlideMutation = useMutation({
    mutationFn: (slideData: Omit<Slide, 'id' | 'createdAt' | 'updatedAt'>) => 
      apiRequest('/api/slides', { method: 'POST', body: JSON.stringify(slideData) }),
    onSuccess: () => {
      toast({ title: "اسلاید با موفقیت ایجاد شد", description: "اسلاید جدید شما به سیستم اضافه شد" });
      queryClient.invalidateQueries({ queryKey: ['/api/slides'] });
      setShowForm(false);
    },
    onError: (error) => {
      toast({ 
        title: "خطا در ایجاد اسلاید", 
        description: "لطفا دوباره تلاش کنید",
        variant: "destructive"
      });
    }
  });

  const updateSlideMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Slide> }) => 
      apiRequest(`/api/slides/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => {
      toast({ title: "اسلاید با موفقیت بروزرسانی شد" });
      queryClient.invalidateQueries({ queryKey: ['/api/slides'] });
      setShowForm(false);
    },
    onError: (error) => {
      toast({ 
        title: "خطا در بروزرسانی اسلاید", 
        description: "لطفا دوباره تلاش کنید",
        variant: "destructive"
      });
    }
  });

  const deleteSlideMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest(`/api/slides/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast({ title: "اسلاید با موفقیت حذف شد" });
      queryClient.invalidateQueries({ queryKey: ['/api/slides'] });
    },
    onError: (error) => {
      toast({ 
        title: "خطا در حذف اسلاید", 
        description: "لطفا دوباره تلاش کنید",
        variant: "destructive"
      });
    }
  });

  const handleAddSlide = () => {
    setFormMode('create');
    setSelectedSlide(null);
    setShowForm(true);
  };

  const handleEditSlide = (slide: Slide) => {
    setFormMode('edit');
    setSelectedSlide(slide);
    setShowForm(true);
  };

  const handleDeleteSlide = (id: number) => {
    if (window.confirm('آیا از حذف این اسلاید اطمینان دارید؟')) {
      deleteSlideMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(3).fill(0).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-72" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (showForm) {
    return (
      <SlideForm 
        mode={formMode}
        slide={selectedSlide}
        onCancel={() => setShowForm(false)}
        onSubmit={(data) => {
          if (formMode === 'create') {
            createSlideMutation.mutate(data as Omit<Slide, 'id' | 'createdAt' | 'updatedAt'>);
          } else if (selectedSlide) {
            updateSlideMutation.mutate({ 
              id: selectedSlide.id, 
              data 
            });
          }
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-neutral-700">مدیریت اسلایدها</h2>
        <Button onClick={handleAddSlide} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          اضافه کردن اسلاید
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>عنوان</TableHead>
              <TableHead>توضیحات</TableHead>
              <TableHead>متن دکمه</TableHead>
              <TableHead>ترتیب</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead>عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slides.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-neutral-400">
                  هیچ اسلایدی یافت نشد. اولین اسلاید خود را اضافه کنید!
                </TableCell>
              </TableRow>
            ) : (
              slides.map((slide) => (
                <TableRow key={slide.id}>
                  <TableCell className="font-medium">{slide.title}</TableCell>
                  <TableCell>{slide.description.substring(0, 50)}...</TableCell>
                  <TableCell>{slide.buttonText}</TableCell>
                  <TableCell>{slide.order || 0}</TableCell>
                  <TableCell>
                    {slide.isActive ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        فعال
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        غیرفعال
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEditSlide(slide)}
                        title="ویرایش اسلاید"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-red-500"
                        onClick={() => handleDeleteSlide(slide.id)}
                        title="حذف اسلاید"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function SlideForm({ 
  mode = 'create', 
  slide = null,
  onCancel, 
  onSubmit 
}: { 
  mode?: 'create' | 'edit';
  slide?: Slide | null;
  onCancel: () => void;
  onSubmit: (data: Partial<Slide>) => void;
}) {
  const [formData, setFormData] = useState({
    title: slide?.title || '',
    description: slide?.description || '',
    imageUrl: slide?.imageUrl || '',
    buttonText: slide?.buttonText || '',
    buttonUrl: slide?.buttonUrl || '',
    isActive: slide?.isActive ?? true,
    order: slide?.order || 0,
    gradientFrom: slide?.gradientFrom || 'primary/20',
    gradientTo: slide?.gradientTo || 'secondary/20',
    iconName: slide?.iconName || 'GraduationCap'
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'ایجاد اسلاید جدید' : 'ویرایش اسلاید'}</CardTitle>
        <CardDescription>
          اطلاعات اسلاید را وارد کنید. این اسلاید در صفحه اصلی نمایش داده خواهد شد.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان اسلاید</Label>
                <Input 
                  id="title" 
                  placeholder="عنوان اسلاید"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">توضیحات</Label>
                <Textarea 
                  id="description" 
                  placeholder="توضیحات اسلاید"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">آدرس تصویر (اختیاری)</Label>
                <Input 
                  id="imageUrl" 
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => handleChange('imageUrl', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="iconName">نام آیکون</Label>
                <Select 
                  value={formData.iconName} 
                  onValueChange={(value) => handleChange('iconName', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="آیکون را انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GraduationCap">کلاه فارغ‌التحصیلی</SelectItem>
                    <SelectItem value="BookOpen">کتاب باز</SelectItem>
                    <SelectItem value="Video">ویدیو</SelectItem>
                    <SelectItem value="Users">کاربران</SelectItem>
                    <SelectItem value="TrendingUp">رشد</SelectItem>
                    <SelectItem value="Calendar">تقویم</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="buttonText">متن دکمه</Label>
                <Input 
                  id="buttonText" 
                  placeholder="شروع کنید"
                  value={formData.buttonText}
                  onChange={(e) => handleChange('buttonText', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buttonUrl">لینک دکمه</Label>
                <Input 
                  id="buttonUrl" 
                  placeholder="/courses"
                  value={formData.buttonUrl}
                  onChange={(e) => handleChange('buttonUrl', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gradientFrom">رنگ شروع گرادیان</Label>
                  <Input 
                    id="gradientFrom" 
                    placeholder="primary/20"
                    value={formData.gradientFrom}
                    onChange={(e) => handleChange('gradientFrom', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gradientTo">رنگ پایان گرادیان</Label>
                  <Input 
                    id="gradientTo" 
                    placeholder="secondary/20"
                    value={formData.gradientTo}
                    onChange={(e) => handleChange('gradientTo', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">ترتیب نمایش</Label>
                <Input 
                  id="order" 
                  type="number"
                  min={0}
                  value={formData.order}
                  onChange={(e) => handleChange('order', parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch 
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleChange('isActive', checked)}
                />
                <Label htmlFor="isActive">فعال</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-2 space-x-reverse">
            <Button type="button" variant="outline" onClick={onCancel}>انصراف</Button>
            <Button type="submit">{mode === 'create' ? 'ایجاد اسلاید' : 'بروزرسانی'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
