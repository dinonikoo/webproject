'use client';

import { Role } from '@/lib/types/Role';
import { useEffect, useState } from 'react';

type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  createdBy: { name: string };
  createdAt: string;
  updatedAt: string;
}

const statusColors: Record<TaskStatus, string> = {
  TODO: '#facc15',
  IN_PROGRESS: '#3b82f6',
  DONE: '#22c55e', 
};

export function TaskList({ boardId, currentUserRole }: { boardId: string; currentUserRole: Role | null; }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const canCreate = currentUserRole === 'ADMIN';
  const canDelete = currentUserRole === 'ADMIN';
  const canMove =
  currentUserRole === 'ADMIN' || currentUserRole === 'EDITOR';


  // Загрузка задач доски
  useEffect(() => {
    fetch(`/api/boards/${boardId}/tasks`)
      .then((res) => res.json())
      .then(setTasks);
  }, [boardId]);

  // Создание новой задачи
  const createTask = async () => {
    if (!title) return;

    const res = await fetch(`/api/boards/${boardId}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });

    const task = await res.json();
    setTasks([...tasks, task]);
    setTitle('');
    setDescription('');
  };

  // Смена статуса задачи
  const moveTask = async (task: Task, status: TaskStatus) => {
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    const updated = await res.json();
    setTasks(tasks.map((t) => (t.id === task.id ? updated : t)));
  };

  // Удаление задачи
  const removeTask = async (id: number) => {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // Функция форматирования даты
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' });

  return (
  <div
    style={{
      maxWidth: 620,
      margin: '24px auto',
      fontFamily: 'sans-serif',
    }}
  >
    <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Задачи</h2>

    {/* Форма создания задачи */}
    {canCreate && (
      <div
        style={{
          padding: 16,
          marginBottom: 32,
          borderRadius: 12,
          backgroundColor: '#f9fafb',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Название задачи"
          style={{
            padding: 12,
            borderRadius: 8,
            border: '1px solid #3b82f6',
            outline: 'none',
            fontSize: 14,
          }}
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Описание (необязательно)"
          style={{
            padding: 12,
            borderRadius: 8,
            border: '1px solid #3b82f6',
            outline: 'none',
            fontSize: 14,
          }}
        />
        <button
          onClick={createTask}
          style={{
            marginTop: 8,
            padding: '12px 16px',
            borderRadius: 10,
            border: 'none',
            backgroundColor: '#3b82f6',
            color: '#fff',
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          Создать задачу
        </button>
      </div>
    )}

    {/* Пустое состояние */}
    {tasks.length === 0 && (
      <p style={{ textAlign: 'center', color: '#777' }}>
        Задач пока нет
      </p>
    )}

    {/* Список задач */}
    {tasks.map((task) => (
      <div
        key={task.id}
        style={{
          marginBottom: 20,
          padding: 18,
          borderRadius: 14,
          backgroundColor: '#fefefeff',
          boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
          borderLeft: `6px solid ${statusColors[task.status]}`,
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
        {/* Заголовок + статус */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 600 }}>
            {task.title}
          </div>
          <span
            style={{
              fontSize: 12,
              padding: '4px 10px',
              borderRadius: 12,
              backgroundColor: '#f3f4f6',
              color: '#555',
            }}
          >
            {task.status}
          </span>
        </div>

        {/* Описание */}
        {task.description && (
          <p
            style={{
              margin: '6px 0 10px',
              color: '#555',
              lineHeight: 1.4,
            }}
          >
            {task.description}
          </p>
        )}

        {/* Метаданные */}
        <div
          style={{
            fontSize: 12,
            color: '#777',
            marginBottom: 12,
          }}
        >
          Создано {task.createdBy?.name ?? '—'} ·{' '}
          {formatDate(task.createdAt)}
          <br />
          Обновлено {formatDate(task.updatedAt)}
        </div>

        {/* Кнопки */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          {canMove && task.status !== 'TODO' && (
            <TaskButton onClick={() => moveTask(task, 'TODO')}>
              ← В TODO
            </TaskButton>
          )}
          {canMove && task.status !== 'IN_PROGRESS' && (
            <TaskButton onClick={() => moveTask(task, 'IN_PROGRESS')}>
              → В прогресс
            </TaskButton>
          )}
          {canMove && task.status !== 'DONE' && (
            <TaskButton onClick={() => moveTask(task, 'DONE')}>
              → В DONE
            </TaskButton>
          )}
          {canDelete && (
            <TaskButton danger onClick={() => removeTask(task.id)}>
              🗑 Удалить
            </TaskButton>
          )}
        </div>
      </div>
    ))}
  </div>
);
}

function TaskButton({
  children,
  danger,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  danger?: boolean;
}) {
  return (
    <button
      {...props}
      style={{
        padding: '8px 14px',
        borderRadius: 10,
        border: 'none',
        backgroundColor: danger ? '#ef4444' : '#e5e7eb',
        color: danger ? '#fff' : '#111',
        fontSize: 13,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}

