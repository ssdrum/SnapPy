'use client';

import React from "react"
import { FC, ReactNode, createContext } from 'react';
import { Project } from "@prisma/client"

type Props = {
  children: ReactNode;
  project: Project;
};

// Initialise context as undefined
export const EditorContext = createContext<
  | {
      project: Project;
    }
  | undefined
>(undefined);

// Takes user data as props and stores them in a context object
const EditorProvider: FC<Props> = ({
  children,
  project,
}) => {
  return (
    <EditorContext.Provider
      value={{
        project: project,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export default EditorProvider;