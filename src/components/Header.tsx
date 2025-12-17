'use client';

import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, setUser } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    // Очистка состояния и localStorage
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        borderBottom: '1px solid #ccc',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      }}
    >
      <button
        onClick={() => router.push('/boards')}
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: '#3b82f6',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Мои доски
      </button>

      {user ? (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontWeight: 500, color: '#333' }}>{user.name}</span>
          <button
            onClick={handleLogout}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              border: 'none',
              backgroundColor: '#f87171',
              color: '#fff',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ef4444')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f87171')}
          >
            Выйти
          </button>
        </div>
      ) : (
        <span style={{ color: '#888', fontStyle: 'italic' }}>Загрузка...</span>
      )}
    </header>
  );
}