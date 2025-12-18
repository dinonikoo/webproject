import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { BoardRole } from '@prisma/client';

interface Params {
  boardId: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  const user = await getCurrentUser(); // текущий залогиненный
  if (!user) {
    return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
  }

    if (user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'No permission' }, { status: 403 });
    }

  const { boardId } = await params;
  const id = Number(boardId);
  if (!id) return NextResponse.json({ message: 'Invalid boardId' }, { status: 400 });

  const members = await prisma.boardMember.findMany({
    where: { boardId: id },
    select: {
      userId: true,
      role: true,
      user: { select: { id: true, name: true } },
    },
  });

  // Добавляем флаг для фронта — кто текущий пользователь
  const membersWithCurrentUserFlag = members.map((m) => ({
    ...m,
    isCurrentUser: m.userId === user.id,
  }));

  return NextResponse.json(membersWithCurrentUserFlag);
}


// POST /api/boards/[boardId]/members
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
  }

  if (currentUser.role !== 'ADMIN') {
    return NextResponse.json({ message: 'No permission' }, { status: 403 });
    }


  const { boardId } = await params;
  const boardIdNum = Number(boardId);
  if (!boardIdNum) {
    return NextResponse.json({ message: 'Invalid boardId' }, { status: 400 });
  }

  const { name, role } = (await req.json()) as {
    name?: string;
    role?: BoardRole;
  };

  if (!name || !role) {
    return NextResponse.json(
      { message: 'name or role missing' },
      { status: 400 }
    );
  }

  // Ищем пользователя по уникальному name
  const userToAdd = await prisma.user.findUnique({
    where: { name },
    select: { id: true, name: true },
  });

  if (!userToAdd) {
    return NextResponse.json(
      { message: 'Пользователь не найден' },
      { status: 404 }
    );
  }

  if (userToAdd.id === currentUser.id) {
    return NextResponse.json(
      { message: 'Нельзя добавить самого себя' },
      { status: 400 }
    );
  }

  // Проверка, что пользователь ещё не в доске
  const existingMember = await prisma.boardMember.findUnique({
    where: {
      boardId_userId: {
        boardId: boardIdNum,
        userId: userToAdd.id,
      },
    },
  });

  if (existingMember) {
    return NextResponse.json(
      { message: 'Пользователь уже состоит в доске' },
      { status: 400 }
    );
  }

  const member = await prisma.boardMember.create({
    data: {
      boardId: boardIdNum,
      userId: userToAdd.id,
      role,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return NextResponse.json(member);
}

// DELETE /api/boards/[boardId]/members
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
  }

  if (user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'No permission' }, { status: 403 });
    }


  const { boardId } = await params;
  const id = Number(boardId);
  if (!id) {
    return NextResponse.json({ message: 'Invalid boardId' }, { status: 400 });
  }

  const { userId } = (await req.json()) as { userId?: number };

  if (!userId) {
    return NextResponse.json({ message: 'userId missing' }, { status: 400 });
  }

  await prisma.boardMember.delete({
    where: {
      boardId_userId: {
        boardId: id,
        userId,
      },
    },
  });

  return NextResponse.json({ message: 'Member removed' });
}