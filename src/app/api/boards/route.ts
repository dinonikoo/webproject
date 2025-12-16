import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { BoardRole } from '@prisma/client';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });

  const boards = await prisma.boardMember.findMany({
    where: { userId: user.id },
    include: { board: true },
  });

  return NextResponse.json(boards);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });

  const { name } = await req.json();
  if (!name) return NextResponse.json({ message: 'Не указано название доски' }, { status: 400 });

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
  });

  return NextResponse.json(board, { status: 201 });
} 