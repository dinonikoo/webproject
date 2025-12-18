'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Board {
  id: number;
  name: string;
}

export default function AdminBoardsPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin/boards')
      .then((res) => res.json())
      .then(setBoards);
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: 24, color: '#1e293b', marginBottom: 24 }}>Все доски</h1>

      {boards.map((board) => (
        <div
          key={board.id}
          style={{
            padding: 16,
            border: '2px solid #3b82f6', 
            borderRadius: 12,
            marginBottom: 12,
            cursor: 'pointer',
            backgroundColor: '#fff',
            transition: 'all 0.2s ease',
          }}
          onClick={() => router.push(`/admin/boards/${board.id}`)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <span style={{ fontSize: 16, color: '#1e293b', fontWeight: 500 }}>{board.name}</span>
        </div>
      ))}
    </div>
  );
}
