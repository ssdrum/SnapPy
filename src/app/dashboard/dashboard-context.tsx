'use client';

import React from "react"
import { FC, ReactNode, createContext } from 'react';
import { Project } from "@prisma/client"

type Props = {
  children: ReactNode;
  projects: Project[];
};

// Initialise context as undefined
export const DashboardContext = createContext<
  | {
      projects: Project[];
    }
  | undefined
>(undefined);

// Takes user data as props and stores them in a context object
const DashboardProvider: FC<Props> = ({
  children,
  projects,
}) => {
  return (
    <DashboardContext.Provider
      value={{
        projects: projects,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardProvider;