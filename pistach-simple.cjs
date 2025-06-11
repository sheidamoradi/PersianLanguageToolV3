const http = require('http');
const PORT = 3001;

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  });
  
  res.end(`<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>پیستاط - مرکز آموزشی کشاورزی</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; direction: rtl; margin: 0; padding: 0; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); }
    .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); transition: all 0.3s ease; }
    .spinner { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .glass-effect { background: rgba(255,255,255,0.25); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.18); }
  </style>
</head>
<body>
  <div id="app">
    <div class="gradient-bg p-8 text-center text-white">
      <h1 class="text-5xl font-bold mb-3">🌱 پیستاط</h1>
      <p class="text-xl mb-2 opacity-90">مرکز آموزشی تخصصی کشاورزی مدرن</p>
      <p class="opacity-75">یادگیری • پیشرفت • موفقیت</p>
    </div>
    
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white text-center card-hover">
          <div class="text-3xl font-bold mb-1" id="courses-count">-</div>
          <div class="text-sm opacity-90">دوره فعال</div>
        </div>
        <div class="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white text-center card-hover">
          <div class="text-3xl font-bold mb-1" id="projects-count">-</div>
          <div class="text-sm opacity-90">پروژه</div>
        </div>
        <div class="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white text-center card-hover">
          <div class="text-3xl font-bold mb-1" id="documents-count">-</div>
          <div class="text-sm opacity-90">مقاله</div>
        </div>
        <div class="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl text-white text-center card-hover">
          <div class="text-3xl font-bold mb-1">87%</div>
          <div class="text-sm opacity-90">پیشرفت</div>
        </div>
      </div>
      
      <div class="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-2xl p-8 text-white mb-8 card-hover">
        <h2 class="text-2xl font-bold mb-3">🎯 دوره پیشنهادی این هفته</h2>
        <h3 class="text-xl font-semibold mb-2">کشاورزی هوشمند با IoT</h3>
        <p class="mb-6 opacity-90">یادگیری فناوری‌های نوین اینترنت اشیا در کشاورزی مدرن</p>
        <button class="bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">شروع یادگیری رایگان</button>
      </div>
      
      <div id="loading-state" class="text-center py-8">
        <div class="spinner w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-gray-600">در حال بارگیری محتوا...</p>
      </div>
      
      <div id="content-sections" class="space-y-8" style="display: none;">
        <div class="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-xl">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span class="text-2xl">📖</span>کتابخانه دیجیتال کشاورزی
          </h2>
          <div id="documents-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
        </div>
        
        <div class="bg-white/80 backdrop-blur rounded-2xl shadow-xl p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span class="text-2xl">📊</span>فعالیت‌های اخیر
          </h2>
          <div class="space-y-4">
            <div class="flex items-center gap-4 p-4 bg-blue-50 rounded-xl card-hover">
              <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <span class="text-white text-lg">📚</span>
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-800">مطالعه جدیدترین مقالات کشاورزی</p>
                <p class="text-sm text-gray-500">دسترسی فوری • محتوای به‌روز</p>
              </div>
            </div>
            <div class="flex items-center gap-4 p-4 bg-green-50 rounded-xl card-hover">
              <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <span class="text-white text-lg">🚀</span>
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-800">شروع پروژه‌های عملی جدید</p>
                <p class="text-sm text-gray-500">آماده برای شروع • پروژه‌های متنوع</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="fixed bottom-0 left-0 right-0 glass-effect shadow-2xl">
      <div class="flex justify-around py-3">
        <button onclick="setActiveTab('home')" class="nav-btn flex flex-col items-center py-2 px-4 text-green-600 transition-colors">
          <span class="text-xl mb-1">🏠</span>
          <span class="text-xs font-medium">خانه</span>
        </button>
        <button onclick="setActiveTab('courses')" class="nav-btn flex flex-col items-center py-2 px-4 text-gray-400 hover:text-green-600 transition-colors">
          <span class="text-xl mb-1">📚</span>
          <span class="text-xs font-medium">دوره‌ها</span>
        </button>
        <button onclick="setActiveTab('projects')" class="nav-btn flex flex-col items-center py-2 px-4 text-gray-400 hover:text-green-600 transition-colors">
          <span class="text-xl mb-1">🚀</span>
          <span class="text-xs font-medium">پروژه‌ها</span>
        </button>
        <button onclick="setActiveTab('library')" class="nav-btn flex flex-col items-center py-2 px-4 text-gray-400 hover:text-green-600 transition-colors">
          <span class="text-xl mb-1">📖</span>
          <span class="text-xs font-medium">کتابخانه</span>
        </button>
        <button onclick="setActiveTab('profile')" class="nav-btn flex flex-col items-center py-2 px-4 text-gray-400 hover:text-green-600 transition-colors">
          <span class="text-xl mb-1">👤</span>
          <span class="text-xs font-medium">پروفایل</span>
        </button>
      </div>
    </div>
  </div>
  
  <script>
    let currentTab = 'home';
    
    function setActiveTab(tab) {
      currentTab = tab;
      document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.className = 'nav-btn flex flex-col items-center py-2 px-4 text-gray-400 hover:text-green-600 transition-colors';
      });
      event.target.closest('.nav-btn').className = 'nav-btn flex flex-col items-center py-2 px-4 text-green-600 transition-colors';
      
      if (tab !== 'home') {
        const names = {'courses': 'دوره‌ها', 'projects': 'پروژه‌ها', 'library': 'کتابخانه', 'profile': 'پروفایل'};
        document.getElementById('content-sections').innerHTML = 
          '<div class="text-center py-20 text-gray-600 bg-white/80 backdrop-blur rounded-2xl"><h2 class="text-2xl font-bold mb-4">صفحه ' + (names[tab] || tab) + '</h2><p class="text-gray-500">محتوای این بخش به زودی اضافه خواهد شد</p></div>';
      } else {
        loadHomeContent();
      }
    }
    
    async function loadData() {
      try {
        console.log('بارگیری داده‌ها از API...');
        const baseUrl = window.location.protocol + '//' + window.location.hostname + ':5000';
        const [coursesResponse, projectsResponse, documentsResponse] = await Promise.all([
          fetch(baseUrl + '/api/courses').catch(() => ({ ok: false })),
          fetch(baseUrl + '/api/projects').catch(() => ({ ok: false })),
          fetch(baseUrl + '/api/documents').catch(() => ({ ok: false }))
        ]);
        
        const courses = coursesResponse.ok ? await coursesResponse.json() : [];
        const projects = projectsResponse.ok ? await projectsResponse.json() : [];
        const documents = documentsResponse.ok ? await documentsResponse.json() : [];
        
        document.getElementById('courses-count').textContent = courses.length;
        document.getElementById('projects-count').textContent = projects.length;
        document.getElementById('documents-count').textContent = documents.length;
        
        const documentsGrid = document.getElementById('documents-grid');
        if (documents.length > 0) {
          documentsGrid.innerHTML = documents.slice(0, 6).map(doc => 
            '<div class="bg-white rounded-xl shadow-lg p-4 card-hover transition-all duration-300">' +
            '<h3 class="font-bold text-gray-800 mb-2 text-sm">' + doc.title + '</h3>' +
            '<p class="text-gray-600 text-xs mb-3">' + (doc.excerpt || doc.content || 'محتوای مفید برای یادگیری') + '</p>' +
            '<div class="flex justify-between items-center">' +
            '<span class="text-xs text-gray-500">' + (doc.author || 'متخصص کشاورزی') + '</span>' +
            '<button class="bg-purple-500 text-white px-3 py-1 rounded text-xs hover:bg-purple-600 transition-colors">مشاهده</button>' +
            '</div></div>'
          ).join('');
        } else {
          documentsGrid.innerHTML = '<div class="col-span-full text-center py-8 text-gray-500"><p>مقالات در حال بارگیری...</p></div>';
        }
        
        document.getElementById('loading-state').style.display = 'none';
        document.getElementById('content-sections').style.display = 'block';
      } catch (error) {
        console.warn('خطا در بارگیری:', error);
        setTimeout(() => {
          document.getElementById('courses-count').textContent = '0';
          document.getElementById('projects-count').textContent = '0';
          document.getElementById('documents-count').textContent = '0';
          document.getElementById('loading-state').style.display = 'none';
          document.getElementById('content-sections').style.display = 'block';
        }, 2000);
      }
    }
    
    function loadHomeContent() {
      document.getElementById('content-sections').style.display = 'block';
    }
    
    document.addEventListener('DOMContentLoaded', function() {
      console.log('پیستاط بارگذاری شد');
      loadData();
    });
  </script>
  
  <div style="height: 80px;"></div>
</body>
</html>`);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('Pistach Server running on http://localhost:' + PORT);
});