import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

// Simple auth state management
let authState = {
  user: null as User | null,
  isLoading: true,
  isAuthenticated: false,
  checkedOnce: false
};

export function useAuth() {
  const [, forceUpdate] = useState({});

  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ['/api/auth/user'],
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    enabled: !authState.checkedOnce, // Only check once
  });

  useEffect(() => {
    if (!authState.checkedOnce && (!isLoading || error)) {
      authState.checkedOnce = true;
      authState.user = user || null;
      authState.isAuthenticated = !!user;
      authState.isLoading = false;
      forceUpdate({});
    }
  }, [user, isLoading, error]);

  return {
    user: authState.user,
    isLoading: authState.isLoading,
    isAuthenticated: authState.isAuthenticated,
    isAdmin: authState.user?.role === 'admin',
    error: null
  };
}