import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Phone, Mail, MapPin, Clock, Send, User } from 'lucide-react';

export default function ContactUsPage() {
  const { data: contactData, isLoading } = useQuery({
    queryKey: ['/api/contact-us'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  const contactInfo = contactData?.[0];

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.postMessage({ type: 'SHOW_HOME' }, '*')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowRight className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">تماس با ما</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {contactInfo ? (
          <div className="space-y-8">
            {/* Title and Description */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                {contactInfo.title}
              </h2>
              
              {contactInfo.description && (
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-8">
                  {contactInfo.description.split('\n').map((paragraph: string, index: number) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {/* Contact Information Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Phone */}
                {contactInfo.phone && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">شماره تماس</h3>
                    </div>
                    <p className="text-gray-700 font-medium" dir="ltr">
                      {contactInfo.phone}
                    </p>
                  </div>
                )}

                {/* Email */}
                {contactInfo.email && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">ایمیل</h3>
                    </div>
                    <p className="text-gray-700 font-medium" dir="ltr">
                      {contactInfo.email}
                    </p>
                  </div>
                )}

                {/* Address */}
                {contactInfo.address && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-orange-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">آدرس</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {contactInfo.address}
                    </p>
                  </div>
                )}

                {/* Working Hours */}
                {contactInfo.workingHours && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">ساعات کاری</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {contactInfo.workingHours}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Social Media */}
            {(contactInfo.socialMedia || contactInfo.website) && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">شبکه‌های اجتماعی</h3>
                <div className="flex flex-wrap gap-4">
                  {contactInfo.website && (
                    <a 
                      href={contactInfo.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg transition-colors"
                    >
                      وب‌سایت
                    </a>
                  )}
                  {contactInfo.socialMedia && (
                    <div className="text-gray-700">
                      {contactInfo.socialMedia}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Additional Info */}
            {contactInfo.additionalInfo && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">اطلاعات تکمیلی</h3>
                <div className="text-gray-700 leading-relaxed">
                  {contactInfo.additionalInfo.split('\n').map((info: string, index: number) => (
                    <p key={index} className="mb-2">
                      {info}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">فرم تماس</h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نام و نام خانوادگی
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="نام خود را وارد کنید"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ایمیل
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ایمیل خود را وارد کنید"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    موضوع
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="موضوع پیام خود را وارد کنید"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    متن پیام
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="متن پیام خود را وارد کنید"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  ارسال پیام
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Phone className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">اطلاعات تماس موجود نیست</h3>
            <p className="text-gray-600 mb-6">
              هنوز اطلاعات تماسی برای این بخش وارد نشده است.
            </p>
            <button 
              onClick={() => window.postMessage({ type: 'SHOW_HOME' }, '*')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              بازگشت به صفحه اصلی
            </button>
          </div>
        )}
      </div>
    </div>
  );
}