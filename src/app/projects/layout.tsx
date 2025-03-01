import { Session } from '@/app/lib/types';
import { getUserSession } from '@/app/lib/session';
import { redirect } from 'next/navigation'; // Use this redirect function for server components
import { fetchProjectsByUser } from '@/app/lib/data';
import ProjectsProvider from './projects-context';
import Header from './header';
import { AppShell, AppShellHeader } from '@mantine/core';

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
  const projects = await fetchProjectsByUser(session.id);

  return (
    <ProjectsProvider projects={projects}>
      <AppShell header={{ height: 60 }} padding={'md'}>
        <AppShellHeader>
          <Header session={session} />
        </AppShellHeader>
        {children}
      </AppShell>
    </ProjectsProvider>
  );
}
