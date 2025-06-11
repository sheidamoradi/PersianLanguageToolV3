import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import TestSimple from "@/pages/test-simple";

function Router() {
  return (
    <Switch>
      <Route path="/">
        <TestSimple />
      </Route>
      <Route>
        <div className="p-4">404 - صفحه یافت نشد</div>
      </Route>
    </Switch>
  );
}

function App() {
  queryClient.setDefaultOptions({
    queries: {
      retry: 1,
      queryFn: async ({ queryKey }) => {
        const response = await fetch(queryKey[0] as string);
        if (!response.ok) {
          const text = (await response.text()) || response.statusText;
          throw new Error(`${response.status}: ${text}`);
        }
        return response.json();
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;