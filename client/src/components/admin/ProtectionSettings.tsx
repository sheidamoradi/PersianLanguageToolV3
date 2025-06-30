import { useState } from 'react';
import { Shield, Download, Eye, Copy, Printer, AlertTriangle } from 'lucide-react';

interface ProtectionSettingsProps {
  allowDownload?: boolean;
  allowScreenshot?: boolean;
  allowCopy?: boolean;
  allowPrint?: boolean;
  watermarkText?: string;
  protectionLevel?: 'none' | 'basic' | 'strict';
  onChange: (settings: {
    allowDownload: boolean;
    allowScreenshot: boolean;
    allowCopy: boolean;
    allowPrint: boolean;
    watermarkText: string;
    protectionLevel: 'none' | 'basic' | 'strict';
  }) => void;
}

export default function ProtectionSettings({
  allowDownload = true,
  allowScreenshot = true,
  allowCopy = true,
  allowPrint = true,
  watermarkText = '',
  protectionLevel = 'none',
  onChange
}: ProtectionSettingsProps) {
  const [settings, setSettings] = useState({
    allowDownload,
    allowScreenshot,
    allowCopy,
    allowPrint,
    watermarkText,
    protectionLevel
  });

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onChange(newSettings);
  };

  const protectionLevels = [
    { value: 'none', label: 'بدون حفاظت', description: 'هیچ محدودیتی اعمال نمی‌شود' },
    { value: 'basic', label: 'حفاظت پایه', description: 'محدودیت‌های اساسی اعمال می‌شود' },
    { value: 'strict', label: 'حفاظت سخت', description: 'بالاترین سطح حفاظت' }
  ];

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">تنظیمات حفاظت محتوا</h3>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          کنترل دسترسی و محافظت از محتوای آموزشی
        </p>
      </div>

      <div className="p-4 space-y-6">
        {/* سطح حفاظت */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            سطح حفاظت کلی
          </label>
          <div className="space-y-2">
            {protectionLevels.map((level) => (
              <label key={level.value} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="protectionLevel"
                  value={level.value}
                  checked={settings.protectionLevel === level.value}
                  onChange={(e) => handleSettingChange('protectionLevel', e.target.value)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900">{level.label}</div>
                  <div className="text-sm text-gray-600">{level.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* تنظیمات جزئی */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">تنظیمات جزئی</h4>
          
          {/* دانلود */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Download className="h-5 w-5 text-gray-600" />
              <div>
                <div className="font-medium text-gray-900">دانلود فایل</div>
                <div className="text-sm text-gray-600">امکان دانلود فایل‌های آموزشی</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.allowDownload}
                onChange={(e) => handleSettingChange('allowDownload', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* اسکرین‌شات */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-gray-600" />
              <div>
                <div className="font-medium text-gray-900">اسکرین‌شات</div>
                <div className="text-sm text-gray-600">امکان گرفتن اسکرین‌شات از محتوا</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.allowScreenshot}
                onChange={(e) => handleSettingChange('allowScreenshot', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* کپی متن */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Copy className="h-5 w-5 text-gray-600" />
              <div>
                <div className="font-medium text-gray-900">کپی متن</div>
                <div className="text-sm text-gray-600">امکان انتخاب و کپی کردن متن</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.allowCopy}
                onChange={(e) => handleSettingChange('allowCopy', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* چاپ */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Printer className="h-5 w-5 text-gray-600" />
              <div>
                <div className="font-medium text-gray-900">چاپ صفحه</div>
                <div className="text-sm text-gray-600">امکان چاپ کردن محتوا</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.allowPrint}
                onChange={(e) => handleSettingChange('allowPrint', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* واتر مارک */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            متن واتر مارک
          </label>
          <input
            type="text"
            value={settings.watermarkText}
            onChange={(e) => handleSettingChange('watermarkText', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="مثال: پیستاط - آموزش کشاورزی"
          />
          <p className="text-xs text-gray-500 mt-1">
            متن واتر مارک روی محتوا نمایش داده می‌شود
          </p>
        </div>

        {/* هشدار */}
        {settings.protectionLevel === 'strict' && (
          <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium text-yellow-800">توجه</div>
              <div className="text-yellow-700">
                در حالت حفاظت سخت، برخی از قابلیت‌های مرورگر محدود می‌شود که ممکن است تجربه کاربری را تحت تأثیر قرار دهد.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}