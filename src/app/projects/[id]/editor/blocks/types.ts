import { Coordinates } from '@dnd-kit/utilities';

// All block types
export enum BlockType {
  Empty = 'empty',
  Variable = 'variable',
}

// All possible block states
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

// All data types supported
export enum DataType {
  Int = 'int',
  Bool = 'bool',
  String = 'string',
}

export interface StackOptions {
  top: boolean;
  bottom: boolean;
}

// Main interface for all blocks. Do not export. Must be extended like examples
// below
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
  children: Block[]; // TODO: Consider removing this property from the base interface since not all blocks use it
}

// Variable block
export interface VariableBlock extends BaseBlock {
  type: BlockType.Variable;
  dataType: DataType;
  selected: string;
}

// State interface
export interface BlocksState {
  workbench: Block[];
  canvas: Block[];
  variables: string[];
  selectedBlockId: string | null;
  draggedBlockId: string | null;
  draggedGroupBlockIds: Set<string> | null;
  highlightedDropZoneId: string | null;
}

// Union type for all block types
export type Block = BaseBlock | VariableBlock;
