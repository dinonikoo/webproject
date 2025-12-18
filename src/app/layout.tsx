'use client';

import './globals.css';
import Header from '@/components/Header';
import { usePathname } from 'next/navigation';
import { UserProvider } from '@/context/UserContext';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideHeader = pathname.startsWith('/login') || pathname.startsWith('/register');

  return (
    <html lang="ru">
      <body>
        <UserProvider>
          {!hideHeader && <Header />}
          <main>{children}</main>
        </UserProvider>
      </body>
    </html>
  );
}
