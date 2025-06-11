import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

interface Course {
  id: number;
  title: string;
  description?: string;
  progress?: number;
  isLocked?: boolean;
  level?: string;
  category?: string;
}

interface Project {
  id: number;
  title: string;
  description?: string;
  type?: string;
  dueDate?: string;
}

interface Document {
  id: number;
  title: string;
  author?: string;
  fileType?: string;
  fileName?: string;
  content?: string;
  description?: string;
}

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch real data from backend APIs
  const { data: courses = [], isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const { data: documents = [], isLoading: documentsLoading } = useQuery<Document[]>({
    queryKey: ['/api/documents'],
  });

  const CourseCard = ({ course }: { course: Course }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="h-32 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 relative">
        {course.isLocked && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white text-2xl">🔒</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-800 mb-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-3">{course.description}</p>
        {!course.isLocked && (
          <div className="mb-3">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${course.progress || 0}%` }}
              ></div>
            </div>
          </div>
        )}
        <button 
          className={`w-full py-2 rounded-lg text-sm font-medium ${
            course.isLocked 
              ? 'bg-gray-200 text-gray-500' 
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
          disabled={course.isLocked}
        >
          {course.isLocked ? 'قفل شده' : 'ادامه یادگیری'}
        </button>
      </div>
    </div>
  );

  const ProjectCard = ({ project }: { project: Project }) => (
    <div className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-all">
      <h3 className="font-bold text-gray-800 mb-2">{project.title}</h3>
      <p className="text-gray-600 text-sm mb-3">{project.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {project.type || 'عمومی'}
        </span>
        <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
          مشاهده
        </button>
      </div>
    </div>
  );

  const DocumentCard = ({ document }: { document: Document }) => (
    <div className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-all">
      <h3 className="font-bold text-gray-800 mb-2">{document.title}</h3>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {document.content || document.description || 'محتوای مفیدی برای یادگیری'}
      </p>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">
          {document.author || 'نویسنده ناشناخته'}
        </span>
        <button className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600">
          دانلود
        </button>
      </div>
    </div>
  );

  if (coursesLoading || projectsLoading || documentsLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگیری پلتفرم پیستاط...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center py-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
          🌱 خوش آمدید به پیستاط
        </h1>
        <p className="text-xl text-gray-600 mb-2">مرکز آموزشی تخصصی کشاورزی مدرن</p>
        <p className="text-gray-500">یادگیری، پیشرفت، موفقیت</p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto">
        <input
          type="text"
          placeholder="جستجو در دوره‌ها، پروژه‌ها و مقالات..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white text-center">
          <div className="text-3xl font-bold mb-1">{courses.length}</div>
          <div className="text-sm opacity-90">دوره فعال</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white text-center">
          <div className="text-3xl font-bold mb-1">{projects.length}</div>
          <div className="text-sm opacity-90">پروژه</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white text-center">
          <div className="text-3xl font-bold mb-1">{documents.length}</div>
          <div className="text-sm opacity-90">مقاله</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl text-white text-center">
          <div className="text-3xl font-bold mb-1">87%</div>
          <div className="text-sm opacity-90">پیشرفت</div>
        </div>
      </div>

      {/* Featured Course */}
      <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-3">🎯 دوره پیشنهادی این هفته</h2>
        <h3 className="text-xl font-semibold mb-2">کشاورزی هوشمند با IoT</h3>
        <p className="mb-6 opacity-90">یادگیری فناوری‌های نوین اینترنت اشیا در کشاورزی مدرن</p>
        <button className="bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
          شروع یادگیری رایگان
        </button>
      </div>

      {/* Courses Section */}
      {courses.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-2xl">📚</span>
            دوره‌های آموزشی
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 6).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            پروژه‌های عملی
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 6).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}

      {/* Documents Section */}
      {documents.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-2xl">📖</span>
            کتابخانه دیجیتال
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.slice(0, 6).map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="text-2xl">📊</span>
          فعالیت‌های اخیر
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">📚</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">مطالعه جدیدترین مقالات کشاورزی</p>
              <p className="text-sm text-gray-500">همین الان • آماده برای یادگیری</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🚀</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">شروع پروژه‌های عملی جدید</p>
              <p className="text-sm text-gray-500">آماده برای شروع • پروژه‌های متنوع</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}