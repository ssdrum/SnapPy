import React from 'react';
import { redirect } from 'next/navigation';
import { Session, getUserSession } from '@/app/lib/session';
import {
  fetchProjectById,
  parseBlocksFromDB,
  parseVariablesFromDB,
} from '@/app/lib/data';
import ProjectProvider from './contexts/project-context';
import BlocksProvider from './contexts/blocks-context';

interface EditorLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function EditorLayout({
  children,
  params,
}: EditorLayoutProps) {
  // Check if user is authenticated
  const session: Session = await getUserSession();
  if (session === undefined) {
    redirect('/');
  }

  // Take project id from url
  const { id } = await params;
  // Fetch project data
  const project = await fetchProjectById(Number(id));
  if (!project) {
    redirect('/projects/not-found'); // TODO: Implement not found page
  }

  // User is trying to access someone else's project
  if (project.userId !== session.id) {
    redirect('/projects/not-found'); // TODO: Implement not found page
  }

  const canvasBlocks = parseBlocksFromDB(project.canvasBlocks);
  const variables = parseVariablesFromDB(project.variables);

  return (
    <ProjectProvider project={project}>
      <BlocksProvider canvasBlocks={canvasBlocks} variables={variables}>
        {children}
      </BlocksProvider>
    </ProjectProvider>
  );
}
