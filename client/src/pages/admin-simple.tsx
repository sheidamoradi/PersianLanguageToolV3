import { useState, useRef } from "react";
import { Users, FileText, Settings, BarChart3, Calendar, Image, Palette, Newspaper, Monitor, Volume2, Video, BookOpen, Menu, X, Search, Filter, Eye, EyeOff, Edit, Trash2, Plus, Save, Clock, Globe, Lock, Tag, Hash } from "lucide-react";
import RichTextEditor from '../components/editor/RichTextEditor';

interface AdminStats {
  totalCourses: number;
  totalWorkshops: number;
  totalPosts: number;
  totalMedia: number;
}

interface SlideItem {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  imageFile?: File;
  buttonText?: string;
  buttonUrl?: string;
  textPosition: 'center' | 'left' | 'right';
  textColor: string;
  overlayColor: string;
  overlayOpacity: number;
  isActive: boolean;
  order: number;
}

interface PostItem {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  authorId: number;
  authorName: string;
  status: 'draft' | 'published' | 'scheduled';
  visibility: 'public' | 'private' | 'password';
  featuredImage?: string;
  categories: string[];
  tags: string[];
  publishedAt?: string;
  scheduledAt?: string;
  viewCount: number;
  likesCount: number;
  seoTitle?: string;
  seoDescription?: string;
  allowComments: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MediaItem {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  width?: number;
  height?: number;
  url: string;
  altText?: string;
  caption?: string;
  description?: string;
  uploadedBy: number;
  uploadedAt: string;
}

export default function AdminSimple() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Slider management states
  const [slides, setSlides] = useState<SlideItem[]>([
    {
      id: 1,
      title: 'به مرکز پیستاط خوش آمدید',
      description: 'بهترین دوره‌های آموزشی در حوزه کشاورزی',
      imageUrl: '',
      buttonText: 'مشاهده دوره‌ها',
      buttonUrl: '/courses',
      textPosition: 'center',
      textColor: '#1F2937',
      overlayColor: '#10B981',
      overlayOpacity: 20,
      isActive: true,
      order: 1
    }
  ]);
  const [showSlideForm, setShowSlideForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState<SlideItem | null>(null);

  // Posts management states
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState<PostItem | null>(null);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [postFormData, setPostFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    status: 'draft' as 'draft' | 'published' | 'scheduled',
    visibility: 'public' as 'public' | 'private' | 'password',
    featuredImage: '',
    categories: [] as string[],
    tags: [] as string[],
    publishedAt: '',
    scheduledAt: '',
    seoTitle: '',
    seoDescription: '',
    allowComments: true,
    isPinned: false
  });
  const [slideFormData, setSlideFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    buttonText: '',
    buttonUrl: '',
    textPosition: 'center' as 'center' | 'left' | 'right',
    textColor: '#1F2937',
    overlayColor: '#10B981',
    overlayOpacity: 20,
    isActive: true,
    order: 1
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Posts management functions
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const resetPostForm = () => {
    setPostFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      status: 'draft',
      visibility: 'public',
      featuredImage: '',
      categories: [],
      tags: [],
      publishedAt: '',
      scheduledAt: '',
      seoTitle: '',
      seoDescription: '',
      allowComments: true,
      isPinned: false
    });
    setEditingPost(null);
  };

  const handleSavePost = () => {
    if (!postFormData.title.trim()) {
      alert('لطفاً عنوان نوشته را وارد کنید');
      return;
    }

    const currentTime = new Date().toISOString();
    
    if (editingPost) {
      // Update existing post
      setPosts(prev => prev.map(post => 
        post.id === editingPost.id 
          ? { 
              ...post, 
              ...postFormData,
              slug: postFormData.slug || generateSlug(postFormData.title),
              updatedAt: currentTime
            }
          : post
      ));
    } else {
      // Add new post
      const newPost: PostItem = {
        id: Date.now(),
        ...postFormData,
        slug: postFormData.slug || generateSlug(postFormData.title),
        authorId: 1, // Current user
        authorName: 'ادمین',
        viewCount: 0,
        likesCount: 0,
        createdAt: currentTime,
        updatedAt: currentTime
      };
      setPosts(prev => [newPost, ...prev]);
    }

    setShowPostForm(false);
    resetPostForm();
  };

  const handleEditPost = (post: PostItem) => {
    setEditingPost(post);
    setPostFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      status: post.status,
      visibility: post.visibility,
      featuredImage: post.featuredImage || '',
      categories: post.categories,
      tags: post.tags,
      publishedAt: post.publishedAt || '',
      scheduledAt: post.scheduledAt || '',
      seoTitle: post.seoTitle || '',
      seoDescription: post.seoDescription || '',
      allowComments: post.allowComments,
      isPinned: post.isPinned
    });
    setShowPostForm(true);
  };

  const handleDeletePost = (id: number) => {
    if (confirm('آیا از حذف این نوشته اطمینان دارید؟')) {
      setPosts(prev => prev.filter(post => post.id !== id));
    }
  };

  const handleDuplicatePost = (post: PostItem) => {
    const duplicatedPost: PostItem = {
      ...post,
      id: Date.now(),
      title: `کپی از ${post.title}`,
      slug: `copy-${post.slug}-${Date.now()}`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setPosts(prev => [duplicatedPost, ...prev]);
  };

  const addCategoryToPost = (category: string) => {
    if (category.trim() && !postFormData.categories.includes(category.trim())) {
      setPostFormData(prev => ({
        ...prev,
        categories: [...prev.categories, category.trim()]
      }));
    }
  };

  const removeCategoryFromPost = (category: string) => {
    setPostFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat !== category)
    }));
  };

  const addTagToPost = (tag: string) => {
    if (tag.trim() && !postFormData.tags.includes(tag.trim())) {
      setPostFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const removeTagFromPost = (tag: string) => {
    setPostFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  // Slider management functions
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSlideFormData(prev => ({
          ...prev,
          imageUrl: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetSlideForm = () => {
    setSlideFormData({
      title: '',
      description: '',
      imageUrl: '',
      buttonText: '',
      buttonUrl: '',
      textPosition: 'center',
      textColor: '#1F2937',
      overlayColor: '#10B981',
      overlayOpacity: 20,
      isActive: true,
      order: slides.length + 1
    });
    setEditingSlide(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveSlide = () => {
    if (!slideFormData.title.trim()) {
      alert('لطفاً عنوان اسلاید را وارد کنید');
      return;
    }

    if (editingSlide) {
      // Update existing slide
      setSlides(prev => prev.map(slide => 
        slide.id === editingSlide.id 
          ? { ...slide, ...slideFormData }
          : slide
      ));
    } else {
      // Add new slide
      const newSlide: SlideItem = {
        id: Date.now(),
        ...slideFormData
      };
      setSlides(prev => [...prev, newSlide]);
    }

    setShowSlideForm(false);
    resetSlideForm();
  };

  const handleEditSlide = (slide: SlideItem) => {
    setEditingSlide(slide);
    setSlideFormData({
      title: slide.title,
      description: slide.description,
      imageUrl: slide.imageUrl || '',
      buttonText: slide.buttonText || '',
      buttonUrl: slide.buttonUrl || '',
      textPosition: slide.textPosition,
      textColor: slide.textColor,
      overlayColor: slide.overlayColor,
      overlayOpacity: slide.overlayOpacity,
      isActive: slide.isActive,
      order: slide.order
    });
    setShowSlideForm(true);
  };

  const handleDeleteSlide = (id: number) => {
    if (confirm('آیا از حذف این اسلاید اطمینان دارید؟')) {
      setSlides(prev => prev.filter(slide => slide.id !== id));
    }
  };

  const handleToggleSlideStatus = (id: number) => {
    setSlides(prev => prev.map(slide => 
      slide.id === id 
        ? { ...slide, isActive: !slide.isActive }
        : slide
    ));
  };
  
  // Sample stats
  const stats: AdminStats = {
    totalCourses: 12,
    totalWorkshops: 8,
    totalPosts: 24,
    totalMedia: 156
  };

  const menuItems = [
    { id: 'dashboard', title: 'پیشخوان', icon: '🏠' },
    { id: 'courses', title: 'درس‌ها', icon: '📚' },
    { id: 'workshops', title: 'کارگاه‌ها', icon: '👥' },
    { id: 'posts', title: 'نوشته‌ها', icon: '📝' },
    { id: 'media', title: 'رسانه', icon: '🖼️' },
    { id: 'slider', title: 'اسلایدر', icon: '🎞️' },
    { id: 'appearance', title: 'ظاهر', icon: '🎨' },
    { id: 'settings', title: 'تنظیمات', icon: '⚙️' }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">پیشخوان</h1>
        <p className="text-gray-600 mt-1">مدیریت سیستم آموزشی پیستاط</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">کل درس‌ها</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
            </div>
            <span className="text-2xl">📚</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">کارگاه‌ها</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalWorkshops}</p>
            </div>
            <span className="text-2xl">👥</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">نوشته‌ها</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
            </div>
            <span className="text-2xl">📝</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">فایل‌های رسانه</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMedia}</p>
            </div>
            <span className="text-2xl">🖼️</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">اقدامات سریع</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => setActiveSection('posts')}
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mb-2">📝</span>
            <span className="text-sm font-medium">ایجاد نوشته</span>
          </button>
          
          <button 
            onClick={() => setActiveSection('media')}
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mb-2">📤</span>
            <span className="text-sm font-medium">آپلود رسانه</span>
          </button>
          
          <button 
            onClick={() => setActiveSection('appearance')}
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mb-2">🎨</span>
            <span className="text-sm font-medium">تنظیم ظاهر</span>
          </button>
          
          <button 
            onClick={() => setActiveSection('settings')}
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mb-2">⚙️</span>
            <span className="text-sm font-medium">تنظیمات</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderAppearance = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">ظاهر سایت</h1>
        <p className="text-gray-600 mt-1">تنظیمات ظاهری و رنگ‌بندی</p>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">تنظیمات رنگ آیکون‌ها</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رنگ اصلی آیکون‌ها (فعلی: سبز لوگو)
            </label>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <input
                type="color"
                defaultValue="#578057"
                className="w-16 h-10 border rounded cursor-pointer"
              />
              <span className="text-sm text-gray-600">#578057</span>
            </div>
          </div>
          
          <div className="pt-4">
            <h4 className="font-medium mb-3">پیش‌نمایش تغییرات:</h4>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <div className="flex items-center">
                <span className="text-2xl ml-2" style={{color: '#578057'}}>🎓</span>
                <span className="text-sm">کارگاه‌های آموزشی</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl ml-2" style={{color: '#578057'}}>🎬</span>
                <span className="text-sm">وبینار</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl ml-2" style={{color: '#578057'}}>📚</span>
                <span className="text-sm">کتابخانه</span>
              </div>
            </div>
          </div>
          
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
            ذخیره تغییرات
          </button>
        </div>
      </div>
    </div>
  );

  const renderMedia = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">مدیریت رسانه</h1>
          <p className="text-gray-600 mt-1">آپلود و مدیریت تصاویر و فایل‌ها</p>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
          آپلود فایل جدید
        </button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <span className="text-4xl mb-4 block">📤</span>
          <p className="text-lg font-medium text-gray-900 mb-2">آپلود فایل</p>
          <p className="text-sm text-gray-500 mb-4">فایل را اینجا بکشید یا کلیک کنید</p>
          <input
            type="file"
            multiple
            className="block w-full text-sm text-gray-500 file:ml-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-white rounded-lg border shadow-sm p-4">
            <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
              <span className="text-2xl">🖼️</span>
            </div>
            <p className="text-sm font-medium">تصویر نمونه {item}</p>
            <p className="text-xs text-gray-500">۱۲۳ کیلوبایت</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSlider = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">مدیریت اسلایدر</h1>
          <p className="text-gray-600 mt-1">اسلایدهای صفحه اصلی را مدیریت کنید</p>
        </div>
        <button 
          onClick={() => {
            setShowSlideForm(true);
            resetSlideForm();
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <span>+</span>
          افزودن اسلاید جدید
        </button>
      </div>

      {/* Slide Form */}
      {showSlideForm && (
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">
              {editingSlide ? 'ویرایش اسلاید' : 'افزودن اسلاید جدید'}
            </h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تصویر پس‌زمینه
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                {slideFormData.imageUrl ? (
                  <div className="space-y-4">
                    <img 
                      src={slideFormData.imageUrl} 
                      alt="پیش‌نمایش" 
                      className="max-h-48 mx-auto rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => setSlideFormData(prev => ({ ...prev, imageUrl: '' }))}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      حذف تصویر
                    </button>
                  </div>
                ) : (
                  <div>
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                      کلیک کنید یا تصویر را بکشید و رها کنید
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF تا 10MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  انتخاب فایل
                </button>
              </div>
            </div>

            {/* Text Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان اسلاید
                </label>
                <input
                  type="text"
                  value={slideFormData.title}
                  onChange={(e) => setSlideFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="عنوان اسلاید را وارد کنید"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  موقعیت متن
                </label>
                <select
                  value={slideFormData.textPosition}
                  onChange={(e) => setSlideFormData(prev => ({ ...prev, textPosition: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="center">وسط</option>
                  <option value="right">راست</option>
                  <option value="left">چپ</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                توضیحات
              </label>
              <textarea
                value={slideFormData.description}
                onChange={(e) => setSlideFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="توضیحات اسلاید را وارد کنید"
              />
            </div>

            {/* Button Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  متن دکمه
                </label>
                <input
                  type="text"
                  value={slideFormData.buttonText}
                  onChange={(e) => setSlideFormData(prev => ({ ...prev, buttonText: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="متن دکمه (اختیاری)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  لینک دکمه
                </label>
                <input
                  type="text"
                  value={slideFormData.buttonUrl}
                  onChange={(e) => setSlideFormData(prev => ({ ...prev, buttonUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="آدرس لینک (اختیاری)"
                />
              </div>
            </div>

            {/* Style Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رنگ متن
                </label>
                <input
                  type="color"
                  value={slideFormData.textColor}
                  onChange={(e) => setSlideFormData(prev => ({ ...prev, textColor: e.target.value }))}
                  className="w-full h-10 rounded-md border border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رنگ پوشش
                </label>
                <input
                  type="color"
                  value={slideFormData.overlayColor}
                  onChange={(e) => setSlideFormData(prev => ({ ...prev, overlayColor: e.target.value }))}
                  className="w-full h-10 rounded-md border border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  شفافیت پوشش ({slideFormData.overlayOpacity}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={slideFormData.overlayOpacity}
                  onChange={(e) => setSlideFormData(prev => ({ ...prev, overlayOpacity: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Preview Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                پیش‌نمایش
              </label>
              <div 
                className="relative rounded-lg overflow-hidden h-48 flex items-center justify-center"
                style={{
                  backgroundImage: slideFormData.imageUrl ? `url(${slideFormData.imageUrl})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundColor: slideFormData.overlayColor,
                    opacity: slideFormData.overlayOpacity / 100
                  }}
                />
                <div className={`relative z-10 text-${slideFormData.textPosition} p-6`}>
                  <h3 
                    className="text-xl font-bold mb-2"
                    style={{ color: slideFormData.textColor }}
                  >
                    {slideFormData.title || 'عنوان اسلاید'}
                  </h3>
                  <p 
                    className="text-sm mb-4"
                    style={{ color: slideFormData.textColor }}
                  >
                    {slideFormData.description || 'توضیحات اسلاید'}
                  </p>
                  {slideFormData.buttonText && (
                    <button 
                      className="px-4 py-2 bg-white text-gray-800 rounded-lg text-sm"
                    >
                      {slideFormData.buttonText}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={slideFormData.isActive}
                  onChange={(e) => setSlideFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="isActive" className="mr-2 text-sm text-gray-700">
                  اسلاید فعال باشد
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowSlideForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  لغو
                </button>
                <button
                  type="button"
                  onClick={handleSaveSlide}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  {editingSlide ? 'بروزرسانی' : 'ذخیره'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slides List */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">اسلایدهای موجود</h2>
        </div>
        
        <div className="p-6">
          {slides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {slides.map(slide => (
                <div key={slide.id} className="border rounded-lg overflow-hidden">
                  <div 
                    className="h-32 bg-cover bg-center relative"
                    style={{
                      backgroundImage: slide.imageUrl ? `url(${slide.imageUrl})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}
                  >
                    <div 
                      className="absolute inset-0"
                      style={{
                        backgroundColor: slide.overlayColor,
                        opacity: slide.overlayOpacity / 100
                      }}
                    />
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        slide.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {slide.isActive ? 'فعال' : 'غیرفعال'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium mb-1">{slide.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{slide.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">ترتیب: {slide.order}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleSlideStatus(slide.id)}
                          className={`p-1 rounded ${
                            slide.isActive ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={slide.isActive ? 'غیرفعال کردن' : 'فعال کردن'}
                        >
                          {slide.isActive ? '⏸️' : '▶️'}
                        </button>
                        <button
                          onClick={() => handleEditSlide(slide)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="ویرایش"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteSlide(slide.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="حذف"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">🎞️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ اسلایدی یافت نشد</h3>
              <p className="text-gray-600">برای شروع، اسلاید جدیدی اضافه کنید</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return renderDashboard();
      case 'appearance': return renderAppearance();
      case 'media': return renderMedia();
      case 'slider': return renderSlider();
      case 'posts': 
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
            <h2 className="text-xl font-semibold">
              {editingPost ? 'ویرایش نوشته' : 'افزودن نوشته جدید'}
            </h2>
          </div>
          
          <div className="p-6">
            {/* Post Title and Meta */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان نوشته <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={postFormData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setPostFormData(prev => ({ 
                        ...prev, 
                        title,
                        slug: prev.slug || generateSlug(title)
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="عنوان نوشته را وارد کنید"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نامک (Slug)
                  </label>
                  <input
                    type="text"
                    value={postFormData.slug}
                    onChange={(e) => setPostFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="نامک خودکار تولید می‌شود"
                  />
                  <p className="text-xs text-gray-500 mt-1">آدرس نوشته: /posts/{postFormData.slug}</p>
                </div>

                {/* Content Editor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    محتوای نوشته
                  </label>
                  <RichTextEditor
                    content={postFormData.content}
                    onChange={(content) => setPostFormData(prev => ({ ...prev, content }))}
                    onImageInsert={() => setShowMediaLibrary(true)}
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    خلاصه نوشته
                  </label>
                  <textarea
                    value={postFormData.excerpt}
                    onChange={(e) => setPostFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="خلاصه‌ای از نوشته وارد کنید"
                  />
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Publish Settings */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    تنظیمات انتشار
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">وضعیت</label>
                      <select
                        value={postFormData.status}
                        onChange={(e) => setPostFormData(prev => ({ ...prev, status: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="draft">پیش‌نویس</option>
                        <option value="published">منتشر شده</option>
                        <option value="scheduled">زمان‌بندی شده</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">مرئیت</label>
                      <select
                        value={postFormData.visibility}
                        onChange={(e) => setPostFormData(prev => ({ ...prev, visibility: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="public">عمومی</option>
                        <option value="private">خصوصی</option>
                        <option value="password">محافظت شده با رمز</option>
                      </select>
                    </div>

                    {postFormData.status === 'scheduled' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">زمان انتشار</label>
                        <input
                          type="datetime-local"
                          value={postFormData.scheduledAt}
                          onChange={(e) => setPostFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isPinned"
                        checked={postFormData.isPinned}
                        onChange={(e) => setPostFormData(prev => ({ ...prev, isPinned: e.target.checked }))}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <label htmlFor="isPinned" className="text-sm text-gray-700">
                        نوشته ثابت (پین شده)
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="allowComments"
                        checked={postFormData.allowComments}
                        onChange={(e) => setPostFormData(prev => ({ ...prev, allowComments: e.target.checked }))}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <label htmlFor="allowComments" className="text-sm text-gray-700">
                        امکان نظردهی
                      </label>
                    </div>
                  </div>
                </div>

                {/* Featured Image */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    تصویر شاخص
                  </h3>
                  
                  {postFormData.featuredImage ? (
                    <div className="space-y-2">
                      <img 
                        src={postFormData.featuredImage} 
                        alt="تصویر شاخص" 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setPostFormData(prev => ({ ...prev, featuredImage: '' }))}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        حذف تصویر
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowMediaLibrary(true)}
                      className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors"
                    >
                      <Image className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">انتخاب تصویر شاخص</p>
                    </button>
                  )}
                </div>

                {/* Categories */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    دسته‌بندی‌ها
                  </h3>
                  
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="افزودن دسته‌بندی"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addCategoryToPost(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    
                    <div className="flex flex-wrap gap-1">
                      {postFormData.categories.map(category => (
                        <span 
                          key={category}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                          {category}
                          <button
                            type="button"
                            onClick={() => removeCategoryFromPost(category)}
                            className="hover:text-blue-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    برچسب‌ها
                  </h3>
                  
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="افزودن برچسب"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addTagToPost(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    
                    <div className="flex flex-wrap gap-1">
                      {postFormData.tags.map(tag => (
                        <span 
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTagFromPost(tag)}
                            className="hover:text-green-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SEO Settings */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3">تنظیمات سئو</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">عنوان سئو</label>
                      <input
                        type="text"
                        value={postFormData.seoTitle}
                        onChange={(e) => setPostFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="عنوان سئو (اختیاری)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات سئو</label>
                      <textarea
                        value={postFormData.seoDescription}
                        onChange={(e) => setPostFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="توضیحات سئو (اختیاری)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t mt-6">
              <button
                type="button"
                onClick={() => setShowPostForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                لغو
              </button>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPostFormData(prev => ({ ...prev, status: 'draft' }));
                    handleSavePost();
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  ذخیره پیش‌نویس
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPostFormData(prev => ({ ...prev, status: 'published' }));
                    handleSavePost();
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                >
                  {editingPost ? 'بروزرسانی' : 'انتشار'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">نوشته‌های موجود</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="جستجو در نوشته‌ها..."
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                <option value="">همه وضعیت‌ها</option>
                <option value="published">منتشر شده</option>
                <option value="draft">پیش‌نویس</option>
                <option value="scheduled">زمان‌بندی شده</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-lg">{post.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          post.status === 'published' ? 'bg-green-100 text-green-700' :
                          post.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {post.status === 'published' ? 'منتشر شده' :
                           post.status === 'draft' ? 'پیش‌نویس' : 'زمان‌بندی شده'}
                        </span>
                        {post.isPinned && (
                          <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                            ثابت
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-2">{post.excerpt}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>نویسنده: {post.authorName}</span>
                        <span>تاریخ ایجاد: {new Date(post.createdAt).toLocaleDateString('fa-IR')}</span>
                        <span>{post.viewCount} بازدید</span>
                        <span>{post.likesCount} پسند</span>
                      </div>
                      
                      {post.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {post.categories.map(category => (
                            <span 
                              key={category}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditPost(post)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="ویرایش"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicatePost(post)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded"
                        title="کپی"
                      >
                        📄
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ نوشته‌ای یافت نشد</h3>
              <p className="text-gray-600 mb-4">برای شروع، نوشته جدیدی اضافه کنید</p>
              <button
                onClick={() => {
                  setShowPostForm(true);
                  resetPostForm();
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                افزودن نوشته اول
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return renderDashboard();
      case 'appearance': return renderAppearance();
      case 'media': return renderMedia();
      case 'slider': return renderSlider();
      case 'posts': 
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
                  <h2 className="text-xl font-semibold">
                    {editingPost ? 'ویرایش نوشته' : 'افزودن نوشته جدید'}
                  </h2>
                </div>
                
                <div className="p-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      {/* Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          عنوان نوشته <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={postFormData.title}
                          onChange={(e) => {
                            const title = e.target.value;
                            setPostFormData(prev => ({ 
                              ...prev, 
                              title,
                              slug: prev.slug || generateSlug(title)
                            }));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                          placeholder="عنوان نوشته را وارد کنید"
                        />
                      </div>

                      {/* Content Editor */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          محتوای نوشته
                        </label>
                        <RichTextEditor
                          content={postFormData.content}
                          onChange={(content) => setPostFormData(prev => ({ ...prev, content }))}
                          onImageInsert={() => setShowMediaLibrary(true)}
                        />
                      </div>

                      {/* Excerpt */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          خلاصه نوشته
                        </label>
                        <textarea
                          value={postFormData.excerpt}
                          onChange={(e) => setPostFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                          placeholder="خلاصه‌ای از نوشته وارد کنید"
                        />
                      </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                      {/* Publish Settings */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-3 flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          تنظیمات انتشار
                        </h3>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">وضعیت</label>
                            <select
                              value={postFormData.status}
                              onChange={(e) => setPostFormData(prev => ({ ...prev, status: e.target.value as any }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            >
                              <option value="draft">پیش‌نویس</option>
                              <option value="published">منتشر شده</option>
                              <option value="scheduled">زمان‌بندی شده</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">مرئیت</label>
                            <select
                              value={postFormData.visibility}
                              onChange={(e) => setPostFormData(prev => ({ ...prev, visibility: e.target.value as any }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            >
                              <option value="public">عمومی</option>
                              <option value="private">خصوصی</option>
                              <option value="password">محافظت شده با رمز</option>
                            </select>
                          </div>

                          {postFormData.status === 'scheduled' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">زمان انتشار</label>
                              <input
                                type="datetime-local"
                                value={postFormData.scheduledAt}
                                onChange={(e) => setPostFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                              />
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="isPinned"
                              checked={postFormData.isPinned}
                              onChange={(e) => setPostFormData(prev => ({ ...prev, isPinned: e.target.checked }))}
                              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <label htmlFor="isPinned" className="text-sm text-gray-700">
                              نوشته ثابت (پین شده)
                            </label>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="allowComments"
                              checked={postFormData.allowComments}
                              onChange={(e) => setPostFormData(prev => ({ ...prev, allowComments: e.target.checked }))}
                              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <label htmlFor="allowComments" className="text-sm text-gray-700">
                              امکان نظردهی
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Categories */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-3 flex items-center gap-2">
                          <Hash className="h-4 w-4" />
                          دسته‌بندی‌ها
                        </h3>
                        
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="افزودن دسته‌بندی"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                addCategoryToPost(e.currentTarget.value);
                                e.currentTarget.value = '';
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          />
                          
                          <div className="flex flex-wrap gap-1">
                            {postFormData.categories.map(category => (
                              <span 
                                key={category}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                              >
                                {category}
                                <button
                                  type="button"
                                  onClick={() => removeCategoryFromPost(category)}
                                  className="hover:text-blue-900"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-3 flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          برچسب‌ها
                        </h3>
                        
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="افزودن برچسب"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                addTagToPost(e.currentTarget.value);
                                e.currentTarget.value = '';
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          />
                          
                          <div className="flex flex-wrap gap-1">
                            {postFormData.tags.map(tag => (
                              <span 
                                key={tag}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                              >
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => removeTagFromPost(tag)}
                                  className="hover:text-green-900"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center justify-between pt-6 border-t mt-6">
                    <button
                      type="button"
                      onClick={() => setShowPostForm(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      لغو
                    </button>
                    
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setPostFormData(prev => ({ ...prev, status: 'draft' }));
                          handleSavePost();
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        ذخیره پیش‌نویس
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPostFormData(prev => ({ ...prev, status: 'published' }));
                          handleSavePost();
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                      >
                        {editingPost ? 'بروزرسانی' : 'انتشار'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Posts List */}
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">نوشته‌های موجود</h2>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="جستجو در نوشته‌ها..."
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                    <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                      <option value="">همه وضعیت‌ها</option>
                      <option value="published">منتشر شده</option>
                      <option value="draft">پیش‌نویس</option>
                      <option value="scheduled">زمان‌بندی شده</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {posts.length > 0 ? (
                  <div className="space-y-4">
                    {posts.map(post => (
                      <div key={post.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium text-lg">{post.title}</h3>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                post.status === 'published' ? 'bg-green-100 text-green-700' :
                                post.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {post.status === 'published' ? 'منتشر شده' :
                                 post.status === 'draft' ? 'پیش‌نویس' : 'زمان‌بندی شده'}
                              </span>
                              {post.isPinned && (
                                <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                                  ثابت
                                </span>
                              )}
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-2">{post.excerpt}</p>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>نویسنده: {post.authorName}</span>
                              <span>تاریخ ایجاد: {new Date(post.createdAt).toLocaleDateString('fa-IR')}</span>
                              <span>{post.viewCount} بازدید</span>
                              <span>{post.likesCount} پسند</span>
                            </div>
                            
                            {post.categories.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {post.categories.map(category => (
                                  <span 
                                    key={category}
                                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                                  >
                                    {category}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditPost(post)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                              title="ویرایش"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDuplicatePost(post)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded"
                              title="کپی"
                            >
                              📄
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                              title="حذف"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto h-12 w-12 text-gray-400 mb-4">📝</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ نوشته‌ای یافت نشد</h3>
                    <p className="text-gray-600 mb-4">برای شروع، نوشته جدیدی اضافه کنید</p>
                    <button
                      onClick={() => {
                        setShowPostForm(true);
                        resetPostForm();
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      افزودن نوشته اول
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      default: 
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{menuItems.find(item => item.id === activeSection)?.title}</h1>
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <p className="text-gray-600">این بخش به زودی تکمیل می‌شود</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <svg width="32" height="32" viewBox="0 0 200 200">
                {/* Main dark green leaf */}
                <path d="M45 70 C45 45, 65 25, 90 25 C100 25, 108 30, 113 38 C118 30, 126 25, 136 25 C161 25, 181 45, 181 70 C181 95, 161 115, 136 115 C126 115, 118 110, 113 102 C108 110, 100 115, 90 115 C65 115, 45 95, 45 70 Z" 
                      fill="#578057"/>
                {/* Light green accent leaf */}
                <path d="M120 65 C120 50, 130 40, 145 40 C155 40, 163 45, 168 53 C173 45, 181 40, 191 40 C206 40, 216 50, 216 65 C216 80, 206 90, 191 90 C181 90, 173 85, 168 77 C163 85, 155 90, 145 90 C130 90, 120 80, 120 65 Z" 
                      fill="#9CB891"/>
                {/* Text "Pistat" */}
                <text x="100" y="140" 
                      textAnchor="middle" 
                      fontFamily="Arial, sans-serif" 
                      fontSize="16" 
                      fontWeight="bold" 
                      fill="#6B7280">Pistat</text>
                {/* Green underline */}
                <line x1="65" y1="150" x2="135" y2="150" stroke="#9CB891" strokeWidth="2"/>
                {/* Persian text "پیستاط" */}
                <text x="100" y="170" 
                      textAnchor="middle" 
                      fontFamily="Arial, sans-serif" 
                      fontSize="14" 
                      fill="#6B7280">پیستاط</text>
              </svg>
              <h1 className="text-xl font-bold text-gray-900">پنل مدیریت</h1>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="text-lg ml-3">{item.icon}</span>
                {item.title}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pr-64">
        {/* Mobile header */}
        <div className="bg-white shadow-sm border-b lg:hidden">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-lg font-semibold text-gray-900">پنل مدیریت</h1>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <span className="text-xl">☰</span>
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}