import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  _: NextRequest,
  { params }: { params:  Promise<{ taskId: string }> }
) {
    const {taskId} = await params;
  await prisma.task.delete({
    where: { id: Number(taskId) },
  });

  return NextResponse.json({ success: true });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { status } = await req.json();
  const {taskId} = await params;

  const task = await prisma.task.update({
    where: { id: Number(taskId) },
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

  return NextResponse.json(task);
}
