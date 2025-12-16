import { redirect } from 'next/navigation';

export default function Home() {
  // можно сделать редирект на login
  redirect('/login');
}
