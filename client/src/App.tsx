import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from './pages/home-simple';
import CoursesPage from './pages/courses-simple';
import ProjectsPage from './pages/projects-simple';
import LibraryPage from './pages/library-simple';
import ProfilePage from './pages/profile-simple';

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
      case 'library': return <LibraryPage />;
      case 'profile': return <ProfilePage />;
      default: return <HomePage />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50" dir="rtl">
        <div className="container mx-auto px-4 py-6 pb-24 max-w-7xl">
          {renderCurrentPage()}
        </div>

        {/* Bottom Navigation */}
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
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;