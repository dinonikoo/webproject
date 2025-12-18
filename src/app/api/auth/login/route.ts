// src/app/api/auth/login/route.ts
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  const { name, password } = await req.json();
  console.log('[LOGIN ATTEMPT]', name); // логируем попытку логина

  const user = await prisma.user.findUnique({
    where: { name },
  });

  if (!user) {
    return new Response('User not found', { status: 401 });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    return new Response('Invalid password', { status: 401 });
  }

  console.log(user?.role);

  // устанавливаем cookie
  return new Response(
    JSON.stringify({ id: user.id, name: user.name, role: user.role }),
    {
      headers: {
        'Set-Cookie': `userId=${user.id}; Path=/; HttpOnly`,
      },
    }
  );
}
