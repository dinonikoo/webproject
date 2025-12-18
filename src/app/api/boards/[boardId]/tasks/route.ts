import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

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
    
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { boardId } = await params;

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