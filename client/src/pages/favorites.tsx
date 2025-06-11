import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  BookOpen, 
  Users, 
  FileText,
  Video,
  ShoppingCart,
  Eye,
  Download,
  Calendar,
  Trash2
} from "lucide-react";

interface FavoriteItem {
  id: number;
  title: string;
  description: string;
  type: 'course' | 'document' | 'magazine' | 'webinar';
  addedDate: string;
  image?: string;
  price?: number;
  author?: string;
  duration?: string;
  downloadCount?: number;
  viewCount?: number;
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([
    {
      id: 1,
      title: "کارگاه آموزش کشت گلخانه‌ای",
      description: "آموزش کامل کشت گلخانه‌ای از مقدماتی تا پیشرفته",
      type: 'course',
      addedDate: '1403/09/15',
      price: 150000,
      author: 'دکتر احمد کشاورزی',
      duration: '8 ساعت'
    },
    {
      id: 2,
      title: "راهنمای کامل کود آلی",
      description: "کتاب جامع تولید و استفاده از کودهای آلی",
      type: 'document',
      addedDate: '1403/09/12',
      price: 45000,
      author: 'استاد علی کمپوست',
      downloadCount: 320,
      viewCount: 1456
    },
    {
      id: 3,
      title: "فصلنامه رویش سبز - شماره ۴",
      description: "آخرین یافته‌های تحقیقاتی در زمینه کشاورزی پایدار",
      type: 'magazine',
      addedDate: '1403/09/10',
      price: 25000,
      viewCount: 892
    },
    {
      id: 4,
      title: "وبینار آبیاری هوشمند",
      description: "سیستم‌های نوین آبیاری و کنترل از راه دور",
      type: 'webinar',
      addedDate: '1403/09/08',
      price: 80000,
      author: 'مهندس مریم آبیاری',
      duration: '2 ساعت'
    }
  ]);

  const removeFromFavorites = (id: number) => {
    setFavorites(items => items.filter(item => item.id !== id));
  };

  const addToCart = (item: FavoriteItem) => {
    // اضافه کردن به سبد خرید
    console.log('Adding to cart:', item);
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'رایگان';
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  const getItemTypeLabel = (type: string) => {
    switch (type) {
      case 'course': return 'کارگاه';
      case 'document': return 'سند';
      case 'magazine': return 'فصلنامه';
      case 'webinar': return 'وبینار';
      default: return 'محصول';
    }
  };

  const getItemTypeColor = (type: string) => {
    switch (type) {
      case 'course': return 'bg-blue-100 text-blue-800';
      case 'document': return 'bg-green-100 text-green-800';
      case 'magazine': return 'bg-purple-100 text-purple-800';
      case 'webinar': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'course': return <Users className="h-5 w-5" />;
      case 'document': return <FileText className="h-5 w-5" />;
      case 'magazine': return <BookOpen className="h-5 w-5" />;
      case 'webinar': return <Video className="h-5 w-5" />;
      default: return <Heart className="h-5 w-5" />;
    }
  };

  const filterByType = (type: string) => {
    if (type === 'all') return favorites;
    return favorites.filter(item => item.type === type);
  };

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">لیست علاقه‌مندی‌ها خالی است</h2>
          <p className="text-muted-foreground mb-6">
            محصولات مورد علاقه خود را به این لیست اضافه کنید
          </p>
          <Button>
            شروع کاوش محصولات
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-right mb-2">علاقه‌مندی‌ها</h1>
        <p className="text-muted-foreground text-right">
          محصولات و محتوای مورد علاقه شما ({favorites.length} مورد)
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            همه ({favorites.length})
          </TabsTrigger>
          <TabsTrigger value="course">
            کارگاه‌ها ({filterByType('course').length})
          </TabsTrigger>
          <TabsTrigger value="document">
            اسناد ({filterByType('document').length})
          </TabsTrigger>
          <TabsTrigger value="magazine">
            فصلنامه ({filterByType('magazine').length})
          </TabsTrigger>
          <TabsTrigger value="webinar">
            وبینارها ({filterByType('webinar').length})
          </TabsTrigger>
        </TabsList>

        {['all', 'course', 'document', 'magazine', 'webinar'].map((tabValue) => (
          <TabsContent key={tabValue} value={tabValue} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filterByType(tabValue === 'all' ? 'all' : tabValue).map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getItemTypeColor(item.type)}`}>
                          {getItemIcon(item.type)}
                        </div>
                        <div>
                          <CardTitle className="text-lg mb-1">{item.title}</CardTitle>
                          <Badge className={getItemTypeColor(item.type)}>
                            {getItemTypeLabel(item.type)}
                          </Badge>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeFromFavorites(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription className="text-right">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {/* Metadata */}
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        {item.author && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{item.author}</span>
                          </div>
                        )}
                        {item.duration && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{item.duration}</span>
                          </div>
                        )}
                        {item.viewCount && (
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{item.viewCount}</span>
                          </div>
                        )}
                        {item.downloadCount && (
                          <div className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            <span>{item.downloadCount}</span>
                          </div>
                        )}
                      </div>

                      {/* Price and Date */}
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          اضافه شده: {item.addedDate}
                        </div>
                        <div className="font-semibold text-lg">
                          {formatPrice(item.price)}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                          مشاهده
                        </Button>
                        <Button 
                          className="flex-1"
                          onClick={() => addToCart(item)}
                        >
                          <ShoppingCart className="h-4 w-4 ml-1" />
                          افزودن به سبد
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filterByType(tabValue === 'all' ? 'all' : tabValue).length === 0 && (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  هیچ موردی در این دسته‌بندی موجود نیست
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}