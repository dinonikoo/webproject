'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Board {
  id: number;
  name: string;
  createdAt: string;
}

export default function BoardsPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin/boards')
      .then((res) => res.json())
      .then(setBoards);
  }, []);

  return (
    <div
      style={{
        padding: 24,
        fontFamily: 'sans-serif',
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}
    >
      <h1
        style={{
          fontSize: 28,
          color: '#1e293b',
          marginBottom: 30,
          textAlign: 'center',
        }}
      >
        Все доски
      </h1>

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
            onClick={() => router.push(`/admin/boards/${board.id}`)}
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
