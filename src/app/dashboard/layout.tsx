import { Session } from '@/app/lib/types';
import { getUserSession } from '@/app/lib/session';
import { redirect } from 'next/navigation'; // Use this redirect function for server components
import { fetchProjectsByUser } from '@/app/lib/data';
import DashboardProvider from '@/app/dashboard/dashboard-context';

// Handle authorization in layout page
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is logged in
  const session: Session = await getUserSession();
  if (session === undefined) {
    redirect('/');
  }

  // Fetch user's projects
  const userId = session.id;
  const projects = await fetchProjectsByUser(userId);

  return (
    <>
      <DashboardProvider projects={projects}>{children}</DashboardProvider>
    </>
  );
}
