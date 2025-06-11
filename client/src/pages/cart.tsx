import { useState } from "react";
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
  type: 'course' | 'project' | 'document';
  price: number;
  originalPrice?: number;
  quantity: number;
  image?: string;
  instructor?: string;
  duration?: string;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      title: "دوره کامل React و TypeScript",
      type: "course",
      price: 299000,
      originalPrice: 399000,
      quantity: 1,
      instructor: "محمد احمدی",
      duration: "۱۲ ساعت"
    },
    {
      id: 2,
      title: "پروژه سایت فروشگاهی",
      type: "project",
      price: 199000,
      quantity: 1,
      instructor: "علی رضایی",
      duration: "۸ ساعت"
    }
  ]);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
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

  const applyCoupon = () => {
    if (couponCode.trim()) {
      setAppliedCoupon(couponCode.trim());
      setCouponCode("");
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = appliedCoupon ? subtotal * 0.1 : 0; // 10% discount
  const shipping = subtotal > 500000 ? 0 : 25000; // Free shipping over 500k
  const total = subtotal - discount + shipping;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'course': return 'دوره';
      case 'project': return 'پروژه';
      case 'document': return 'کتاب';
      default: return type;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pb-20" dir="rtl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">سبد خرید</h1>
        <p className="text-gray-600">{cartItems.length} مورد در سبد خرید شما</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">سبد خرید خالی است</h3>
          <p className="text-gray-600 mb-4">هنوز هیچ محصولی به سبد خرید اضافه نکرده‌اید</p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            مشاهده محصولات
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="h-8 w-8 text-gray-400" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                            {getTypeLabel(item.type)}
                          </span>
                          {item.instructor && (
                            <span className="text-sm text-gray-600">
                              مدرس: {item.instructor}
                            </span>
                          )}
                        </div>
                        {item.duration && (
                          <p className="text-sm text-gray-600">
                            مدت زمان: {item.duration}
                          </p>
                        )}
                      </div>
                      
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="text-left">
                        {item.originalPrice && (
                          <div className="text-sm text-gray-500 line-through">
                            {formatPrice(item.originalPrice)}
                          </div>
                        )}
                        <div className="text-lg font-semibold text-gray-900">
                          {formatPrice(item.price)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Coupon */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Tag className="h-5 w-5" />
                کد تخفیف
              </h3>
              
              {appliedCoupon ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-green-700 font-medium">
                      کد "{appliedCoupon}" اعمال شد
                    </span>
                    <button
                      onClick={() => setAppliedCoupon(null)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="کد تخفیف را وارد کنید"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={applyCoupon}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    اعمال
                  </button>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">خلاصه سفارش</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">جمع کل:</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>تخفیف:</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Truck className="h-4 w-4" />
                    هزینه ارسال:
                  </span>
                  <span className="font-medium">
                    {shipping === 0 ? 'رایگان' : formatPrice(shipping)}
                  </span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>مبلغ نهایی:</span>
                    <span className="text-blue-600">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <CreditCard className="h-5 w-5" />
                ادامه فرآیند خرید
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Shipping Info */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">اطلاعات ارسال</span>
              </div>
              <p className="text-sm text-blue-700">
                برای خریدهای بالای ۵۰۰,۰۰۰ تومان، ارسال رایگان است.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}