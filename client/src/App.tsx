import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/Header";
import MobileNavbar from "@/components/layout/MobileNavbar";
import Home from "@/pages/home-simple";
import Courses from "@/pages/courses-simple";
import Projects from "@/pages/projects-simple";
import Library from "@/pages/library-simple";
import Categories from "@/pages/categories-simple";
import Profile from "@/pages/profile-simple";
import Cart from "@/pages/cart";
import Favorites from "@/pages/favorites";
import DocumentViewer from "@/pages/document-viewer";
import MediaPlayer from "@/pages/media-player";
import Admin from "@/pages/admin";
import { lazy, Suspense } from "react";

// Import Magazine component
const Magazine = lazy(() => import("./pages/magazine"));

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50" dir="rtl">
      <Header />
      <main className="pb-16 md:pb-0">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </main>
      <MobileNavbar />
    </div>
  );
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

function Router() {
  return (
    <Switch>
      <Route path="/">
        <Layout>
          <Home />
        </Layout>
      </Route>
      <Route path="/courses">
        <Layout>
          <Courses />
        </Layout>
      </Route>
      <Route path="/projects">
        <Layout>
          <Projects />
        </Layout>
      </Route>
      <Route path="/library">
        <Layout>
          <Library />
        </Layout>
      </Route>
      <Route path="/categories">
        <Layout>
          <Categories />
        </Layout>
      </Route>
      <Route path="/profile">
        <Layout>
          <Profile />
        </Layout>
      </Route>
      <Route path="/cart">
        <Layout>
          <Cart />
        </Layout>
      </Route>
      <Route path="/favorites">
        <Layout>
          <Favorites />
        </Layout>
      </Route>
      <Route path="/documents/:id">
        <Layout>
          <DocumentViewer />
        </Layout>
      </Route>
      <Route path="/media/:id">
        <Layout>
          <MediaPlayer />
        </Layout>
      </Route>
      <Route path="/admin">
        <Layout>
          <Admin />
        </Layout>
      </Route>
      <Route path="/magazine">
        <Layout>
          <Suspense fallback={<div>در حال بارگذاری...</div>}>
            <Magazine />
          </Suspense>
        </Layout>
      </Route>
      <Route>
        <Layout>
          <NotFound />
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;