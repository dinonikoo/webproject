// src/app/api/auth/logout/route.ts
export async function POST() {
  return new Response(null, {
    headers: {
      'Set-Cookie': 'userId=; Path=/; Max-Age=0',
    },
  });
}
