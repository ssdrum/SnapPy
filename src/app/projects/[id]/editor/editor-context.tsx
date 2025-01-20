'use client';

import React from 'react';
import { ReactNode, createContext } from 'react';
import { Project } from '@prisma/client';

interface EditorContextProps {
  children: ReactNode;
  project: Project;
}

// Initialise context as undefined
export const EditorContext = createContext<
  | {
      project: Project;
    }
  | undefined
>(undefined);

// Takes user data as props and stores them in a context object
export default function EditorProvider({
  children,
  project,
}: EditorContextProps) {
  return (
    <EditorContext.Provider
      value={{
        project: project,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}
