'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();
  const { user, isLoading } = useUser();

  // 🔹 Если пользователь уже залогинен — редиректим на /boards
  useEffect(() => {
    if (isLoading) return;

    if (user) {
      router.replace('/boards');
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      });

      if (res.ok) {
        // После успешной регистрации отправляем на логин
        router.replace('/login');
      } else {
        setError('Пользователь с таким именем уже существует');
      }
    } catch (err) {
      console.error('[RegisterPage] Ошибка при регистрации:', err);
      setError('Ошибка при регистрации');
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
          Регистрация
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
            Зарегистрироваться
          </button>
        </form>

        {error && (
          <p style={{ color: 'red', marginTop: 10, textAlign: 'center' }}>
            {error}
          </p>
        )}

        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <span style={{ color: '#333' }}>Уже есть аккаунт? </span>
          <Link
            href="/login"
            style={{ color: '#3b82f6', textDecoration: 'underline' }}
          >
            Войти
          </Link>
        </div>
      </div>
    </div>
  );
}
