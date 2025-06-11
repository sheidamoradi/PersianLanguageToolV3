function App() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-blue-600">پیستاط - مرکز آموزشی کشاورزی</h1>
      <p className="text-gray-600 mt-4">وب‌سایت در حال بارگذاری است...</p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h2 className="font-semibold text-blue-800">دوره‌ها</h2>
          <p className="text-blue-600">آموزش‌های تخصصی کشاورزی</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h2 className="font-semibold text-green-800">پروژه‌ها</h2>
          <p className="text-green-600">پروژه‌های عملی و کاربردی</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg">
          <h2 className="font-semibold text-purple-800">کتابخانه</h2>
          <p className="text-purple-600">منابع و مقالات آموزشی</p>
        </div>
        <div className="bg-orange-100 p-4 rounded-lg">
          <h2 className="font-semibold text-orange-800">پروفایل</h2>
          <p className="text-orange-600">مدیریت حساب کاربری</p>
        </div>
      </div>
    </div>
  );
}

export default App;