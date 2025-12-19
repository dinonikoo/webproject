'use client';

import './globals.css';
import Header from '@/components/Header';
import { usePathname } from 'next/navigation';
import { UserProvider } from '@/context/UserContext';
import { MenuProvider } from '@/context/MenuContext';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideHeader = pathname.startsWith('/login') || pathname.startsWith('/register');

  return (
    <html lang="ru">
      <body>
        <UserProvider>
          <MenuProvider>
            {!hideHeader && <Header />}
            <main style={{ paddingTop: hideHeader? 0: 64 }}>{children}</main>
          </MenuProvider>
        </UserProvider>
      </body>
    </html>
  );
}
