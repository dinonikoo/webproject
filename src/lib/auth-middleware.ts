import type { NextRequest } from 'next/server';
import { prisma } from './prisma';

export async function getUserFromRequest(req: NextRequest) {
  const userId = req.cookies.get('userId')?.value;

  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: Number(userId) },
  });
}
