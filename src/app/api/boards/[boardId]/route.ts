// app/api/boards/[boardId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// получение инфо о доске

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ boardId: string }> }
) {
  const { boardId } = await context.params;

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
  }

  const boardIdNum = Number(boardId);
  if (!boardIdNum) {
    return NextResponse.json({ message: 'Invalid boardId' }, { status: 400 });
  }

  const membership = await prisma.boardMember.findUnique({
    where: {
      boardId_userId: {
        boardId: boardIdNum,
        userId: user.id,
      },
    },
  });

  if (!membership) {
    return NextResponse.json(
      { message: 'You are not a member' },
      { status: 403 }
    );
  }

  const board = await prisma.board.findUnique({
    where: { id: boardIdNum },
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
  });

  if (!board) {
    return NextResponse.json(
      { message: 'Board not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(board);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ boardId: string }> }
) {
  const { boardId } = await context.params;

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
  }

  const boardIdNum = Number(boardId);
  if (!boardIdNum) {
    return NextResponse.json({ message: 'Invalid boardId' }, { status: 400 });
  }

  // Проверяем, что пользователь — ADMIN этой доски
  const membership = await prisma.boardMember.findUnique({
    where: {
      boardId_userId: {
        boardId: boardIdNum,
        userId: user.id,
      },
    },
  });

  if (!membership || membership.role !== 'ADMIN') {
    return NextResponse.json(
      { message: 'Only admin can delete this board' },
      { status: 403 }
    );
  }

  // Удаляем доску (BoardMember и Task удалятся каскадно,
  // если у тебя настроены onDelete: Cascade)
  await prisma.board.delete({
    where: { id: boardIdNum },
  });

  return NextResponse.json({ success: true });
}
