import { Coordinates } from '@dnd-kit/utilities';

export const BLOCK_HEIHGT = 34.8;

export enum BlockType {
  Empty = 'empty',
  Variable = 'variable',
  While = 'while',
}

export enum BlockState {
  Idle = 'idle',
  Selected = 'selected',
  Dragging = 'dragging',
  Nested = 'nested',
}

export interface BlockChildren {
  [key: string]: Block[];
}

export enum StackPosition {
  Top = 'top',
  Bottom = 'bottom',
}

export interface StackOptions {
  top: boolean;
  bottom: boolean;
}

export interface CanvasState {
  workbench: Block[];
  canvas: Block[];
  variables: string[];
  selectedBlockId: string | null;
  draggedBlockId: string | null;
  draggedGroupBlockIds: Set<string> | null;
  highlightedDropZoneId: string | null;
}

/**
 * Main interface for all blocks
 */
interface BaseBlock {
  id: string;
  type: BlockType;
  state: BlockState;
  coords: Coordinates;
  lastDelta?: Coordinates;
  isWorkbenchBlock: boolean;
  stackOptions: StackOptions;
  parentId: string | null;
  prevId: string | null;
  nextId: string | null;
}

export interface EmptyBlock extends BaseBlock {
  type: BlockType.Empty;
  children: null;
}

export interface VariableBlock extends BaseBlock {
  type: BlockType.Variable;
  selected: string;
  children: {
    expression: Block[];
  };
}

export interface WhileBlock extends BaseBlock {
  type: BlockType.While;
  children: {
    condition: Block[];
    body: Block[];
  };
}

/**
 * Union of all blocks
 */
export type Block = EmptyBlock | VariableBlock | WhileBlock;
