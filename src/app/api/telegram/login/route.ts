import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
  const { name, password, telegramId } = await req.json();

  const user = await prisma.user.findUnique({ where: { name } });
  if (!user) return new Response('User not found', { status: 401 });

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return new Response('Invalid password', { status: 401 });

  const telegramToken = randomUUID();
  await prisma.user.update({
    where: { id: user.id },
    data: { telegramId: telegramId.toString(), telegramToken },
  });

  return new Response(JSON.stringify({ telegramToken }), { status: 200 });
}
