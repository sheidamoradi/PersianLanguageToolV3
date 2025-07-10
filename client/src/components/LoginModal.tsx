import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { X } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export function LoginModal({ isOpen, onClose, message }: LoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { refetch } = useAuth();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await apiRequest("/api/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      return response;
    },
    onSuccess: () => {
      refetch();
      onClose();
      setError("");
      setUsername("");
      setPassword("");
    },
    onError: (error: any) => {
      setError(error.message || "خطا در ورود");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("لطفاً نام کاربری و رمز عبور را وارد کنید");
      return;
    }
    loginMutation.mutate({ username, password });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" dir="rtl">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">ورود به حساب کاربری</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نام کاربری
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="نام کاربری خود را وارد کنید"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              رمز عبور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="رمز عبور خود را وارد کنید"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loginMutation.isPending ? "در حال ورود..." : "ورود"}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            حساب کاربری ندارید؟{" "}
            <button
              onClick={() => {
                onClose();
                window.parent.postMessage({ type: 'SWITCH_TAB', tab: 'register' }, '*');
              }}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              ثبت‌نام کنید
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}