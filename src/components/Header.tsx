'use client';

import { useMenu } from '@/context/MenuContext';
import { useUser } from '@/context/UserContext';
import { GlobalRole } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiLogOut, FiMenu, FiUser, FiX } from 'react-icons/fi';

export default function Header() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const { toggleMenu } = useMenu();
  const isAdmin = user?.role === GlobalRole.ADMIN;
  const {menuOpen} = useMenu();

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth <= 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);


  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        zIndex: 100, 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      {/* Левая часть */}
      {user && !(isMobile && isAdmin) && (<button
        onClick={() => router.push('/boards')}
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: '#2563eb',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Планировщик задач
      </button>)}

      <div style={{ display: 'flex', alignItems: 'center' }}>
        {user && isAdmin && isMobile && (
          <>
            {/* Кнопка бургер */}
            <button
              onClick={toggleMenu}
              style={{
                fontSize: 28,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#2b2b2bff',
                display: 'block',
                transition: 'transform 0.25s ease',
              }}
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </>
        )}
      </div>
              
      {/* Правая часть */}
      {user ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            position: 'relative',
          }}
        >
          {/* Профиль */}
          <button
            onClick={() => router.push(`/users/${user?.id}`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 10px',
              borderRadius: 8,
              backgroundColor: 'transparent',
              border: '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.1)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'transparent')
            }
          >
            <FiUser size={18} color="#2563eb" />
            <span style={{ fontWeight: 500, fontSize: 17, color: '#334155' }}>
              {user.name}
            </span>
          </button>

          {/* Кнопка выхода */}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 6,
              borderRadius: 8,
              backgroundColor: 'transparent',
              border: '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'transparent')
            }
          >
            <FiLogOut size={23} color="#ef4444" />
          </button>
        </div>
      ) : (
        <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Загрузка…</span>
      )}
    </header>
  );
}
