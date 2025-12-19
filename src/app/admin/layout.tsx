'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutDashboard, Users, Menu, X } from 'lucide-react';
import { useMenu } from '@/context/MenuContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [isMobile, setIsMobile] = useState(false);
  const { menuOpen } = useMenu();
  const { toggleMenu } = useMenu();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const menuItems = [
    {
      label: 'Все доски',
      href: '/admin/boards',
      icon: <LayoutDashboard size={18} />,
    },
    {
      label: 'Все пользователи',
      href: '/admin/users',
      icon: <Users size={18} />,
    },
  ];

  const Sidebar = (
    <aside
      style={{
        width: 260,
        padding: isMobile? '90px 16px':'24px 16px',
        background: '#ffffffff',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        position: isMobile ? 'fixed' : 'relative',
        top: 0,
        left: 0,
        height: '100vh',
        zIndex: 50,
        boxShadow: '2px 2px 10px rgba(0,0,0,0.05)',
        transform: isMobile && !menuOpen ? 'translateX(-100%)' : 'translateX(0)',
        transition: 'transform 0.3s ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1e293b' }}>
          Админка
        </h3>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <button
              key={item.href}
              onClick={() => {
                router.push(item.href);
                toggleMenu();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                borderRadius: 8,
                border: 'none',
                background: isActive ? '#e8f0ff' : 'transparent',
                color: isActive ? '#2563eb' : '#334155',
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(6px) scale(1.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0) scale(1)';
              }}

            >
              {isActive && (
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 8,
                    bottom: 8,
                    width: 4,
                    borderRadius: 4,
                    background: '#2563eb',
                    transform: isActive ? 'scaleY(1)' : 'scaleY(0)',
                    transformOrigin: 'top',
                    transition: 'transform 0.25s ease',
                  }}
                />
              )}

              {item.icon}
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );

  return (
    <div style={{ display: 'flex',  minHeight: '100vh', background: '#fcfcfcff' }}>
      {/* Sidebar */}
      {Sidebar}

      {/* Overlay */}
      {isMobile && menuOpen && (
        <div
          onClick={ toggleMenu}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.3)',
            zIndex: 30,
          }}
        />
      )}

      {/* Content */}
      <main
        style={{
          flex: 1,
          padding: isMobile ? '80px 16px 16px' : 32,
        }}
      >
        {children}
      </main>
    </div>
  );
}
