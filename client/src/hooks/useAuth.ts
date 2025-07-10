import { useQuery } from '@tanstack/react-query';

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ['/api/auth/user'],
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: true,
  });

  // Handle 401 errors gracefully - user is not authenticated
  const isAuthError = error && (error as any).message?.includes('401');
  
  return {
    user,
    isLoading: isLoading && !isAuthError,
    isAuthenticated: !!user && !isAuthError,
    isAdmin: user?.role === 'admin',
    error: isAuthError ? null : error
  };
}