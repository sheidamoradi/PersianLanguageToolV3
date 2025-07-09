import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50" dir="rtl">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-4">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-orange-100 mb-4">
            <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            دسترسی محدود
          </h2>
          <p className="text-gray-600 mb-4">
            برای دسترسی به این بخش، لطفاً وارد حساب کاربری خود شوید
          </p>
          <button
            onClick={() => window.parent.postMessage({ type: 'SWITCH_TAB', tab: 'profile' }, '*')}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
          >
            ورود به حساب کاربری
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function GuestContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gray-100 bg-opacity-50 backdrop-blur-sm z-10 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg max-w-sm mx-4" dir="rtl">
          <div className="mx-auto h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 mb-3">
            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            کاربر مهمان
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            برای دسترسی کامل به محتوا، لطفاً وارد شوید
          </p>
          <button
            onClick={() => window.parent.postMessage({ type: 'SWITCH_TAB', tab: 'profile' }, '*')}
            className="w-full bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            ورود
          </button>
        </div>
      </div>
      <div className="filter blur-sm pointer-events-none">
        {children}
      </div>
    </div>
  );
}