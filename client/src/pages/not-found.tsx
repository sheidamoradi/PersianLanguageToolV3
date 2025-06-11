import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50" dir="rtl">
      <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <div className="flex mb-4 gap-2 items-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">۴۰۴ - صفحه پیدا نشد</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            صفحه‌ای که دنبال آن می‌گردید وجود ندارد.
          </p>
          
          <button 
            onClick={() => window.history.back()} 
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            بازگشت
          </button>
        </div>
      </div>
    </div>
  );
}
