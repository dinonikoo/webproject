import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
  const { name, password, telegramId } = await req.json();

  const existingUser = await prisma.user.findUnique({ where: { name } });
  if (existingUser) return new Response('User already exists', { status: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);
  const telegramToken = randomUUID();

  const user = await prisma.user.create({
    data: {
      name,
      passwordHash: hashedPassword,
      telegramId,
      telegramToken
    },
  });

  return new Response(JSON.stringify({ telegramToken }), { status: 201 });
}
