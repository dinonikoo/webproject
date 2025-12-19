'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { FiUser, FiClipboard } from 'react-icons/fi';
import { Role } from '@/lib/types/Role';

interface Board {
  board: { id: number; name: string };
  role: Role;
}

interface Task {
  id: number;
  title: string;
  status: string;
  board: { id: number; name: string };
  createdAt: string;
  updatedAt: string;
}

interface UserInfo {
  id: number;
  name: string;
  role: string;
  boards: Board[];
  tasks: Task[];
}

export default function UserDetail() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId; 

  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${userId}`);
        if (!res.ok) throw new Error('Не удалось загрузить данные пользователя');
        const data = await res.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading)
    return <p style={{ textAlign: 'center', marginTop: 50 }}>Загрузка...</p>;
  if (error)
    return (
      <p style={{ color: 'red', textAlign: 'center', marginTop: 50 }}>{error}</p>
    );
  if (!user) return null;

  return (
    <div
      style={{
        maxWidth: 900,
        margin: '0 auto',
        padding: 24,
        fontFamily: "'Inter', sans-serif",
        color: '#334155',
      }}
    >
      {/* Шапка пользователя */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 32,
          padding: 16,
          backgroundColor: '#fff',
          borderRadius: 12,
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
        }}
      >
        <FiUser size={32} color="#3b82f6" />
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
            {user.name}
          </h1>
          <p
            style={{
              fontSize: 14,
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <FiClipboard /> Глобальная роль: {user.role}
          </p>
        </div>
      </div>

      {/* Доски */}
      <section style={{ marginBottom: 32 }}>
        <h2
          style={{
            marginBottom: 16,
            borderBottom: '2px solid #3b82f6',
            paddingBottom: 4,
          }}
        >
          Доски
        </h2>
        {user.boards.length === 0 && (
          <p>Пользователь не состоит ни в одной доске</p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {user.boards.map((b) => (
            <div
              key={b.board.id}
              style={{
                padding: 16,
                borderRadius: 12,
                cursor: 'pointer',
                backgroundColor: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.3s ease',
                border: '2px solid #3b82f6',
              }}
              onClick={() => router.push(`/boards/${b.board.id}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow =
                  '0 8px 16px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 500 }}>{b.board.name}</span>
              <span style={{ fontSize: 12, color: '#64748b' }}>{b.role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Задачи */}
      <section>
        <h2
          style={{
            marginBottom: 16,
            borderBottom: '2px solid #3b82f6',
            paddingBottom: 4,
          }}
        >
          Задачи
        </h2>
        {user.tasks.length === 0 && <p>Пользователь не создавал задачи</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {user.tasks.map((task) => (
            <div
              key={task.id}
              style={{
                padding: 12,
                borderLeft: `6px solid ${
                  task.status === 'DONE'
                    ? '#22c55e'
                    : task.status === 'IN_PROGRESS'
                    ? '#f59e0b'
                    : '#3b82f6'
                }`,
                borderRadius: 8,
                backgroundColor: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 4,
                }}
              >
                <strong>{task.title}</strong>
                <span style={{ fontSize: 12, color: '#64748b' }}>
                  {task.status}
                </span>
              </div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>
                Доска: {task.board.name}
              </div>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                Создано: {new Date(task.createdAt).toLocaleString()} | Обновлено:{' '}
                {new Date(task.updatedAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
