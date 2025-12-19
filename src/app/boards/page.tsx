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
  createdAt: string;
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
      <h1 style={{ textAlign: 'center', marginBottom: 24, fontSize: 25 }}>Мои доски</h1>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {/* Создание новой доски */}
      <div style={{ maxWidth: 600, margin: '0 auto 32px', display: 'flex', gap: 8 }}>
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
            backgroundColor: '#fff',
            color: '#1e293b',
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
            fontWeight: 500,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Создать доску
        </button>
      </div>


      {/* Список досок */}
      <div
        style={{
          display: 'flex',
          gap: 24,
          maxWidth: 1200,
          margin: '0 auto',
          flexWrap: 'wrap', 
          justifyContent: 'center' 
        }}
      >
        {boards.map((board, idx) => (
          <div
            key={board.id}
            style={{
              width: '100%',
              maxWidth: 250,
              padding: 20,
              borderRadius: 16,
              backgroundColor: `hsl(${idx * 40 % 360}, 70%, 89%)`,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 140,
              boxSizing: 'border-box',
              textAlign: 'center',
            }}
            onClick={() => router.push(`/boards/${board.id}`)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)';
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 20,
                  color: '#1e293b',
                  marginBottom: 8,
                  wordBreak: 'break-word',
                }}
              >
                {board.name}
              </h2>
              <p style={{ fontSize: 12, color: '#555' }}>
                Создано: {new Date(board.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
