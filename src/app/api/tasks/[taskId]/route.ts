import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { BoardRole } from '@prisma/client';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
  }

  const { taskId } = await params;
  const taskIdNum = Number(taskId);
  if (!taskIdNum) {
    return NextResponse.json({ message: 'Invalid taskId' }, { status: 400 });
  }

  const task = await prisma.task.findUnique({
    where: { id: taskIdNum },
    select: { id: true, boardId: true },
  });

  if (!task) {
    return NextResponse.json({ message: 'Task not found' }, { status: 404 });
  }

  const membership = await prisma.boardMember.findUnique({
    where: {
      boardId_userId: {
        boardId: task.boardId,
        userId: user.id,
      },
    },
  });

  if (!membership || membership.role !== BoardRole.ADMIN) {
    return NextResponse.json({ message: 'No permission' }, { status: 403 });
  }

  await prisma.task.delete({
    where: { id: taskIdNum },
  });

  return NextResponse.json({ success: true });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  /** 1. Авторизация */
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
  }

  const { taskId } = await params;
  const taskIdNum = Number(taskId);
  if (!taskIdNum) {
    return NextResponse.json({ message: 'Invalid taskId' }, { status: 400 });
  }

  const { status } = (await req.json()) as {
    status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
  };

  if (!status) {
    return NextResponse.json(
      { message: 'Status is required' },
      { status: 400 }
    );
  }

  const task = await prisma.task.findUnique({
    where: { id: taskIdNum },
    select: { id: true, boardId: true },
  });

  if (!task) {
    return NextResponse.json({ message: 'Task not found' }, { status: 404 });
  }

  const membership = await prisma.boardMember.findUnique({
    where: {
      boardId_userId: {
        boardId: task.boardId,
        userId: user.id,
      },
    },
  });

  if (
    !membership ||
    (membership.role !== BoardRole.ADMIN &&
      membership.role !== BoardRole.EDITOR)
  ) {
    return NextResponse.json({ message: 'No permission' }, { status: 403 });
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskIdNum },
    data: { status },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return NextResponse.json(updatedTask);
}
