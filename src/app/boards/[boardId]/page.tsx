'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { TaskList } from '../../../components/TaskList';
import { Role } from '@/lib/types/Role';

interface Member {
  userId: number;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
  user: {
    id: number;
    name: string;
  };
  isCurrentUser?: boolean;
}

interface BoardInfo {
  id: number;
  name: string;
  createdAt: string;
}

export default function Page() {
  const router = useRouter();
  const pathname = usePathname(); // /boards/123
  const boardId = pathname.split('/')[2];

  const [board, setBoard] = useState<BoardInfo | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<Role | null>(null);

  const [newUserName, setNewUserName] = useState('');
  const [newRole, setNewRole] = useState<Role>('VIEWER');

  const [showTasks, setShowTasks] = useState(false);

  useEffect(() => {
    setError('');
    fetchBoard();
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);

  const fetchBoard = async () => {
    try {
      const res = await fetch(`/api/boards/${boardId}`);
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        if (res.status === 403) {
          setError('У вас нет доступа к этой доске');
          return;
        }
        throw new Error('Ошибка при загрузке доски');
      }

      const data: BoardInfo = await res.json();
      setBoard(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/boards/${boardId}/members`);
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        if (res.status === 403) {
          setError('У вас нет доступа к этой доске');
          setMembers([]);
          setCurrentUserRole(null);
          setCurrentUserId(null);
          return;
        }
        throw new Error('Ошибка при загрузке участников');
      }

      const data: Member[] = await res.json();
      setMembers(data);

      const me = data.find((m) => m.isCurrentUser);
      if (me) {
        setCurrentUserId(me.userId);
        setCurrentUserRole(me.role);
      } else {
        setError('У вас нет доступа к этой доске');
      }
    } catch (err: any) {
      setError(err.message);
      setMembers([]);
      setCurrentUserRole(null);
      setCurrentUserId(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    setError('');
    if (!newUserName.trim()) return;

    try {
      const res = await fetch(`/api/boards/${boardId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUserName.trim(),
          role: newRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Не удалось добавить участника');
      }

      setMembers((prev) => [...prev, data]);
      setNewUserName('');
      setNewRole('VIEWER');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemoveMember = async (userId: number) => {
    try {
      const res = await fetch(`/api/boards/${boardId}/members`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) throw new Error('Не удалось удалить участника');

      setMembers((prev) => prev.filter((m) => m.userId !== userId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteBoard = async () => {
    try {
      const res = await fetch(`/api/boards/${boardId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Не удалось удалить доску');
      }

      router.push('/boards');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: 50 }}>Загрузка...</p>;
  }

  if (error === 'У вас нет доступа к этой доске') {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'sans-serif',
          color: 'red',
          fontSize: 18,
        }}
      >
        У вас нет доступа к этой доске
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: 24,
        fontFamily: 'sans-serif',
        backgroundColor: '#fff',
        color: '#333',
      }}
    >
      {/* Информация о доске */}
      {board && (
        <div style={{ maxWidth: 600, margin: '0 auto 24px' }}>
          <h1>{board.name}</h1>
          <p style={{ color: '#666' }}>
            Создана: {new Date(board.createdAt).toLocaleDateString()}
          </p>

          {currentUserRole === 'ADMIN' && (
            <button
              onClick={handleDeleteBoard}
              style={{
                marginTop: 12,
                padding: '10px 16px',
                borderRadius: 8,
                border: 'none',
                backgroundColor: '#ef4444',
                color: '#fff',
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              Удалить доску
            </button>
          )}
        </div>
      )}

      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Участники</h2>

      {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

      {/* Добавление участника */}
      {currentUserRole === 'ADMIN' && (
        <div style={{ maxWidth: 600, margin: '0 auto 24px', display: 'flex', gap: 8 }}>
          <input
            type="text"
            placeholder="Имя пользователя"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 8,
              border: '1px solid #3b82f6',
              fontSize: 14,
              outline: 'none',
              color: '#333',
            }}
          />
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value as Role)}
            style={{
              padding: 10,
              borderRadius: 8,
              border: '1px solid #3b82f6',
              fontSize: 14,
              outline: 'none',
              color: '#333',
            }}
          >
            <option value="ADMIN">ADMIN</option>
            <option value="EDITOR">EDITOR</option>
            <option value="VIEWER">VIEWER</option>
          </select>
          <button
            onClick={handleAddMember}
            style={{
              padding: '10px 16px',
              borderRadius: 8,
              border: 'none',
              backgroundColor: '#3b82f6',
              color: '#fff',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Добавить
          </button>
        </div>
      )}

      {/* Список участников */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 600, margin: '0 auto' }}>
        {members.length === 0 && <p>Участников нет</p>}
        {members.map((member) => (
          <div
            key={member.userId}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 12,
              borderRadius: 12,
              border: '2px solid #3b82f6',
              backgroundColor: '#fff',
            }}
          >
            <div>
              {member.user.name} ({member.role})
            </div>

            {currentUserRole === 'ADMIN' && member.userId !== currentUserId && (
              <button
                onClick={() => handleRemoveMember(member.userId)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: 'none',
                  backgroundColor: '#ef4444',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: 12,
                }}
              >
                Удалить
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Кнопка показать/скрыть задачи */}
      <button
        onClick={() => setShowTasks(!showTasks)}
        style={{
          margin: '24px auto',
          display: 'block',
          padding: '10px 16px',
          borderRadius: 8,
          backgroundColor: '#3b82f6',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {showTasks ? 'Скрыть задачи' : 'Показать задачи'}
      </button>

      {showTasks && currentUserRole && (
        <TaskList boardId={boardId} currentUserRole={currentUserRole} />
      )}
    </div>
  );
}
