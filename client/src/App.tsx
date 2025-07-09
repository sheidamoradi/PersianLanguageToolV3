import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router } from 'wouter';
import HomePage from './pages/home-simple';
import CoursesPage from './pages/courses-simple';
import ProjectsPage from './pages/projects-simple';
import WorkshopsPage from './pages/workshops-simple';
import LibraryPage from './pages/library-simple';
import ProfilePage from './pages/profile-simple';
import AdminPage from './pages/admin';
import AdminSimple from './pages/admin-simple';
import ProtectedContentDemo from './pages/protected-content';
import WebinarDetail from './pages/webinar-detail';
import MagazineDetailPage from './pages/magazine-detail';
import MediaLibraryPage from './pages/media-library';
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
      case 'admin': return <AdminPage />;
      case 'media-library': return <MediaLibraryPage />;
      case 'webinar': return selectedWebinarId ? <WebinarDetail webinarId={selectedWebinarId} /> : <HomePage />;
      case 'magazine': return selectedMagazineId ? <MagazineDetailPage magazineId={selectedMagazineId} /> : <HomePage />;
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
              <div className="flex justify-around py-2">
                <NavButton
                  id="home"
                  icon="🏠"
                  label="خانه"
                  isActive={activeTab === 'home'}
                  onClick={setActiveTab}
                />
                <NavButton
                  id="courses"
                  icon="📚"
                  label="دوره‌ها"
                  isActive={activeTab === 'courses'}
                  onClick={setActiveTab}
                />
                <NavButton
                  id="projects"
                  icon="🚀"
                  label="پروژه‌ها"
                  isActive={activeTab === 'projects'}
                  onClick={setActiveTab}
                />
                <NavButton
                  id="workshops"
                  icon="🎓"
                  label="کارگاه‌ها"
                  isActive={activeTab === 'workshops'}
                  onClick={setActiveTab}
                />
                <NavButton
                  id="library"
                  icon="📖"
                  label="کتابخانه"
                  isActive={activeTab === 'library'}
                  onClick={setActiveTab}
                />
                <NavButton
                  id="profile"
                  icon="👤"
                  label="پروفایل"
                  isActive={activeTab === 'profile'}
                  onClick={setActiveTab}
                />
                <NavButton
                  id="admin"
                  icon="⚙️"
                  label="مدیریت"
                  isActive={activeTab === 'admin'}
                  onClick={setActiveTab}
                />
                <NavButton
                  id="protected"
                  icon="🛡️"
                  label="حفاظت"
                  isActive={activeTab === 'protected'}
                  onClick={setActiveTab}
                />
              </div>
            </div>
          )}
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;