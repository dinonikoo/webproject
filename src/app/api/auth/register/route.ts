// src/app/api/auth/register/route.ts
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  const { name, password } = await req.json();

  if (!name || !password) {
    return new Response('Invalid data', { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      passwordHash,
    },
  });

  return Response.json({ id: user.id, name: user.name });
}
