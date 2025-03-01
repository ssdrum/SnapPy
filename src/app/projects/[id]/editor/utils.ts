import { Over } from '@dnd-kit/core';

// Zones over which a draggable object can be dropped
export enum DropZones {
  CANVAS = 'canvas',
  BIn = 'bin',
}

// Returns true if block with id = is is a workbench block. Return false otherwise.
export const isWorkbenchBlock = (id: number) => id < 0;

export const wasDroppedOnCanvas = (over: Over) => over.id === DropZones.CANVAS;

export const wasDroppedOnBin = (over: Over) => over.id === DropZones.BIn;
