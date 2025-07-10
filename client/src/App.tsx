import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router } from 'wouter';
import HomePage from './pages/home-simple';
import CoursesPage from './pages/courses-simple';
import ProjectsPage from './pages/projects-simple';
import WorkshopsPage from './pages/workshops-simple';
import LibraryPage from './pages/library-simple';
import ProfilePage from './pages/profile-simple';
import FavoritesPage from './pages/favorites';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import AdminPage from './pages/admin';
import AdminSimple from './pages/admin-simple';
import ProtectedContentDemo from './pages/protected-content';
import WebinarDetail from './pages/webinar-detail';
import MagazineDetailPage from './pages/magazine-detail';
import MediaLibraryPage from './pages/media-library';
import MagazinesPage from './pages/magazines';
import WebinarsPage from './pages/webinars';
import VideosPage from './pages/videos';
import AboutUsPage from './pages/about-us';
import ContactUsPage from './pages/contact-us';
import Header from './components/layout/Header';
import { AuthGuard } from './components/AuthGuard';
import { useAuth } from './hooks/useAuth';
import { SearchModal } from './components/SearchModal';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const response = await fetch(queryKey[0] as string);
        if (!response.ok) {
          throw new Error(`${response.status}: ${response.statusText}`);
        }
        return response.json();
      },
    },
  },
});

interface NavButtonProps {
  id: string;
  icon: string;
  label: string;
  isActive: boolean;
  onClick: (id: string) => void;
}

function App() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedWebinarId, setSelectedWebinarId] = useState<number | null>(null);
  const [selectedMagazineId, setSelectedMagazineId] = useState<number | null>(null);
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'OPEN_ADMIN' || event.data.type === 'SHOW_ADMIN_PANEL') {
        setActiveTab('admin');
      } else if (event.data.type === 'SHOW_HOME') {
        setActiveTab('home');
      } else if (event.data.type === 'SWITCH_TAB') {
        setActiveTab(event.data.tab);
        setSelectedWebinarId(null); // Reset webinar view when switching tabs
        setSelectedMagazineId(null); // Reset magazine view when switching tabs
      } else if (event.data.type === 'OPEN_WEBINAR') {
        setSelectedWebinarId(event.data.webinarId);
        setActiveTab('webinar');
      } else if (event.data.type === 'OPEN_MAGAZINE') {
        setSelectedMagazineId(event.data.magazineId);
        setActiveTab('magazine');
      } else if (event.data.type === 'NAVIGATE_TO_ADMIN') {
        setActiveTab('admin');
        // Send message to admin page to switch to specific tab
        setTimeout(() => {
          window.postMessage({ type: 'ADMIN_TAB_SWITCH', tab: event.data.tab }, '*');
        }, 100);
      } else if (event.data.type === 'SHOW_SEARCH') {
        setShowSearchModal(true);
      } else if (event.data.type === 'SHOW_PROFILE') {
        setActiveTab('profile');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const NavButton = ({ id, icon, label, isActive, onClick }: NavButtonProps) => {
    const renderIcon = () => {
      switch(id) {
        case 'home':
          return (
            <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
            </svg>
          );
        case 'favorites':
          return (
            <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
            </svg>
          );
        case 'profile':
          return (
            <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
            </svg>
          );
        default:
          return <span className="text-xl mb-1">{icon}</span>;
      }
    };

    return (
      <button
        onClick={() => onClick(id)}
        className={`flex flex-col items-center py-2 px-4 transition-colors ${
          isActive ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        {renderIcon()}
        <span className="text-xs font-medium">{label}</span>
      </button>
    );
  };

  const renderCurrentPage = () => {
    // Check if user is admin and redirect to admin panel
    if (isAuthenticated && user?.role === 'admin' && activeTab !== 'admin') {
      setActiveTab('admin');
      return <AdminPage />;
    }

    switch (activeTab) {
      case 'home': 
        return <HomePage />;
      case 'courses': 
        return <AuthGuard><CoursesPage /></AuthGuard>;
      case 'projects': 
        return <AuthGuard><ProjectsPage /></AuthGuard>;
      case 'workshops': 
        return <AuthGuard><WorkshopsPage /></AuthGuard>;
      case 'library': 
        return <AuthGuard><LibraryPage /></AuthGuard>;
      case 'profile': 
        return <ProfilePage />;
      case 'favorites': 
        return <AuthGuard><FavoritesPage /></AuthGuard>;
      case 'admin': 
        return <AdminPage />;
      case 'media-library': 
        return <AuthGuard><MediaLibraryPage /></AuthGuard>;
      case 'webinar': 
        return selectedWebinarId ? <AuthGuard><WebinarDetail webinarId={selectedWebinarId} /></AuthGuard> : <HomePage />;
      case 'magazine': 
        return selectedMagazineId ? <AuthGuard><MagazineDetailPage magazineId={selectedMagazineId} /></AuthGuard> : <HomePage />;
      case 'magazines': 
        return <AuthGuard><MagazinesPage /></AuthGuard>;
      case 'webinars': 
        return <AuthGuard><WebinarsPage /></AuthGuard>;
      case 'videos': 
        return <AuthGuard><VideosPage /></AuthGuard>;
      case 'protected': 
        return <AuthGuard><ProtectedContentDemo /></AuthGuard>;
      case 'register': 
        return <RegisterPage />;
      case 'about-us': 
        return <AboutUsPage />;
      case 'contact-us': 
        return <ContactUsPage />;
      default: 
        return <HomePage />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50" dir="rtl">
          {activeTab !== 'admin' && activeTab !== 'webinar' && activeTab !== 'magazine' && activeTab !== 'about-us' && activeTab !== 'contact-us' && <Header />}
          <div className={`${activeTab !== 'admin' && activeTab !== 'webinar' && activeTab !== 'magazine' && activeTab !== 'about-us' && activeTab !== 'contact-us' ? 'container mx-auto px-4 py-6 pb-24 max-w-7xl pt-20' : ''}`}>
            {renderCurrentPage()}
          </div>

          {/* Bottom Navigation - Hide in admin, webinar and magazine mode */}
          {activeTab !== 'admin' && activeTab !== 'webinar' && activeTab !== 'magazine' && activeTab !== 'about-us' && activeTab !== 'contact-us' && (
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl">
              {/* Categories Menu */}
              {showCategoriesMenu && (
                <div className="bg-white border-t border-gray-200 p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setActiveTab('workshops');
                        setShowCategoriesMenu(false);
                      }}
                      className="flex flex-col items-center p-3 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      <svg className="w-8 h-8 mb-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                      </svg>
                      <span className="text-sm font-medium text-gray-700">کارگاه آموزشی</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('webinars');
                        setShowCategoriesMenu(false);
                      }}
                      className="flex flex-col items-center p-3 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      <svg className="w-8 h-8 mb-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
                      </svg>
                      <span className="text-sm font-medium text-gray-700">وبینار آموزشی</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('magazines');
                        setShowCategoriesMenu(false);
                      }}
                      className="flex flex-col items-center p-3 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      <svg className="w-8 h-8 mb-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd"/>
                        <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z"/>
                      </svg>
                      <span className="text-sm font-medium text-gray-700">فصلنامه رویش سبز</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('library');
                        setShowCategoriesMenu(false);
                      }}
                      className="flex flex-col items-center p-3 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      <svg className="w-8 h-8 mb-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V4.804z"/>
                      </svg>
                      <span className="text-sm font-medium text-gray-700">آرشیو پیستاط</span>
                    </button>
                  </div>
                </div>
              )}
              
              <div className="flex justify-around py-2">
                <NavButton
                  id="home"
                  icon="🏠"
                  label="خانه"
                  isActive={activeTab === 'home'}
                  onClick={setActiveTab}
                />
                <NavButton
                  id="favorites"
                  icon="❤️"
                  label="علاقه‌مندی‌ها"
                  isActive={activeTab === 'favorites'}
                  onClick={setActiveTab}
                />
                <button
                  onClick={() => setShowCategoriesMenu(!showCategoriesMenu)}
                  className={`flex flex-col items-center py-2 px-4 transition-colors ${
                    showCategoriesMenu ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                  <span className="text-xs font-medium">دسته‌بندی</span>
                </button>
                <NavButton
                  id="profile"
                  icon="👤"
                  label="پروفایل"
                  isActive={activeTab === 'profile'}
                  onClick={setActiveTab}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Search Modal */}
        <SearchModal 
          isOpen={showSearchModal} 
          onClose={() => setShowSearchModal(false)} 
        />
      </Router>
    </QueryClientProvider>
  );
}

export default App;