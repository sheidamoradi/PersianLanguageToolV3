import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Register() {
  const { refetch } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    email: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const registerMutation = useMutation({
    mutationFn: async (userData: typeof formData) => {
      const response = await apiRequest("/api/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });
      return response;
    },
    onSuccess: () => {
      refetch();
      window.parent.postMessage({ type: 'SWITCH_TAB', tab: 'home' }, '*');
    },
    onError: (error: any) => {
      if (error.message.includes("نام کاربری")) {
        setErrors({ username: "این نام کاربری قبلاً استفاده شده است" });
      } else if (error.message.includes("ایمیل")) {
        setErrors({ email: "این ایمیل قبلاً استفاده شده است" });
      } else {
        setErrors({ general: error.message || "خطا در ثبت‌نام" });
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "نام کاربری الزامی است";
    } else if (formData.username.length < 3) {
      newErrors.username = "نام کاربری باید حداقل ۳ کاراکتر باشد";
    }

    if (!formData.password) {
      newErrors.password = "رمز عبور الزامی است";
    } else if (formData.password.length < 6) {
      newErrors.password = "رمز عبور باید حداقل ۶ کاراکتر باشد";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "تکرار رمز عبور الزامی است";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "رمز عبور و تکرار آن یکسان نیست";
    }

    if (!formData.name.trim()) {
      newErrors.name = "نام الزامی است";
    }

    if (!formData.email.trim()) {
      newErrors.email = "ایمیل الزامی است";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "فرمت ایمیل صحیح نیست";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      registerMutation.mutate(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ثبت‌نام در پیستاط
            </h2>
            <p className="text-gray-600">
              حساب کاربری جدید ایجاد کنید
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نام کامل *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="نام کامل خود را وارد کنید"
                />
                <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نام کاربری *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="نام کاربری خود را انتخاب کنید"
                />
                <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ایمیل *
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="ایمیل خود را وارد کنید"
                />
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رمز عبور *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="رمز عبور خود را وارد کنید"
                />
                <Lock className="absolute left-10 top-3.5 w-5 h-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تکرار رمز عبور *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="رمز عبور خود را دوباره وارد کنید"
                />
                <Lock className="absolute left-10 top-3.5 w-5 h-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{errors.general}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {registerMutation.isPending ? "در حال ثبت‌نام..." : "ثبت‌نام"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              قبلاً حساب کاربری دارید؟{" "}
              <button
                onClick={() => {
                  window.location.href = "/login";
                }}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                وارد شوید
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}