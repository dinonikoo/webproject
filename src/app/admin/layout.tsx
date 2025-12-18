'use client';

import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif', background: '#f0f4f8' }}>
      <aside
        style={{
          width: 240,
          padding: 24,
          borderRight: '1px solid #e5e7eb',
          background: '#fff',
          color: '#111',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <h3 style={{ marginBottom: 16, fontSize: 18, color: '#1e293b' }}>Меню</h3>

        <button
          onClick={() => router.push('/admin/boards')}
          style={{
            padding: '10px 12px',
            borderRadius: 8,
            border: '1.5px solid #3674d6ff',
            backgroundColor: '#fff',
            color: '#3674d6ff',
            fontWeight: 500,
            cursor: 'pointer',
            minWidth: '160px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          Все доски
        </button>

        <button
          onClick={() => router.push('/admin/users')}
          style={{
            padding: '10px 12px',
            borderRadius: 8,
            border: '1.5px solid #3674d6ff',
            backgroundColor: '#fff',
            color: '#3674d6ff',
            fontWeight: 500,
            cursor: 'pointer',
            minWidth: '160px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          Все пользователи
        </button>
      </aside>

      <main style={{ flex: 1, padding: 24 }}>{children}</main>
    </div>
  );
}