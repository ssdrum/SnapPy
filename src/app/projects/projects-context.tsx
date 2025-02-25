'use client';

import React from 'react';
import { FC, ReactNode, createContext } from 'react';
import { Project } from '@prisma/client';

type Props = {
  children: ReactNode;
  projects: Project[];
};

// Initialise context as undefined
export const ProjectsContext = createContext<
  | {
      projects: Project[];
    }
  | undefined
>(undefined);

// Takes user data as props and stores them in a context object
const ProjectsProvider: FC<Props> = ({ children, projects }) => {
  return (
    <ProjectsContext.Provider
      value={{
        projects: projects,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export default ProjectsProvider;
