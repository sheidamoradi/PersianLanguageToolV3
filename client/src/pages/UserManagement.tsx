import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface User {
  id: number;
  username: string;
  name: string;
  role: string;
  subscriptionStatus: string;
  subscriptionExpiry?: string;
}

interface Course {
  id: number;
  title: string;
  accessLevel: string;
  price: number;
  isLocked: boolean;
}

interface UserCourseAccess {
  id: number;
  userId: number;
  courseId: number;
  accessType: string;
  purchaseDate: string;
  expiryDate?: string;
  isActive: boolean;
}

export default function UserManagement() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<number>("");
  const [accessType, setAccessType] = useState<string>("granted");
  const [expiryDate, setExpiryDate] = useState<string>("");

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["/api/users"],
  });

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["/api/courses"],
  });

  const { data: userAccess = [], isLoading: accessLoading } = useQuery({
    queryKey: ["/api/users", selectedUserId, "course-access"],
    enabled: !!selectedUserId,
  });

  const grantAccessMutation = useMutation({
    mutationFn: async (data: { userId: number; courseId: number; accessType: string; expiryDate?: string }) => {
      return apiRequest(`/api/users/${data.userId}/grant-course-access`, {
        method: "POST",
        body: JSON.stringify({
          courseId: data.courseId,
          accessType: data.accessType,
          expiryDate: data.expiryDate,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", selectedUserId, "course-access"] });
      setSelectedCourseId("");
      setExpiryDate("");
    },
  });

  const revokeAccessMutation = useMutation({
    mutationFn: async (data: { userId: number; courseId: number }) => {
      return apiRequest(`/api/users/${data.userId}/revoke-course-access/${data.courseId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", selectedUserId, "course-access"] });
    },
  });

  const handleGrantAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId && selectedCourseId) {
      grantAccessMutation.mutate({
        userId: selectedUserId,
        courseId: selectedCourseId,
        accessType,
        expiryDate: expiryDate || undefined,
      });
    }
  };

  const handleRevokeAccess = (courseId: number) => {
    if (selectedUserId) {
      revokeAccessMutation.mutate({
        userId: selectedUserId,
        courseId,
      });
    }
  };

  if (usersLoading || coursesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">در حال بارگذاری...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir="rtl">
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          مدیریت کاربران و دسترسی‌ها
        </h1>

        {/* User Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            انتخاب کاربر
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user: User) => (
              <div
                key={user.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedUserId === user.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                onClick={() => setSelectedUserId(user.id)}
              >
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {user.name || user.username}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  @{user.username}
                </p>
                <div className="mt-2 flex gap-2">
                  <span className={`px-2 py-1 text-xs rounded ${
                    user.role === 'admin' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {user.role === 'admin' ? 'مدیر' : 'کاربر'}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded ${
                    user.subscriptionStatus === 'vip'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
                      : user.subscriptionStatus === 'premium'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {user.subscriptionStatus === 'vip' ? 'ویژه' : 
                     user.subscriptionStatus === 'premium' ? 'پریمیوم' : 'رایگان'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedUserId && (
          <>
            {/* Grant Access Form */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                اعطای دسترسی دوره
              </h2>
              <form onSubmit={handleGrantAccess} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    انتخاب دوره
                  </label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">انتخاب کنید...</option>
                    {courses.map((course: Course) => (
                      <option key={course.id} value={course.id}>
                        {course.title} - {course.accessLevel === 'free' ? 'رایگان' : 
                                         course.accessLevel === 'premium' ? 'پریمیوم' : 'ویژه'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    نوع دسترسی
                  </label>
                  <select
                    value={accessType}
                    onChange={(e) => setAccessType(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="granted">اعطا شده</option>
                    <option value="purchased">خریداری شده</option>
                    <option value="trial">آزمایشی</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    تاریخ انقضا (اختیاری)
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={grantAccessMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50"
                >
                  {grantAccessMutation.isPending ? "در حال اعطا..." : "اعطای دسترسی"}
                </button>
              </form>
            </div>

            {/* Current Access */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                دسترسی‌های فعلی
              </h2>
              {accessLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : userAccess.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                  هیچ دسترسی‌ای برای این کاربر وجود ندارد
                </p>
              ) : (
                <div className="space-y-3">
                  {userAccess.map((access: UserCourseAccess) => {
                    const course = courses.find((c: Course) => c.id === access.courseId);
                    return (
                      <div
                        key={access.id}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {course?.title || `دوره شماره ${access.courseId}`}
                          </h3>
                          <div className="flex gap-2 mt-1">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              نوع: {access.accessType === 'granted' ? 'اعطا شده' : 
                                    access.accessType === 'purchased' ? 'خریداری شده' : 'آزمایشی'}
                            </span>
                            {access.expiryDate && (
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                انقضا: {new Date(access.expiryDate).toLocaleDateString('fa-IR')}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRevokeAccess(access.courseId)}
                          disabled={revokeAccessMutation.isPending}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm disabled:opacity-50"
                        >
                          لغو دسترسی
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}