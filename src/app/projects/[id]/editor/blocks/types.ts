import { Coordinates } from '@dnd-kit/utilities';

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
  prevBlockId: string | null;
  nextBlockId: string | null;
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
