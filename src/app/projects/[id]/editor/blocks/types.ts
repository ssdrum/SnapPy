import { Coordinates } from '@dnd-kit/utilities';

// All block types
export enum BlockType {
  Empty = 'empty',
  Variable = 'variable',
}

// All data types supported
export enum DataType {
  Int = 'int',
  Bool = 'bool',
  String = 'string',
}

// Main interface for all blocks. Do not export. Must be extended like examples
// below
interface BlockInterface {
  id: string;
  type: BlockType;
  state: BlockState;
  coords: Coordinates;
  isWorkbenchBlock: boolean;
  parentId?: string;
  children?: Block[];
}

// Variable block
export interface VariableBlock extends BlockInterface {
  type: BlockType.Variable;
  dataType: DataType;
  selected: string;
  value: VariableValue;
}

export type VariableValue = string | number | boolean | null;

// Union type for all block types
export type Block = BlockInterface | VariableBlock;

// State interface
export interface BlocksState {
  workbenchBlocks: Block[];
  canvasBlocks: Block[];
  variables: string[];
  selectedBlockId: string | null;
  draggingBlockId: string | null;
}

// All possible block states
export enum BlockState {
  Idle = 'idle',
  Selected = 'selected',
  Dragging = 'dragging',
  Nested = 'nested',
}

// All possible block actions
export enum BlockActionEnum {
  SELECT_BLOCK = 'select block',
  DESELECT_BLOCK = 'deselect block',
  START_DRAG = 'start drag',
  END_DRAG = 'end drag',
  CREATE_BLOCK = 'create block',
  DELETE_BLOCK = 'delete block',
  CREATE_VARIABLE = 'create variable',
  CHANGE_VARIABLE_SELECTED_OPTION = 'change variable selected option',
  ADD_CHILD_BLOCK = 'add child block',
}

// Action Interfaces
interface SelectBlockAction {
  type: BlockActionEnum.SELECT_BLOCK;
  payload: { id: string };
}

interface DeselectBlockAction {
  type: BlockActionEnum.DESELECT_BLOCK;
}

interface StartDragAction {
  type: BlockActionEnum.START_DRAG;
  payload: { id: string };
}

interface EndDragAction {
  type: BlockActionEnum.END_DRAG;
  payload: { delta: Coordinates };
}

interface CreateBlockAction {
  type: BlockActionEnum.CREATE_BLOCK;
  payload: { id: string };
}

interface DeleteBlockAction {
  type: BlockActionEnum.DELETE_BLOCK;
  payload: { id: string };
}

interface CreateVariableAction {
  type: BlockActionEnum.CREATE_VARIABLE;
  payload: { name: string };
}

interface ChangeVariableSelectedOptionAction {
  type: BlockActionEnum.CHANGE_VARIABLE_SELECTED_OPTION;
  payload: { id: string; isWorkbenchBlock: boolean; selected: string };
}

interface AddChildBlockAction {
  type: BlockActionEnum.ADD_CHILD_BLOCK;
  payload: { id: string; target: string };
}

// Union type of all actions
export type BlockAction =
  | SelectBlockAction
  | DeselectBlockAction
  | StartDragAction
  | EndDragAction
  | CreateBlockAction
  | DeleteBlockAction
  | CreateVariableAction
  | ChangeVariableSelectedOptionAction
  | AddChildBlockAction;
