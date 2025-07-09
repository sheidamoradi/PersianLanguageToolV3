import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { LoginModal } from './LoginModal';
import { LogIn } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const handleRestrictedAction = (actionName: string) => {
      setLoginMessage(`برای ${actionName} باید وارد حساب کاربری خود شوید`);
      setShowLoginModal(true);
    };

    return fallback || (
      <div className="relative">
        <style>{`
          .guest-restricted .btn-primary,
          .guest-restricted button:not(.guest-allowed),
          .guest-restricted .card-interactive {
            position: relative;
            overflow: hidden;
          }
          
          .guest-restricted .btn-primary::after,
          .guest-restricted button:not(.guest-allowed)::after,
          .guest-restricted .card-interactive::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.1);
            z-index: 1;
          }
          
          .guest-restricted .card-interactive:hover::after {
            background: rgba(0, 0, 0, 0.2);
          }
        `}</style>
        
        <div className="guest-restricted">
          <div 
            onClick={(e) => {
              const target = e.target as HTMLElement;
              if (target.closest('button:not(.guest-allowed)') || 
                  target.closest('.btn-primary') || 
                  target.closest('.card-interactive')) {
                e.preventDefault();
                e.stopPropagation();
                handleRestrictedAction("استفاده از این قابلیت");
              }
            }}
          >
            {children}
          </div>
        </div>

        {/* Guest Banner */}
        <div className="fixed bottom-20 left-4 right-4 bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-lg shadow-lg z-40" dir="rtl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LogIn className="w-6 h-6" />
              <div>
                <p className="font-medium">شما در حالت مهمان هستید</p>
                <p className="text-sm text-green-100">برای دسترسی کامل وارد شوید</p>
              </div>
            </div>
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors guest-allowed"
            >
              ورود
            </button>
          </div>
        </div>

        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          message={loginMessage}
        />
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