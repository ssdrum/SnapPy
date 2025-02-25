import { Session } from '@/app/lib/types';
import { getUserSession } from '@/app/lib/session';
import { redirect } from 'next/navigation'; // Use this redirect function for server components
import { fetchProjectsByUser } from '@/app/lib/data';
import ProjectsProvider from './projects-context';
import Header from './header';

// Handle authorization in layout page
export default async function ProjectsLayout({
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
      <Header userName={session.name} userEmail={session.email} />
      <ProjectsProvider projects={projects}>{children}</ProjectsProvider>
    </>
  );
}
