import { useEffect, ReactNode } from 'react';

interface ContentProtectionProps {
  children: ReactNode;
  allowScreenshot?: boolean;
  allowCopy?: boolean;
  allowPrint?: boolean;
  watermarkText?: string;
  protectionLevel?: 'none' | 'basic' | 'strict';
}

export default function ContentProtection({
  children,
  allowScreenshot = true,
  allowCopy = true,
  allowPrint = true,
  watermarkText,
  protectionLevel = 'none'
}: ContentProtectionProps) {

  useEffect(() => {
    if (protectionLevel === 'none') return;

    const preventScreenshot = () => {
      if (!allowScreenshot) {
        // جلوگیری از کلیدهای اسکرین‌شات
        const handleKeyDown = (e: KeyboardEvent) => {
          // Print Screen
          if (e.key === 'PrintScreen') {
            e.preventDefault();
            alert('اسکرین‌شات از این محتوا مجاز نیست');
            return false;
          }
          
          // Ctrl+Shift+S (Windows/Linux)
          if (e.ctrlKey && e.shiftKey && e.key === 'S') {
            e.preventDefault();
            alert('اسکرین‌شات از این محتوا مجاز نیست');
            return false;
          }
          
          // Cmd+Shift+3,4,5 (Mac)
          if (e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key)) {
            e.preventDefault();
            alert('اسکرین‌شات از این محتوا مجاز نیست');
            return false;
          }

          // F12 (Developer Tools)
          if (e.key === 'F12') {
            e.preventDefault();
            alert('ابزارهای توسعه‌دهنده مجاز نیست');
            return false;
          }

          // Ctrl+Shift+I (Developer Tools)
          if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            alert('ابزارهای توسعه‌دهنده مجاز نیست');
            return false;
          }

          // Ctrl+U (View Source)
          if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            alert('مشاهده کد منبع مجاز نیست');
            return false;
          }
        };

        document.addEventListener('keydown', handleKeyDown);
        
        // غیرفعال کردن کلیک راست
        const handleContextMenu = (e: MouseEvent) => {
          e.preventDefault();
          alert('کلیک راست در این محتوا مجاز نیست');
          return false;
        };

        document.addEventListener('contextmenu', handleContextMenu);

        return () => {
          document.removeEventListener('keydown', handleKeyDown);
          document.removeEventListener('contextmenu', handleContextMenu);
        };
      }
    };

    const preventCopy = () => {
      if (!allowCopy) {
        const handleCopy = (e: ClipboardEvent) => {
          e.preventDefault();
          alert('کپی کردن این محتوا مجاز نیست');
          return false;
        };

        const handleSelectStart = (e: Event) => {
          e.preventDefault();
          return false;
        };

        document.addEventListener('copy', handleCopy);
        document.addEventListener('selectstart', handleSelectStart);

        // جلوگیری از Ctrl+A, Ctrl+C, Ctrl+V
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
            e.preventDefault();
            alert('این عملیات مجاز نیست');
            return false;
          }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
          document.removeEventListener('copy', handleCopy);
          document.removeEventListener('selectstart', handleSelectStart);
          document.removeEventListener('keydown', handleKeyDown);
        };
      }
    };

    const preventPrint = () => {
      if (!allowPrint) {
        const handlePrint = (e: Event) => {
          e.preventDefault();
          alert('چاپ این محتوا مجاز نیست');
          return false;
        };

        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            alert('چاپ این محتوا مجاز نیست');
            return false;
          }
        };

        window.addEventListener('beforeprint', handlePrint);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
          window.removeEventListener('beforeprint', handlePrint);
          document.removeEventListener('keydown', handleKeyDown);
        };
      }
    };

    // اعمال حفاظت‌ها
    const cleanupFunctions: (() => void)[] = [];
    
    const screenshotCleanup = preventScreenshot();
    if (screenshotCleanup) cleanupFunctions.push(screenshotCleanup);
    
    const copyCleanup = preventCopy();
    if (copyCleanup) cleanupFunctions.push(copyCleanup);
    
    const printCleanup = preventPrint();
    if (printCleanup) cleanupFunctions.push(printCleanup);

    // تشخیص ابزارهای توسعه‌دهنده
    if (protectionLevel === 'strict') {
      let devtools = false;
      const threshold = 160;

      const detectDevTools = () => {
        if (
          window.outerHeight - window.innerHeight > threshold ||
          window.outerWidth - window.innerWidth > threshold
        ) {
          if (!devtools) {
            devtools = true;
            alert('لطفا ابزارهای توسعه‌دهنده را ببندید');
            // می‌توانید کاربر را به صفحه دیگری هدایت کنید
          }
        } else {
          devtools = false;
        }
      };

      const interval = setInterval(detectDevTools, 500);
      cleanupFunctions.push(() => clearInterval(interval));
    }

    // تمیز کردن در زمان unmount
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [allowScreenshot, allowCopy, allowPrint, protectionLevel]);

  // اضافه کردن واتر مارک
  const containerStyle = watermarkText ? {
    position: 'relative' as const,
    '::before': {
      content: `"${watermarkText}"`,
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%) rotate(-45deg)',
      fontSize: '2rem',
      color: 'rgba(0, 0, 0, 0.1)',
      pointerEvents: 'none',
      zIndex: 1000,
      userSelect: 'none'
    }
  } : {};

  return (
    <div 
      className={`content-protection ${protectionLevel !== 'none' ? 'protected' : ''}`}
      style={{
        userSelect: allowCopy ? 'auto' : 'none',
        WebkitUserSelect: allowCopy ? 'auto' : 'none',
        MozUserSelect: allowCopy ? 'auto' : 'none',
        ...containerStyle
      } as React.CSSProperties}
    >
      {watermarkText && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="text-6xl font-bold text-gray-200 opacity-10 rotate-45 select-none"
              style={{ 
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none'
              }}
            >
              {watermarkText}
            </div>
          </div>
        </div>
      )}
      
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
}

// Hook برای کنترل دانلود
export function useDownloadControl(allowDownload: boolean = true) {
  const downloadFile = (url: string, filename: string) => {
    if (!allowDownload) {
      alert('دانلود این فایل مجاز نیست');
      return;
    }

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return { downloadFile, allowDownload };
}