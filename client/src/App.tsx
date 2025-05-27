import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import MobileNavbar from "@/components/layout/MobileNavbar";
import Home from "@/pages/home";
import Courses from "@/pages/courses";
import Projects from "@/pages/projects";
import Library from "@/pages/library";
import DocumentViewer from "@/pages/document-viewer";
import MediaPlayer from "@/pages/media-player";
import Admin from "@/pages/admin";
import { User } from "@shared/schema";
import { lazy } from "react";

function Layout({ children }: { children: React.ReactNode }) {
  // Fetch user data (for now using a static ID of 1)
  const { data: user } = useQuery<User>({ 
    queryKey: ['/api/user/1'],
    retry: false,
    // Return null if not found so the app doesn't crash
    queryFn: async ({ queryKey }) => {
      try {
        const res = await fetch(queryKey[0] as string);
        if (res.status === 404) return null;
        await throwIfResNotOk(res);
        return await res.json();
      } catch (err) {
        console.error(err);
        return null;
      }
    }
  });

  // Default user if not found
  const userProfile = user ? {
    name: user.name || "کاربر",
    username: user.username,
    membershipType: user.membershipType || "ساده",
    progress: user.progress || 0
  } : {
    name: "کاربر مهمان",
    username: "مهمان",
    membershipType: "ساده",
    progress: 0
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex flex-col md:flex-row flex-1">
        <Sidebar user={userProfile} />

        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>

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
          {/* @ts-expect-error */}
          <lazy={() => import("./pages/magazine")} />
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
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;