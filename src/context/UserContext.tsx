'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  role: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Логируем любые изменения user
  useEffect(() => {
    console.log('[UserContext] user изменился:', user);
  }, [user]);

  useEffect(() => {
  const fetchMe = async () => {
    try {
      const res = await fetch('/api/me', {
        credentials: 'include',
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const user = await res.json();
      setUser(user);
    } catch (err) {
      console.error('[UserContext] /me error', err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  fetchMe();
}, []);


  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
