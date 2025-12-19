// src/context/MenuContext.tsx
'use client';
import { createContext, useState, useContext } from 'react';

interface MenuContextType {
  menuOpen: boolean;
  toggleMenu: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(prev => !prev);

  return (
    <MenuContext.Provider value={{ menuOpen, toggleMenu }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) throw new Error('useMenu must be used within MenuProvider');
  return context;
};
