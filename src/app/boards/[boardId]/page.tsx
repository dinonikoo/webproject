'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface Member {
  userId: number;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
  user: {
    id: number;
    name: string;
  };

  isCurrentUser?: boolean;
}

export default function Page() {
  const router = useRouter();
  const pathname = usePathname(); // /boards/123
  const boardId = pathname.split('/')[2]; // Получаем id доски

  

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
  setError('');
}, [pathname]);


  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<'ADMIN' | 'EDITOR' | 'VIEWER' | null>(null);

  const [newUserId, setNewUserId] = useState('');
  const [newRole, setNewRole] = useState<'ADMIN' | 'EDITOR' | 'VIEWER'>('VIEWER');

  // Получение участников и роли текущего пользователя
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/boards/${boardId}/members`);
      if (!res.ok) {
        if (res.status === 401) router.push('/login');
        throw new Error('Ошибка при загрузке участников');
      }
      const data: Member[] = await res.json();
      setMembers(data);

    const meMember = data.find((m) => m.user.id === currentUserId);
    if (meMember) setCurrentUserRole(meMember.role);

  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
  };

  useEffect(() => {
    fetchMembers();
  }, [boardId]);

  const handleAddMember = async () => {
    setError('');
    if (!newUserId) return;
    try {
      const res = await fetch(`/api/boards/${boardId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: Number(newUserId), role: newRole }),
      });
      if (!res.ok) throw new Error('Не удалось добавить участника');
      const member = await res.json();
      setMembers([...members, member]);
      setNewUserId('');
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
      setMembers(members.filter((m) => m.userId !== userId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: 50, color: '#333' }}>Загрузка...</p>;

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: 24,
        fontFamily: 'sans-serif',
        backgroundColor: '#fff',
        color: '#333', // Весь текст темно-серый
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: 24 }}>Участники доски</h1>

      {error && <p style={{ textAlign: 'center' }}>{error}</p>}

      {/* Добавление участника */}
      <div style={{ maxWidth: 600, margin: '0 auto 24px', display: 'flex', gap: 8 }}>
        <input
          type="number"
          placeholder="ID пользователя"
          value={newUserId}
          onChange={(e) => setNewUserId(e.target.value)}
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
          onChange={(e) => setNewRole(e.target.value as 'ADMIN' | 'EDITOR' | 'VIEWER')}
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
      color: '#333',
    }}
  >
    <div>
      {member.user?.name || 'Неизвестный пользователь'} ({member.role})
    </div>

    {/* Кнопка удаления: только если текущий пользователь админ и это не он сам */}
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

    </div>
  );
}
