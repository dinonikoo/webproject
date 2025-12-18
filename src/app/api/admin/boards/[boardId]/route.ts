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

  if (user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'No permission' }, { status: 403 });
    }

  const boardIdNum = Number(boardId);
  if (!boardIdNum) {
    return NextResponse.json({ message: 'Invalid boardId' }, { status: 400 });
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

  if (user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'No permission' }, { status: 403 });
    }

  await prisma.board.delete({
    where: { id: boardIdNum },
  });

  return NextResponse.json({ success: true });
}
