import { useState } from 'react';
import ContentProtection, { useDownloadControl } from '../components/protection/ContentProtection';
import { Download, Eye, Copy, Printer, Shield, ArrowRight, FileText, Video, BookOpen } from 'lucide-react';

// نمونه محتوای آموزشی
const sampleContent = {
  course: {
    id: 1,
    title: 'آموزش کاشت گوجه فرنگی',
    description: 'راهنمای کامل کاشت و پرورش گوجه فرنگی',
    allowDownload: false,
    allowScreenshot: false,
    allowCopy: true,
    allowPrint: false,
    watermarkText: 'پیستاط - آموزش کشاورزی',
    protectionLevel: 'strict' as 'none' | 'basic' | 'strict'
  },
  document: {
    id: 1,
    title: 'کتاب راهنمای کاشت',
    fileName: 'planting-guide.pdf',
    allowDownload: true,
    allowScreenshot: true,
    allowCopy: false,
    allowPrint: true,
    watermarkText: 'کپی رایت محفوظ - پیستاط',
    protectionLevel: 'basic' as 'none' | 'basic' | 'strict'
  },
  workshop: {
    id: 1,
    title: 'کارگاه عملی کاشت',
    videoUrl: 'sample-video.mp4',
    allowDownload: false,
    allowScreenshot: true,
    allowCopy: true,
    allowPrint: false,
    watermarkText: '',
    protectionLevel: 'none' as 'none' | 'basic' | 'strict'
  }
};

export default function ProtectedContentDemo() {
  const [selectedContent, setSelectedContent] = useState<'course' | 'document' | 'workshop'>('course');
  
  const currentContent = sampleContent[selectedContent];
  const { downloadFile } = useDownloadControl(currentContent.allowDownload);

  const handleDownload = () => {
    const fileName = selectedContent === 'course' ? 'course-materials.zip' :
                    selectedContent === 'document' ? 'planting-guide.pdf' :
                    'workshop-video.mp4';
    
    downloadFile(`/downloads/${fileName}`, fileName);
  };

  const getProtectionLevelText = (level: string) => {
    switch(level) {
      case 'none': return 'بدون حفاظت';
      case 'basic': return 'حفاظت پایه';
      case 'strict': return 'حفاظت سخت';
      default: return 'نامشخص';
    }
  };

  const getProtectionLevelColor = (level: string) => {
    switch(level) {
      case 'none': return 'bg-gray-100 text-gray-800';
      case 'basic': return 'bg-yellow-100 text-yellow-800';
      case 'strict': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">نمایش محتوای محافظت‌شده</h1>
              <p className="text-gray-600">مثال از سیستم کنترل دسترسی و حفاظت محتوا</p>
            </div>
          </div>

          {/* Content Type Selector */}
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedContent('course')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                selectedContent === 'course' 
                  ? 'bg-blue-100 border-blue-300 text-blue-800' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              دوره آموزشی
            </button>
            <button
              onClick={() => setSelectedContent('document')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                selectedContent === 'document' 
                  ? 'bg-blue-100 border-blue-300 text-blue-800' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FileText className="h-4 w-4" />
              سند آموزشی
            </button>
            <button
              onClick={() => setSelectedContent('workshop')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                selectedContent === 'workshop' 
                  ? 'bg-blue-100 border-blue-300 text-blue-800' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Video className="h-4 w-4" />
              کارگاه عملی
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Protection Settings Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">تنظیمات حفاظت</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">سطح حفاظت:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getProtectionLevelColor(currentContent.protectionLevel)}`}>
                  {getProtectionLevelText(currentContent.protectionLevel)}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">دانلود</span>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${currentContent.allowDownload ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">اسکرین‌شات</span>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${currentContent.allowScreenshot ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Copy className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">کپی متن</span>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${currentContent.allowCopy ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Printer className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">چاپ</span>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${currentContent.allowPrint ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
              </div>

              {currentContent.watermarkText && (
                <div className="pt-3 border-t">
                  <span className="text-sm text-gray-700">واتر مارک:</span>
                  <p className="text-xs text-gray-500 mt-1">{currentContent.watermarkText}</p>
                </div>
              )}
            </div>

            <button
              onClick={handleDownload}
              disabled={!currentContent.allowDownload}
              className={`w-full mt-4 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                currentContent.allowDownload
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Download className="h-4 w-4" />
              دانلود محتوا
            </button>
          </div>

          {/* Protected Content */}
          <div className="lg:col-span-2">
            <ContentProtection
              allowScreenshot={currentContent.allowScreenshot}
              allowCopy={currentContent.allowCopy}
              allowPrint={currentContent.allowPrint}
              watermarkText={currentContent.watermarkText}
              protectionLevel={currentContent.protectionLevel}
            >
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">{currentContent.title}</h2>
                  {selectedContent === 'course' && (
                    <p className="text-gray-600 mt-1">{'description' in currentContent ? currentContent.description : ''}</p>
                  )}
                </div>

                <div className="p-6">
                  {selectedContent === 'course' && (
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">محتوای دوره:</h3>
                      <div className="prose max-w-none text-gray-700">
                        <p>در این دوره آموزشی شما با مراحل کامل کاشت گوجه فرنگی آشنا خواهید شد:</p>
                        <ul className="list-disc mr-5 space-y-1">
                          <li>انتخاب بذر مناسب</li>
                          <li>آماده‌سازی خاک</li>
                          <li>زمان‌بندی کاشت</li>
                          <li>آبیاری صحیح</li>
                          <li>کنترل آفات</li>
                          <li>برداشت محصول</li>
                        </ul>
                        <p>این محتوا تحت حفاظت کپی رایت قرار دارد و هرگونه کپی برداری غیرمجاز پیگرد قانونی دارد.</p>
                      </div>
                    </div>
                  )}

                  {selectedContent === 'document' && (
                    <div className="space-y-4">
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-12 w-12 text-blue-600" />
                          <div>
                            <h4 className="font-medium text-gray-900">کتاب راهنمای کاشت</h4>
                            <p className="text-sm text-gray-600">PDF - 150 صفحه</p>
                          </div>
                        </div>
                      </div>
                      <div className="prose max-w-none text-gray-700">
                        <p>این کتاب راهنمای جامع شامل:</p>
                        <ul className="list-disc mr-5 space-y-1">
                          <li>اصول پایه کشاورزی</li>
                          <li>تکنیک‌های کاشت مدرن</li>
                          <li>مدیریت آب و خاک</li>
                          <li>کنترل بیولوژیکی آفات</li>
                        </ul>
                        <p className="text-sm text-gray-500 mt-4">
                          محتوای این سند محفوظ است و تحت قوانین کپی رایت قرار دارد.
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedContent === 'workshop' && (
                    <div className="space-y-4">
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Video className="h-12 w-12 text-green-600" />
                          <div>
                            <h4 className="font-medium text-gray-900">کارگاه عملی کاشت</h4>
                            <p className="text-sm text-gray-600">ویدیو آموزشی - 45 دقیقه</p>
                          </div>
                        </div>
                      </div>
                      <div className="prose max-w-none text-gray-700">
                        <p>در این کارگاه عملی شاهد خواهید بود:</p>
                        <ul className="list-disc mr-5 space-y-1">
                          <li>نمایش عملی کاشت بذر</li>
                          <li>تکنیک‌های آبیاری</li>
                          <li>شناسایی مراحل رشد</li>
                          <li>حل مشکلات رایج</li>
                        </ul>
                        <p className="text-sm text-gray-500 mt-4">
                          این ویدیو جهت استفاده شخصی در اختیار شما قرار می‌گیرد.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ContentProtection>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="bg-yellow-100 rounded-full p-1">
              <ArrowRight className="h-4 w-4 text-yellow-600" />
            </div>
            <div className="text-sm">
              <h4 className="font-medium text-yellow-800 mb-1">راهنمای استفاده:</h4>
              <ul className="text-yellow-700 space-y-1">
                <li>• محتوای بالا تحت حفاظت قرار دارد</li>
                <li>• بسته به تنظیمات، امکانات مختلف محدود شده‌اند</li>
                <li>• برای تست، سعی کنید اسکرین‌شات بگیرید یا متن را کپی کنید</li>
                <li>• در حالت سخت، ابزارهای توسعه‌دهنده نیز محدود می‌شوند</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}