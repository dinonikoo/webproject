import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
    req: NextRequest, 
    context: { params: Promise<{ userId: string }>}
) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'ADMIN') {
    return NextResponse.json({ message: 'No permission' }, { status: 403 });
  }

  const { userId } = await context.params;

  const userIdNum = Number(userId);
  if(!userIdNum) {
    return NextResponse.json({ message: 'Invalid userId' }, { status: 400 });
  }
  
  const user = await prisma.user.findUnique({
    where: { id: userIdNum },
    select: {
      id: true,
      name: true,
      role: true,
      boards: {
        select: {
          board: { select: { id: true, name: true } },
          role: true,
        },
      },
      tasks: {
        select: {
          id: true,
          title: true,
          status: true,
          board: { select: { id: true, name: true } },
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

  return NextResponse.json(user);
}
