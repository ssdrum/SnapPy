'use client';

import React from 'react';
import { ReactNode, createContext } from 'react';
import { Project } from '@prisma/client';
import { Coordinates } from '@dnd-kit/core/dist/types';
import { Block } from '@/app/blocks/types';
import useBlocks from '@/app/hooks/useBlocks';

type EditorContextType = {
  project: Project;
  workbenchBlocks: Block[];
  canvasBlocks: Block[];
  getNewBlockId: () => number;
  createCanvasBlock: (originalBlockId: number, delta: Coordinates) => void;
  moveCanvasBlock: (blockId: number, delta: Coordinates) => void;
  deleteCanvasBlock: (blockId: number) => void;
  updateWorkbenchBlockFieldById: <T extends Block>(
    blockId: number,
    updates: Partial<T>
  ) => void;
  updateCanvasBlockFieldById: <T extends Block>(
    blockId: number,
    updates: Partial<T>
  ) => void;
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
    getNewBlockId,
    createCanvasBlock,
    moveCanvasBlock,
    deleteCanvasBlock,
    updateWorkbenchBlockFieldById,
    updateCanvasBlockFieldById,
  } = useBlocks(project.data);

  const contextValue: EditorContextType = {
    project,
    workbenchBlocks,
    canvasBlocks,
    getNewBlockId,
    createCanvasBlock,
    moveCanvasBlock,
    deleteCanvasBlock,
    updateWorkbenchBlockFieldById,
    updateCanvasBlockFieldById,
  };

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
}
