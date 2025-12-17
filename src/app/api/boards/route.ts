import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { BoardRole } from '@prisma/client';

// GET /api/boards — возвращает все доски текущего пользователя с участниками
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  console.log('[FETCH BOARDS]', user?.name);
  if (!user) {
    return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
  }

  const boards = await prisma.board.findMany({
    where: {
      members: { some: { userId: user.id } }, // доски, где есть текущий пользователь
    },
    include: {
      members: {
        include: { user: true }, // сразу подтягиваем информацию о пользователях
      },
    },
  });

  return NextResponse.json(boards);
}

// POST /api/boards — создаёт новую доску с текущим пользователем как админом
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
  }

  const { name } = await req.json();
  if (!name) {
    return NextResponse.json({ message: 'Не указано название доски' }, { status: 400 });
  }

  const board = await prisma.board.create({
    data: {
      name,
      members: {
        create: {
          userId: user.id,
          role: BoardRole.ADMIN,
        },
      },
    },
    include: {
      members: {
        include: { user: true }, // сразу возвращаем участников
      },
    },
  });

  return NextResponse.json(board, { status: 201 });
}