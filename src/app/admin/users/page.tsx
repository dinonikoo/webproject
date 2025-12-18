'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/users')
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Загрузка...</p>;

  return (
    <div>
      <h1 style={{ fontSize: 24, color: '#1e293b', marginBottom: 24 }}>Все пользователи</h1>
      {users.map((user: any) => (
        <div
          key={user.id}
          style={{
            padding: 16,
            border: '2px solid #29c269ff', 
            borderRadius: 12,
            marginBottom: 12,
            cursor: 'pointer',
            backgroundColor: '#fff',
            transition: 'all 0.2s ease',
          }}
          onClick={() => router.push(`/admin/users/${user.id}`)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <span style={{ fontSize: 16, color: '#1e293b', fontWeight: 500 }}>{user.name}</span>
        </div>
      ))}
    </div>
  );
}
