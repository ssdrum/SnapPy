'use client';

import React from 'react';
import { ReactNode, createContext } from 'react';
import { Project } from '@prisma/client';
import { DragEndEvent } from '@dnd-kit/core/dist/types';
import { Block } from '@/app/blocks/types';
import useBlocks from '@/app/hooks/useBlocks';
import { SensorDescriptor, SensorOptions } from '@dnd-kit/core';

type EditorContextType = {
  project: Project;
  workbenchBlocks: Block[];
  canvasBlocks: Block[];
  updateWorkbenchBlockFieldById: <T extends Block>(
    blockId: number,
    updates: Partial<T>
  ) => void;
  updateCanvasBlockFieldById: <T extends Block>(
    blockId: number,
    updates: Partial<T>
  ) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  sensors: SensorDescriptor<SensorOptions>[];
};

interface EditorContextProps {
  children: ReactNode;
  project: Project;
}

export const EditorContext = createContext<EditorContextType | null>(null);

// Takes user data as props and stores them in a context object
export default function EditorProvider({
  children,
  project,
}: EditorContextProps) {
  const {
    workbenchBlocks,
    canvasBlocks,
    updateWorkbenchBlockFieldById,
    updateCanvasBlockFieldById,
    handleDragEnd,
    sensors,
  } = useBlocks(project.data);

  const contextValue: EditorContextType = {
    project,
    workbenchBlocks,
    canvasBlocks,
    updateWorkbenchBlockFieldById,
    updateCanvasBlockFieldById,
    handleDragEnd,
    sensors,
  };

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
}
