'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';

interface User {
  id: number;
  name: string;
}

interface BoardMember {
  userId: number;
  role: string;
  user: User;
}

interface Board {
  id: number;
  name: string;
  members: BoardMember[];
}

export default function BoardsPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newBoardName, setNewBoardName] = useState('');

  // Проверка авторизации и загрузка досок
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      const fetchBoards = async () => {
        try {
          const res = await fetch('/api/boards');
          if (!res.ok) throw new Error('Ошибка при загрузке досок');
          const data: Board[] = await res.json();
          setBoards(data); // доски с участниками
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchBoards();
    }
  }, [router, user, isLoading]);

  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) return;

    try {
      const res = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newBoardName }),
      });

      if (!res.ok) throw new Error('Не удалось создать доску');

      const board: Board = await res.json();
      setBoards([...boards, board]);
      setNewBoardName('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Пока идёт загрузка user или досок показываем индикатор
  if (loading || isLoading) return <p style={{ textAlign: 'center', marginTop: 50 }}>Загрузка...</p>;
  if (!user) return null; // редирект будет выполнен useEffect

  return (
    <div style={{ minHeight: 'calc(100vh - 48vh)', padding: 24, fontFamily: 'sans-serif', backgroundColor: '#fff', color: '#333' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 24 }}>Мои доски</h1>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {/* Создание новой доски */}
      <div style={{ maxWidth: 600, margin: '0 auto 24px', display: 'flex', gap: 8 }}>
        <input
          type="text"
          placeholder="Название новой доски"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: '1px solid #3b82f6',
            fontSize: 14,
            outline: 'none',
          }}
        />
        <button
          onClick={handleCreateBoard}
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
          Создать доску
        </button>
      </div>

      {/* Список досок */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
        {boards.length === 0 && <p>Досок нет</p>}
        {boards.map((board) => (
          <Link
            key={board.id}
            href={`/boards/${board.id}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 180,
              height: 100,
              borderRadius: 12,
              border: '2px solid #3b82f6',
              textDecoration: 'none',
              color: '#333',
              fontWeight: 'bold',
              fontSize: 16,
              backgroundColor: '#fff',
              transition: 'transform 0.2s',
            }}
          >
            {board.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
