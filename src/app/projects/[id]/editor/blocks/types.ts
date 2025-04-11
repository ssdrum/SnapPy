import { Coordinates } from '@dnd-kit/utilities';

export enum BlockType {
  Empty = 'empty',
  Variable = 'variable',
  While = 'while',
  Number = 'number',
  Math = 'math',
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

export enum OuterDropzonePosition {
  Top = 'top',
  Bottom = 'bottom',
}

export enum MathOperator {
  Addition = '+',
  Subtraction = '-',
  Multiplication = '*',
  Division = '/',
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
  isWorkbenchBlock: boolean;
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

export interface NumberBlock extends BaseBlock {
  type: BlockType.Number;
  value: string;
  children: null;
}

export interface MathBlock extends BaseBlock {
  type: BlockType.Math;
  operator: MathOperator;
  children: {
    left: Block[];
    right: Block[];
  };
}

/**
 * Union of all blocks
 */
export type Block =
  | EmptyBlock
  | VariableBlock
  | WhileBlock
  | NumberBlock
  | MathBlock;
