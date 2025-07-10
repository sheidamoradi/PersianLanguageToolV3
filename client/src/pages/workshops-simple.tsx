import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Calendar, Clock, MapPin, Users, User, ArrowRight } from "lucide-react";
import { AuthGuard } from "@/components/AuthGuard";

export default function WorkshopsPage() {
  const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const { data: workshops = [], isLoading, error } = useQuery<any[]>({
    queryKey: ['/api/workshops'],
  });
  
  console.log('Workshops page - data:', workshops, 'loading:', isLoading, 'error:', error);

  const registerMutation = useMutation({
    mutationFn: ({ workshopId, formData }: { workshopId: number; formData: any }) => 
      fetch(`/api/workshops/${workshopId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      }).then(res => res.json()),
    onSuccess: () => {
      setShowRegistrationForm(false);
      setSelectedWorkshop(null);
      alert('ثبت‌نام شما با موفقیت انجام شد!');
    },
    onError: () => {
      alert('خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.');
    }
  });

  const handleRegister = (workshop: any) => {
    setSelectedWorkshop(workshop);
    setShowRegistrationForm(true);
  };

  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const registrationData = {
      userEmail: formData.get('userEmail') as string,
      userName: formData.get('userName') as string,
      userPhone: formData.get('userPhone') as string,
      notes: formData.get('notes') as string,
    };

    registerMutation.mutate({
      workshopId: selectedWorkshop.id,
      formData: registrationData
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری کارگاه‌ها...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <button 
          onClick={() => window.postMessage({ type: 'SHOW_HOME' }, '*')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowRight className="h-5 w-5" />
          بازگشت
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">کارگاه‌های آموزشی</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          در کارگاه‌های آموزشی ما، آخرین تکنیک‌ها و روش‌های کشاورزی مدرن را یاد بگیرید
        </p>
      </div>

      {/* Debug Info */}
      <div className="mb-4 p-4 bg-gray-100 rounded text-sm">
        <p>تعداد کل کارگاه‌ها: {workshops?.length || 0}</p>
        <p>تعداد فعال: {workshops?.filter((w: any) => w.isActive).length || 0}</p>
        <p>داده‌ها: {JSON.stringify(workshops?.map(w => ({id: w.id, title: w.title, isActive: w.isActive})))}</p>
      </div>

      {/* Workshops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {workshops && workshops
          .filter((workshop: any) => workshop.isActive)
          .map((workshop: any) => (
          <div key={workshop.id} className="bg-white rounded-lg shadow-md overflow-hidden border">
            {workshop.posterUrl && (
              <img
                src={workshop.posterUrl}
                alt={workshop.title}
                className="w-full h-48 object-contain bg-gray-100"
              />
            )}
            
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {workshop.title}
              </h3>
              
              {workshop.description && (
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {workshop.description}
                </p>
              )}

              <div className="space-y-2 mb-4">
                {workshop.instructor && (
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 ml-2" />
                    <span>مدرس: {workshop.instructor}</span>
                  </div>
                )}
                
                {workshop.eventDate && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 ml-2" />
                    <span>{workshop.eventDate}</span>
                  </div>
                )}
                
                {workshop.duration && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 ml-2" />
                    <span>{workshop.duration}</span>
                  </div>
                )}
                
                {workshop.location && (
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 ml-2" />
                    <span>{workshop.location}</span>
                  </div>
                )}

                {workshop.capacity && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 ml-2" />
                    <span>ظرفیت: {workshop.capacity} نفر</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                {workshop.level && (
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {workshop.level}
                  </span>
                )}

                {workshop.registrationOpen ? (
                  <button
                    onClick={() => handleRegister(workshop)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    ثبت‌نام
                  </button>
                ) : (
                  <span className="px-4 py-2 bg-gray-100 text-gray-500 rounded-md">
                    ثبت‌نام بسته
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {(!workshops || workshops.filter((w: any) => w.isActive).length === 0) && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Calendar className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            هیچ کارگاهی در حال حاضر برگزار نمی‌شود
          </h3>
          <p className="text-gray-600">
            برای اطلاع از کارگاه‌های آینده با ما در تماس باشید
          </p>
          <div className="mt-4 text-sm text-gray-500">
            تعداد کارگاه‌ها: {workshops?.length || 0} | فعال: {workshops?.filter((w: any) => w.isActive).length || 0}
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {showRegistrationForm && selectedWorkshop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                ثبت‌نام در کارگاه
              </h3>
              <button
                onClick={() => {
                  setShowRegistrationForm(false);
                  setSelectedWorkshop(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900">{selectedWorkshop.title}</h4>
              {selectedWorkshop.eventDate && (
                <p className="text-sm text-gray-600">{selectedWorkshop.eventDate}</p>
              )}
            </div>

            <form onSubmit={handleSubmitRegistration} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نام و نام خانوادگی
                </label>
                <input
                  name="userName"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="نام کامل خود را وارد کنید"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ایمیل
                </label>
                <input
                  name="userEmail"
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  شماره تماس (اختیاری)
                </label>
                <input
                  name="userPhone"
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="09123456789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  توضیحات (اختیاری)
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="سوالات یا توضیحات اضافی..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowRegistrationForm(false);
                    setSelectedWorkshop(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {registerMutation.isPending ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </AuthGuard>
  );
}