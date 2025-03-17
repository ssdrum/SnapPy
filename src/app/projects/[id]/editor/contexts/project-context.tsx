/* This context provides project metadata in /editor */
'use client';

import { createContext } from 'react';
import { Project } from '@prisma/client';

interface ProjectProviderProps {
  children: React.ReactNode;
  project: Project;
}

interface ContextType {
  name: string;
  id: number;
}

export const ProjectContext = createContext<ContextType | null>(null);

export default function ProjectProvider({
  children,
  project,
}: ProjectProviderProps) {
  const value: ContextType = {
    name: project.name,
    id: project.id,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}
