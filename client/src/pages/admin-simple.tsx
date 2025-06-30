import { useState, useRef } from "react";

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
            <h1 className="text-3xl font-bold text-gray-900">مدیریت نوشته‌ها</h1>
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <p className="text-gray-600">صفحه مدیریت نوشته‌ها به زودی تکمیل می‌شود</p>
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