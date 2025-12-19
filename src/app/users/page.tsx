'use client';

import { useUser } from '@/context/UserContext';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Users() {
  const { user, isLoading } = useUser();
  if (user){ 
    redirect(`/users/${user.id}`);
  }
  else redirect("/login");
}