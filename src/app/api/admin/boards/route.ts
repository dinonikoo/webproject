import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'ADMIN') {
    return new Response('Вам запрещено просматривать эту страницу', { status: 403 });
  }

  const boards = await prisma.board.findMany({
    include: {
      _count: { select: { tasks: true } },
    },
  });

  return Response.json(boards);
}
