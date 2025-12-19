import { cookies } from 'next/headers';
import { prisma } from './prisma';

export async function getCurrentUser(req?: Request) {
  if (req) {
    // Логируем основные свойства запроса
    console.log('[REQ] method:', req.method, 'url:', req.url);
    console.log('[REQ] headers:', Object.fromEntries(req.headers.entries()));

    const authHeader = req.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice('Bearer '.length);
      const user = await prisma.user.findUnique({ where: { telegramToken: token } });
      console.log('[AUTH] Telegram token:', token, '-> user:', user?.name ?? 'not found');
      return user;
    }
  }

  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (userId) {
    const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
    console.log('[AUTH] Web cookie userId:', userId, '-> user:', user?.name ?? 'not found');
    return user;
  }

  console.log('[AUTH] No authentication found');
  return null;
}
