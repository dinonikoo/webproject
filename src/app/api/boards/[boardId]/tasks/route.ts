import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { BoardRole } from '@prisma/client';

export async function GET(
  _: NextRequest,
  { params }: { params:  Promise<{ boardId: string }>}
) {
    const { boardId } = await params;
    const tasks = await prisma.task.findMany({
        where: { boardId: Number(boardId) },
        orderBy: { createdAt: 'asc' },
        include: { createdBy: { select: {  id: true, name: true } } },
    });
  return NextResponse.json(tasks);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
    const user = await getCurrentUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { boardId } = await params;
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
      { message: 'You are not a member of this board' },
      { status: 403 }
    );
  }

  if (membership.role !== BoardRole.ADMIN) {
    return NextResponse.json(
      { message: 'No permission to create tasks' },
      { status: 403 }
    );
  }

    const { title, description } = await req.json();

    const task = await prisma.task.create({
        data: {
        title,
        description,
        boardId: Number(boardId),
        createdById: user.id,
        },
        include: {
            createdBy: {
                select: {
                id: true,
                name: true,
                },
            },
        },
    });

  return NextResponse.json(task);
}
