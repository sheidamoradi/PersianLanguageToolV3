import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ColorPicker } from "@/components/ui/color-picker";
import { Switch } from "@/components/ui/switch";
import { Palette, Eye, Upload, Save } from "lucide-react";

export default function AppearancePage() {
  const [colors, setColors] = useState({
    primary: "#578057",
    secondary: "#9CB891",
    accent: "#B8E6B8",
    background: "#FAFAFA",
    text: "#1F2937"
  });

  const [logo, setLogo] = useState("");
  const [siteName, setSiteName] = useState("پیستاط");
  const [showBranding, setShowBranding] = useState(true);

  const handleColorChange = (colorKey: string, value: string) => {
    setColors(prev => ({
      ...prev,
      [colorKey]: value
    }));
  };

  const handleSave = () => {
    // Save appearance settings
    console.log("Saving appearance settings:", { colors, logo, siteName, showBranding });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ظاهر سایت</h1>
          <p className="text-gray-600 mt-1">تنظیمات ظاهری و برندینگ سایت</p>
        </div>
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
          <Save className="w-4 h-4 ml-2" />
          ذخیره تغییرات
        </Button>
      </div>

      <Tabs defaultValue="colors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="colors">رنگ‌ها</TabsTrigger>
          <TabsTrigger value="branding">برندینگ</TabsTrigger>
          <TabsTrigger value="layout">طرح‌بندی</TabsTrigger>
          <TabsTrigger value="preview">پیش‌نمایش</TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 ml-2" />
                تنظیمات رنگ
              </CardTitle>
              <CardDescription>
                رنگ‌های اصلی سایت و آیکون‌ها را تنظیم کنید
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="primary-color">رنگ اصلی (آیکون‌ها)</Label>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse mt-2">
                      <Input
                        id="primary-color"
                        type="color"
                        value={colors.primary}
                        onChange={(e) => handleColorChange('primary', e.target.value)}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={colors.primary}
                        onChange={(e) => handleColorChange('primary', e.target.value)}
                        placeholder="#578057"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="secondary-color">رنگ فرعی</Label>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse mt-2">
                      <Input
                        id="secondary-color"
                        type="color"
                        value={colors.secondary}
                        onChange={(e) => handleColorChange('secondary', e.target.value)}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={colors.secondary}
                        onChange={(e) => handleColorChange('secondary', e.target.value)}
                        placeholder="#9CB891"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="accent-color">رنگ تاکید</Label>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse mt-2">
                      <Input
                        id="accent-color"
                        type="color"
                        value={colors.accent}
                        onChange={(e) => handleColorChange('accent', e.target.value)}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={colors.accent}
                        onChange={(e) => handleColorChange('accent', e.target.value)}
                        placeholder="#B8E6B8"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="background-color">رنگ پس‌زمینه</Label>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse mt-2">
                      <Input
                        id="background-color"
                        type="color"
                        value={colors.background}
                        onChange={(e) => handleColorChange('background', e.target.value)}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={colors.background}
                        onChange={(e) => handleColorChange('background', e.target.value)}
                        placeholder="#FAFAFA"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="text-color">رنگ متن</Label>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse mt-2">
                      <Input
                        id="text-color"
                        type="color"
                        value={colors.text}
                        onChange={(e) => handleColorChange('text', e.target.value)}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={colors.text}
                        onChange={(e) => handleColorChange('text', e.target.value)}
                        placeholder="#1F2937"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">پیش‌نمایش رنگ‌ها</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(colors).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div
                        className="w-16 h-16 rounded-lg mx-auto mb-2 border"
                        style={{ backgroundColor: value }}
                      ></div>
                      <p className="text-sm text-gray-600 capitalize">{key}</p>
                      <p className="text-xs text-gray-400">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تنظیمات برند</CardTitle>
              <CardDescription>
                لوگو، نام سایت و تنظیمات برندینگ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="site-name">نام سایت</Label>
                <Input
                  id="site-name"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="پیستاط"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="logo-upload">لوگوی سایت</Label>
                <div className="mt-2 space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {logo ? (
                      <img src={logo} alt="لوگو" className="mx-auto h-20 object-contain" />
                    ) : (
                      <div>
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">فایل لوگو را انتخاب کنید</p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => setLogo(e.target?.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:ml-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-branding">نمایش برندینگ</Label>
                  <div className="text-sm text-gray-500">
                    نمایش نام و لوگوی سایت در هدر
                  </div>
                </div>
                <Switch
                  id="show-branding"
                  checked={showBranding}
                  onCheckedChange={setShowBranding}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تنظیمات طرح‌بندی</CardTitle>
              <CardDescription>
                طرح‌بندی صفحات و چیدمان عناصر
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-12 text-gray-500">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4"></div>
                <p>تنظیمات طرح‌بندی به زودی اضافه می‌شود</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 ml-2" />
                پیش‌نمایش تغییرات
              </CardTitle>
              <CardDescription>
                مشاهده تأثیر تغییرات روی ظاهر سایت
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-6" style={{ backgroundColor: colors.background }}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold" style={{ color: colors.text }}>
                      {siteName}
                    </h2>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: colors.primary }}
                      >
                        <span className="text-white text-sm">🎓</span>
                      </div>
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: colors.primary }}
                      >
                        <span className="text-white text-sm">📚</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border">
                    <h3 className="font-medium mb-2" style={{ color: colors.text }}>
                      نمونه کارت محتوا
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      این یک نمونه از محتوای سایت است که با رنگ‌های جدید نمایش داده می‌شود.
                    </p>
                    <button 
                      className="px-4 py-2 rounded text-white text-sm"
                      style={{ backgroundColor: colors.primary }}
                    >
                      دکمه نمونه
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}