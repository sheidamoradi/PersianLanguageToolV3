import { useState } from 'react';
import { Upload, Save, Eye, Settings, Users, FileText, Image, BarChart3, Home, X, Plus, Edit, Trash2, Copy, Calendar, Tag, Search, Filter } from 'lucide-react';
import RichTextEditor from '../components/editor/RichTextEditor';

export default function AdminPanel() {
  const [activeSection, setActiveSection] = useState('posts');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Post management states
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

  const menuItems = [
    { id: 'posts', title: 'نوشته‌ها', icon: FileText }
  ];

  const renderPosts = () => (
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
                        <Trash2 className="h-4 w-4" />
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

  const renderContent = () => {
    switch (activeSection) {
      case 'posts': 
        return renderPosts();
      default:
        return renderPosts();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">پنل مدیریت</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-4">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-right transition-colors ${
                  activeSection === item.id
                    ? 'bg-green-100 text-green-800 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5" />
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