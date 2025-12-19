'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiUser } from 'react-icons/fi';

interface User {
  id: number;
  name: string;
  role?: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/users')
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ textAlign: 'center', marginTop: 50 }}>Загрузка...</p>;

  const colors = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#14b8a6'];

  return (
    <div
      style={{
        padding: '32px 24px',
        maxWidth: 1200,
        margin: '0 auto',
        fontFamily: 'Inter, sans-serif',
        color: '#333',
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          fontSize: 28,
          marginBottom: 32,
          color: '#1e293b',
        }}
      >
        Все пользователи
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 24,
        }}
      >
        {users.map((user, index) => {
          const color = colors[index % colors.length];
          return (
            <div
              key={user.id}
              onClick={() => router.push(`/admin/users/${user.id}`)}
              style={{
                backgroundColor: `${color}20`,
                border: `2px solid ${color}`,
                borderRadius: 16,
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLDivElement;
                target.style.transform = 'translateY(-5px)';
                target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                target.style.backgroundColor = `${color}40`;
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLDivElement;
                target.style.transform = 'translateY(0)';
                target.style.boxShadow = 'none';
                target.style.backgroundColor = `${color}20`;
              }}
            >
              <FiUser size={36} color={color} style={{ marginBottom: 12 }} />
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 16,
                  color: '#1e293b',
                  textAlign: 'center',
                }}
              >
                {user.name}
              </span>
            </div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)) !important;
          }
        }
        @media (max-width: 768px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)) !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
