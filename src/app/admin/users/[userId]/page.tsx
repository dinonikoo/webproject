'use client';
import { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
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

export default function AdminUserDetail() {
  const params = useParams();
  const pathname = usePathname(); // /admin/boards/123
  const userId = pathname.split('/')[3];

  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/users/${userId}`);
        if (!res.ok) throw new Error('Не удалось загрузить данные пользователя');
        const data = await res.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  if (loading) return <p style={{ textAlign: 'center', marginTop: 50 }}>Загрузка...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center', marginTop: 50 }}>{error}</p>;
  if (!user) return null;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24, fontFamily: 'sans-serif', color: '#333' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 16 }}>{user.name}</h1>
      <p style={{ textAlign: 'center', marginBottom: 24, color: '#555' }}>Глобальная роль: {user.role}</p>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ marginBottom: 12, borderBottom: '2px solid #3b82f6', paddingBottom: 4 }}>Доски</h2>
        {user.boards.length === 0 && <p>Пользователь не состоит ни в одной доске</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {user.boards.map((b) => (
            <div
                key={b.board.id}
                style={{
                    padding: 16,
                    border: '2px solid #3b82f6', 
                    borderRadius: 12,
                    cursor: 'pointer',
                    backgroundColor: '#fff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s ease',
                }}
                onClick={() => router.push(`/admin/boards/${b.board.id}`)}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                }}
                >
                <span style={{ fontSize: 16, color: '#1e293b', fontWeight: 500 }}>{b.board.name}</span>
                <span style={{ fontSize: 12, color: '#555' }}>{b.role}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: 12, borderBottom: '2px solid #3b82f6', paddingBottom: 4 }}>Задачи</h2>
        {user.tasks.length === 0 && <p>Пользователь не создавал задачи</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {user.tasks.map((task) => (
            <div
              key={task.id}
              style={{
                padding: 12,
                borderLeft: `6px solid ${task.status === 'DONE' ? '#22c55e' : task.status === 'IN_PROGRESS' ? '#f59e0b' : '#3b82f6'}`,
                borderRadius: 8,
                backgroundColor: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <strong>{task.title}</strong>
                <span style={{ fontSize: 12, color: '#555' }}>{task.status}</span>
              </div>
              <div style={{ fontSize: 12, color: '#777', marginBottom: 4 }}>
                Доска: {task.board.name}
              </div>
              <div style={{ fontSize: 12, color: '#777' }}>
                Создано: {new Date(task.createdAt).toLocaleString()} | Обновлено: {new Date(task.updatedAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
