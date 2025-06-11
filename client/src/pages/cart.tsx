import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard,
  Truck,
  Tag,
  ArrowRight
} from "lucide-react";

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  type: 'course' | 'document' | 'magazine';
  description?: string;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      title: "کارگاه آموزش کشت گلخانه‌ای",
      price: 150000,
      quantity: 1,
      type: 'course',
      description: "کارگاه جامع آموزش کشت گلخانه‌ای برای مبتدیان"
    },
    {
      id: 2,
      title: "راهنمای کامل کود آلی",
      price: 45000,
      quantity: 2,
      type: 'document',
      description: "کتاب الکترونیکی آموزش تولید و استفاده از کود آلی"
    },
    {
      id: 3,
      title: "فصلنامه رویش سبز - شماره ۴",
      price: 25000,
      quantity: 1,
      type: 'magazine',
      description: "آخرین شماره فصلنامه تخصصی کشاورزی"
    }
  ]);

  const [discountCode, setDiscountCode] = useState("");

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = 0; // محاسبه تخفیف
  const shipping = subtotal > 100000 ? 0 : 15000; // ارسال رایگان بالای ۱۰۰ هزار تومان
  const total = subtotal - discount + shipping;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  const getItemTypeLabel = (type: string) => {
    switch (type) {
      case 'course': return 'کارگاه';
      case 'document': return 'سند';
      case 'magazine': return 'فصلنامه';
      default: return 'محصول';
    }
  };

  const getItemTypeColor = (type: string) => {
    switch (type) {
      case 'course': return 'bg-blue-100 text-blue-800';
      case 'document': return 'bg-green-100 text-green-800';
      case 'magazine': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center py-12">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">سبد خرید شما خالی است</h2>
          <p className="text-muted-foreground mb-6">
            محصولات مورد علاقه خود را به سبد خرید اضافه کنید
          </p>
          <Button>
            <ArrowRight className="h-4 w-4 ml-2" />
            ادامه خرید
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-right mb-2">سبد خرید</h1>
        <p className="text-muted-foreground text-right">
          بررسی و نهایی کردن سفارش شما
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                    <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                        <Badge className={getItemTypeColor(item.type)}>
                          {getItemTypeLabel(item.type)}
                        </Badge>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="text-left">
                        <div className="font-semibold">{formatPrice(item.price * item.quantity)}</div>
                        {item.quantity > 1 && (
                          <div className="text-sm text-muted-foreground">
                            {formatPrice(item.price)} × {item.quantity}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>خلاصه سفارش</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>جمع کل:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>تخفیف:</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>هزینه ارسال:</span>
                <span>{shipping === 0 ? 'رایگان' : formatPrice(shipping)}</span>
              </div>
              
              {shipping === 0 && (
                <div className="text-sm text-green-600 flex items-center gap-1">
                  <Truck className="h-4 w-4" />
                  ارسال رایگان
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between font-bold text-lg">
                <span>مبلغ نهایی:</span>
                <span>{formatPrice(total)}</span>
              </div>
              
              {/* Discount Code */}
              <div className="space-y-2">
                <label className="text-sm font-medium">کد تخفیف</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="کد تخفیف"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="text-right"
                  />
                  <Button variant="outline">
                    <Tag className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Button className="w-full" size="lg">
                <CreditCard className="h-4 w-4 ml-2" />
                ادامه فرایند پرداخت
              </Button>
              
              <Button variant="outline" className="w-full">
                ادامه خرید
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}