import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { boardId: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
  }

  const boardIdNum = Number(params.boardId);
  if (!boardIdNum) {
    return NextResponse.json({ message: 'Invalid boardId' }, { status: 400 });
  }

  // Проверяем, что пользователь состоит в доске
  const membership = await prisma.boardMember.findUnique({
    where: { boardId_userId: { boardId: boardIdNum, userId: user.id } },
  });
  if (!membership) {
    return NextResponse.json({ message: 'You are not a member' }, { status: 403 });
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
    return NextResponse.json({ message: 'Board not found' }, { status: 404 });
  }

  return NextResponse.json(board);
}
