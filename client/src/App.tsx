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
import AdminPage from './pages/admin';
import AdminSimple from './pages/admin-simple';
import ProtectedContentDemo from './pages/protected-content';
import WebinarDetail from './pages/webinar-detail';
import MagazineDetailPage from './pages/magazine-detail';
import MediaLibraryPage from './pages/media-library';
import MagazinesPage from './pages/magazines';
import WebinarsPage from './pages/webinars';
import VideosPage from './pages/videos';
import Header from './components/layout/Header';

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
  const [activeTab, setActiveTab] = useState('home');
  const [selectedWebinarId, setSelectedWebinarId] = useState<number | null>(null);
  const [selectedMagazineId, setSelectedMagazineId] = useState<number | null>(null);
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'OPEN_ADMIN') {
        setActiveTab('admin');
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
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const NavButton = ({ id, icon, label, isActive, onClick }: NavButtonProps) => (
    <button
      onClick={() => onClick(id)}
      className={`flex flex-col items-center py-2 px-4 transition-colors ${
        isActive ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      <span className="text-xl mb-1">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );

  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'home': return <HomePage />;
      case 'courses': return <CoursesPage />;
      case 'projects': return <ProjectsPage />;
      case 'workshops': return <WorkshopsPage />;
      case 'library': return <LibraryPage />;
      case 'profile': return <ProfilePage />;
      case 'favorites': return <FavoritesPage />;
      case 'admin': return <AdminPage />;
      case 'media-library': return <MediaLibraryPage />;
      case 'webinar': return selectedWebinarId ? <WebinarDetail webinarId={selectedWebinarId} /> : <HomePage />;
      case 'magazine': return selectedMagazineId ? <MagazineDetailPage magazineId={selectedMagazineId} /> : <HomePage />;
      case 'magazines': return <MagazinesPage />;
      case 'webinars': return <WebinarsPage />;
      case 'videos': return <VideosPage />;
      case 'protected': return <ProtectedContentDemo />;
      default: return <HomePage />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50" dir="rtl">
          {activeTab !== 'admin' && activeTab !== 'webinar' && activeTab !== 'magazine' && <Header />}
          <div className={`${activeTab !== 'admin' && activeTab !== 'webinar' && activeTab !== 'magazine' ? 'container mx-auto px-4 py-6 pb-24 max-w-7xl pt-20' : ''}`}>
            {renderCurrentPage()}
          </div>

          {/* Bottom Navigation - Hide in admin, webinar and magazine mode */}
          {activeTab !== 'admin' && activeTab !== 'webinar' && activeTab !== 'magazine' && (
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
                      className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-2xl mb-1">🎓</span>
                      <span className="text-sm font-medium text-gray-700">کارگاه آموزشی</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('webinars');
                        setShowCategoriesMenu(false);
                      }}
                      className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-2xl mb-1">📹</span>
                      <span className="text-sm font-medium text-gray-700">وبینار آموزشی</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('magazines');
                        setShowCategoriesMenu(false);
                      }}
                      className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-2xl mb-1">📰</span>
                      <span className="text-sm font-medium text-gray-700">فصلنامه رویش سبز</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('library');
                        setShowCategoriesMenu(false);
                      }}
                      className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-2xl mb-1">📚</span>
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
                <NavButton
                  id="profile"
                  icon="👤"
                  label="پروفایل"
                  isActive={activeTab === 'profile'}
                  onClick={setActiveTab}
                />
                <button
                  onClick={() => setShowCategoriesMenu(!showCategoriesMenu)}
                  className={`flex flex-col items-center py-2 px-4 transition-colors ${
                    showCategoriesMenu ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <span className="text-xl mb-1">📋</span>
                  <span className="text-xs font-medium">دسته‌بندی</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;