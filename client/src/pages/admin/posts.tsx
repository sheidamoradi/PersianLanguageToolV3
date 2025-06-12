import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Calendar, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: 'published' | 'draft' | 'pending';
  category: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  views: number;
}

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["/api/admin/posts", searchQuery, statusFilter],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('خطا در حذف نوشته');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/posts"] });
      toast({
        title: "موفقیت",
        description: "نوشته با موفقیت حذف شد",
      });
    },
  });

  // Sample data
  const samplePosts: Post[] = [
    {
      id: 1,
      title: "راهنمای کامل کشاورزی ارگانیک",
      slug: "organic-farming-guide",
      excerpt: "آموزش جامع کشاورزی ارگانیک برای مبتدیان و حرفه‌ای‌ها",
      content: "",
      status: "published",
      category: "آموزش",
      author: "مدیر سیستم",
      publishedAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
      views: 1250
    },
    {
      id: 2,
      title: "تکنیک‌های نوین آبیاری قطره‌ای",
      slug: "drip-irrigation-techniques",
      excerpt: "بررسی روش‌های مدرن آبیاری و مزایای آن",
      content: "",
      status: "published",
      category: "فناوری",
      author: "مدیر سیستم",
      publishedAt: "2024-01-14T15:45:00Z",
      updatedAt: "2024-01-14T15:45:00Z",
      views: 987
    },
    {
      id: 3,
      title: "مدیریت آفات به روش طبیعی",
      slug: "natural-pest-management",
      excerpt: "روش‌های طبیعی و سازگار با محیط زیست برای کنترل آفات",
      content: "",
      status: "draft",
      category: "آموزش",
      author: "مدیر سیستم",
      publishedAt: "",
      updatedAt: "2024-01-13T09:20:00Z",
      views: 0
    }
  ];

  const displayPosts = posts || samplePosts;
  const filteredPosts = displayPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { label: "منتشر شده", variant: "default" as const },
      draft: { label: "پیش‌نویس", variant: "secondary" as const },
      pending: { label: "در انتظار", variant: "outline" as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">نوشته‌ها</h1>
          <p className="text-gray-600 mt-1">مدیریت مقالات و محتوای سایت</p>
        </div>
        
        <Link href="/admin/posts/new">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 ml-2" />
            نوشته جدید
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>همه نوشته‌ها</CardTitle>
              <CardDescription>
                مدیریت و ویرایش نوشته‌های سایت
              </CardDescription>
            </div>
            
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="جستجو در نوشته‌ها..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 w-64"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="published">منتشر شده</option>
                <option value="draft">پیش‌نویس</option>
                <option value="pending">در انتظار</option>
              </select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="bg-gray-200 h-4 w-2/5 rounded"></div>
                  <div className="bg-gray-200 h-4 w-24 rounded"></div>
                  <div className="bg-gray-200 h-4 w-20 rounded"></div>
                  <div className="bg-gray-200 h-4 w-16 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>عنوان</TableHead>
                  <TableHead>دسته‌بندی</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>نویسنده</TableHead>
                  <TableHead>تاریخ انتشار</TableHead>
                  <TableHead>بازدید</TableHead>
                  <TableHead className="text-left">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{post.title}</div>
                        <div className="text-sm text-gray-500 mt-1">{post.excerpt}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{post.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(post.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="w-4 h-4 ml-2 text-gray-400" />
                        <span className="text-sm">{post.author}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 ml-2" />
                        {formatDate(post.publishedAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <Eye className="w-4 h-4 ml-2" />
                        {post.views.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/posts/${post.id}/edit`}>
                              <Edit className="w-4 h-4 ml-2" />
                              ویرایش
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/posts/${post.slug}`}>
                              <Eye className="w-4 h-4 ml-2" />
                              مشاهده
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deleteMutation.mutate(post.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {filteredPosts.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ نوشته‌ای یافت نشد</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery ? "جستجوی شما نتیجه‌ای نداشت" : "هنوز نوشته‌ای ایجاد نشده است"}
          </p>
          <Link href="/admin/posts/new">
            <Button>
              <Plus className="w-4 h-4 ml-2" />
              ایجاد اولین نوشته
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}