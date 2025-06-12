import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, Search, Image, FileText, Film, Music, Trash2, Copy, Download, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MediaFile {
  id: number;
  filename: string;
  originalName: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

export default function MediaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: mediaFiles, isLoading } = useQuery({
    queryKey: ["/api/admin/media", searchQuery],
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('خطا در آپلود فایل');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/media"] });
      setUploadDialogOpen(false);
      toast({
        title: "موفقیت",
        description: "فایل با موفقیت آپلود شد",
      });
    },
    onError: () => {
      toast({
        title: "خطا",
        description: "خطا در آپلود فایل",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('خطا در حذف فایل');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/media"] });
      toast({
        title: "موفقیت",
        description: "فایل با موفقیت حذف شد",
      });
    },
  });

  const handleFileUpload = (file: File) => {
    uploadMutation.mutate(file);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "کپی شد",
      description: "آدرس فایل در کلیپ‌بورد کپی شد",
    });
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (type.startsWith('video/')) return <Film className="w-4 h-4" />;
    if (type.startsWith('audio/')) return <Music className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 بایت';
    const k = 1024;
    const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Sample data for demonstration
  const sampleMediaFiles: MediaFile[] = [
    {
      id: 1,
      filename: "logo-pistach.png",
      originalName: "لوگو پیستاط.png",
      size: 45632,
      type: "image/png",
      url: "/uploads/logo-pistach.png",
      uploadedAt: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      filename: "course-agriculture.jpg",
      originalName: "دوره کشاورزی.jpg",
      size: 234567,
      type: "image/jpeg",
      url: "/uploads/course-agriculture.jpg",
      uploadedAt: "2024-01-14T15:45:00Z"
    },
    {
      id: 3,
      filename: "video-irrigation.mp4",
      originalName: "آموزش آبیاری.mp4",
      size: 15678901,
      type: "video/mp4",
      url: "/uploads/video-irrigation.mp4",
      uploadedAt: "2024-01-13T09:20:00Z"
    }
  ];

  const displayFiles = mediaFiles || sampleMediaFiles;
  const filteredFiles = displayFiles.filter(file => 
    file.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">مدیریت رسانه</h1>
          <p className="text-gray-600 mt-1">آپلود و مدیریت تصاویر، ویدیو و فایل‌ها</p>
        </div>
        
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Upload className="w-4 h-4 ml-2" />
              آپلود فایل
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>آپلود فایل جدید</DialogTitle>
              <DialogDescription>
                تصاویر، ویدیو، صوت یا اسناد خود را آپلود کنید
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">فایل را انتخاب کنید</p>
                <p className="text-sm text-gray-500 mb-4">یا فایل را اینجا بکشید</p>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    files.forEach(file => handleFileUpload(file));
                  }}
                  className="block w-full text-sm text-gray-500 file:ml-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="جستجو در فایل‌ها..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {filteredFiles.length} فایل
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg mb-2"></div>
              <div className="bg-gray-200 h-4 rounded mb-1"></div>
              <div className="bg-gray-200 h-3 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFiles.map((file) => (
            <Card key={file.id} className="group hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={file.url}
                      alt={file.originalName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400">
                      {getFileIcon(file.type)}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-sm text-gray-900 truncate" title={file.originalName}>
                    {file.originalName}
                  </h3>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatFileSize(file.size)}</span>
                    <Badge variant="secondary" className="text-xs">
                      {file.type.split('/')[0]}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2 rtl:space-x-reverse opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyUrl(file.url)}
                      className="flex-1 text-xs"
                    >
                      <Copy className="w-3 h-3 ml-1" />
                      کپی
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedFile(file)}
                      className="flex-1 text-xs"
                    >
                      <Eye className="w-3 h-3 ml-1" />
                      مشاهده
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(file.id)}
                      className="text-xs"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedFile && (
        <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedFile.originalName}</DialogTitle>
              <DialogDescription>
                جزئیات فایل و پیش‌نمایش
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {selectedFile.type.startsWith('image/') ? (
                  <img
                    src={selectedFile.url}
                    alt={selectedFile.originalName}
                    className="w-full rounded-lg border"
                  />
                ) : (
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    {getFileIcon(selectedFile.type)}
                    <span className="mr-2 text-gray-600">پیش‌نمایش در دسترس نیست</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>نام فایل</Label>
                  <p className="text-sm text-gray-600">{selectedFile.filename}</p>
                </div>
                
                <div>
                  <Label>نام اصلی</Label>
                  <p className="text-sm text-gray-600">{selectedFile.originalName}</p>
                </div>
                
                <div>
                  <Label>نوع فایل</Label>
                  <p className="text-sm text-gray-600">{selectedFile.type}</p>
                </div>
                
                <div>
                  <Label>حجم فایل</Label>
                  <p className="text-sm text-gray-600">{formatFileSize(selectedFile.size)}</p>
                </div>
                
                <div>
                  <Label>آدرس فایل</Label>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Input value={selectedFile.url} readOnly className="text-sm" />
                    <Button size="sm" onClick={() => handleCopyUrl(selectedFile.url)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <Button asChild>
                    <a href={selectedFile.url} download>
                      <Download className="w-4 h-4 ml-2" />
                      دانلود
                    </a>
                  </Button>
                  
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      deleteMutation.mutate(selectedFile.id);
                      setSelectedFile(null);
                    }}
                  >
                    <Trash2 className="w-4 h-4 ml-2" />
                    حذف فایل
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}