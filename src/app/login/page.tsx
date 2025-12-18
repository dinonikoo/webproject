'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();
  const { user, setUser, isLoading } = useUser();

  // 🔹 Если пользователь уже залогинен — редиректим на /boards
  useEffect(() => {
    if (isLoading) return;
    if (!user) return;

    if (user?.role === 'ADMIN') {
      router.replace('/admin');
    } else {
      router.replace('/boards');
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      });

      if (!res.ok) {
        setError('Неверный логин или пароль');
        return;
      }

      // сервер возвращает { id, name, role }
      const data = await res.json();
      console.log('[LoginPage] Успешный логин:', data);

      // сохраняем пользователя в контекст
      setUser(data);
    } catch (err) {
      console.error('[LoginPage] Ошибка при логине:', err);
      setError('Ошибка при логине');
    }
  };

  // Пока идёт проверка авторизации или если уже залогинен — ничего не рендерим
  if (isLoading || user) return null;

  return (
    <div
      style={{
        backgroundColor: '#fff',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          width: 360,
          padding: 24,
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          borderRadius: 12,
        }}
      >
        <h1 style={{ textAlign: 'center', marginBottom: 20, color: '#333' }}>
          Вход
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              width: '100%',
              padding: 10,
              marginBottom: 12,
              borderRadius: 8,
              border: '1px solid #ccc',
              outline: 'none',
              fontSize: 14,
              color: '#333',
            }}
          />

          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: 10,
              marginBottom: 12,
              borderRadius: 8,
              border: '1px solid #ccc',
              outline: 'none',
              fontSize: 14,
              color: '#333',
            }}
          />

          <button
            type="submit"
            style={{
              width: '100%',
              padding: 10,
              borderRadius: 8,
              border: 'none',
              backgroundColor: '#3b82f6',
              color: '#fff',
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            Войти
          </button>
        </form>

        {error && (
          <p style={{ color: 'red', marginTop: 10, textAlign: 'center' }}>
            {error}
          </p>
        )}

        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <span style={{ color: '#333' }}>Нет аккаунта? </span>
          <Link
            href="/register"
            style={{ color: '#3b82f6', textDecoration: 'underline' }}
          >
            Регистрация
          </Link>
        </div>
      </div>
    </div>
  );
}
