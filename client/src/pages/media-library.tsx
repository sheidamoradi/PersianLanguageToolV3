import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Upload, X, Image, Video, File, Trash2, Eye, Copy } from "lucide-react";
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

export default function MediaLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: mediaFiles, isLoading } = useQuery<MediaFile[]>({
    queryKey: ["/api/media-library", searchQuery],
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('خطا در آپلود فایل');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media-library"] });
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
      const response = await fetch(`/api/media-library/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('خطا در حذف فایل');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media-library"] });
      setSelectedFile(null);
      toast({
        title: "موفقیت",
        description: "فایل حذف شد",
      });
    },
    onError: () => {
      toast({
        title: "خطا",
        description: "خطا در حذف فایل",
        variant: "destructive",
      });
    },
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 بایت';
    const k = 1024;
    const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (type.startsWith('video/')) return <Video className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "کپی شد",
      description: "آدرس فایل کپی شد",
    });
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

  const displayFiles = (mediaFiles as MediaFile[]) || sampleMediaFiles;
  const filteredFiles = displayFiles.filter((file: MediaFile) =>
    file.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Header */}
          <div className="border-b p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">کتابخانه رسانه</h1>
                <p className="text-gray-600 mt-1">مدیریت تصاویر، ویدیوها و فایل‌ها</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="جستجو در فایل‌ها..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                  <Upload className="h-4 w-4" />
                  آپلود فایل
                  <input
                    type="file"
                    accept="image/*,video/*,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex">
            {/* File Grid */}
            <div className="flex-1 p-6">
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredFiles.map((file: MediaFile) => (
                    <div
                      key={file.id}
                      className={`group relative border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                        selectedFile?.id === file.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedFile(file)}
                    >
                      <div className="aspect-square bg-gray-100 flex items-center justify-center">
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
                      <div className="p-2">
                        <p className="text-xs text-gray-900 truncate font-medium">
                          {file.originalName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyUrl(file.url);
                            }}
                            className="p-1 bg-black/50 text-white rounded hover:bg-black/70"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteMutation.mutate(file.id);
                            }}
                            className="p-1 bg-red-500/80 text-white rounded hover:bg-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            {selectedFile && (
              <div className="w-80 border-r bg-gray-50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">جزئیات فایل</h3>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Preview */}
                  <div className="aspect-square bg-white rounded-lg border p-4 flex items-center justify-center">
                    {selectedFile.type.startsWith('image/') ? (
                      <img
                        src={selectedFile.url}
                        alt={selectedFile.originalName}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="text-gray-400">
                        {getFileIcon(selectedFile.type)}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">نام فایل</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedFile.originalName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">نوع فایل</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedFile.type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">حجم</label>
                      <p className="text-sm text-gray-900 mt-1">{formatFileSize(selectedFile.size)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">آدرس فایل</label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="text"
                          value={selectedFile.url}
                          readOnly
                          className="flex-1 text-sm bg-gray-100 px-2 py-1 rounded border"
                        />
                        <button
                          onClick={() => copyUrl(selectedFile.url)}
                          className="p-1 text-gray-600 hover:text-gray-800"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={() => copyUrl(selectedFile.url)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      کپی آدرس
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(selectedFile.id)}
                      className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}