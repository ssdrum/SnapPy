import { getUserSession } from '@/app/lib/session';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await getUserSession();
  console.log(user);

  // redirect if logged in
  if (user) {
    redirect('/dashboard');
  }

  return 'Home';
}