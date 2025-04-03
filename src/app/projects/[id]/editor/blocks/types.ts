import { Coordinates } from '@dnd-kit/utilities';

// All block types
export enum BlockType {
  Empty = 'empty',
  Variable = 'variable',
}

export interface StackOptions {
  top: boolean;
  bottom: boolean;
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

// Main interface for all blocks. Do not export. Must be extended like examples
// below
interface BlockInterface {
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
export interface VariableBlock extends BlockInterface {
  type: BlockType.Variable;
  dataType: DataType;
  selected: string;
}

// Union type for all block types
export type Block = BlockInterface | VariableBlock;

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
  MOVE_BLOCK = 'move block',
  END_DRAG = 'end drag',
  BREAK_STACK = 'break stack',
  CREATE_BLOCK = 'create block',
  CREATE_AND_DRAG_BLOCK = 'create and drag block',
  DELETE_BLOCK = 'delete block',
  CREATE_VARIABLE = 'create variable',
  CHANGE_VARIABLE_SELECTED_OPTION = 'change variable selected option',
  ADD_CHILD_BLOCK = 'add child block',
  REMOVE_CHILD_BLOCK = 'remove child block',
  STACK_BLOCK = 'stack block',
  UPDATE_BLOCK = 'update block',
  HIGHLIGHT_DROPZONE = 'highlight dropzone',
  CLEAR_HIGHLIGHTED_DROPZONE = 'clear highlighted dropzone',
  DISPLAY_SNAP_PREVIEW = 'display snap preview',
  HIDE_SNAP_PREVIEW = 'hide snap preview',
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

interface CreateAndDragBlockAction {
  type: BlockActionEnum.CREATE_AND_DRAG_BLOCK;
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
  payload: { id: string; targetId: string };
}

interface RemoveChildBlockAction {
  type: BlockActionEnum.REMOVE_CHILD_BLOCK;
  payload: { id: string; parentId: string };
}

interface StackBlockAction {
  type: BlockActionEnum.STACK_BLOCK;
  payload: { id: string; targetId: string; position: StackPosition };
}

interface MoveBlockAction {
  type: BlockActionEnum.MOVE_BLOCK;
  payload: { id: string; delta: Coordinates };
}

interface BreakStackAction {
  type: BlockActionEnum.BREAK_STACK;
  payload: { id: string };
}

interface UpdateBlockAction {
  type: BlockActionEnum.UPDATE_BLOCK;
  payload: { id: string; updates: Partial<Block> };
}

interface HighlightDropzoneAction {
  type: BlockActionEnum.HIGHLIGHT_DROPZONE;
  payload: { id: string };
}

interface ClearHighlightedDropzoneAction {
  type: BlockActionEnum.CLEAR_HIGHLIGHTED_DROPZONE;
}

interface DisplaySnapPreviewAction {
  type: BlockActionEnum.DISPLAY_SNAP_PREVIEW;
  payload: { id: string; position: StackPosition };
}

interface HideSnapPreviewAction {
  type: BlockActionEnum.HIDE_SNAP_PREVIEW;
  payload: { id: string };
}

// Union type of all actions
export type BlockAction =
  | SelectBlockAction
  | DeselectBlockAction
  | StartDragAction
  | EndDragAction
  | CreateBlockAction
  | CreateAndDragBlockAction
  | DeleteBlockAction
  | CreateVariableAction
  | ChangeVariableSelectedOptionAction
  | AddChildBlockAction
  | RemoveChildBlockAction
  | StackBlockAction
  | MoveBlockAction
  | BreakStackAction
  | UpdateBlockAction
  | HighlightDropzoneAction
  | ClearHighlightedDropzoneAction
  | DisplaySnapPreviewAction
  | HideSnapPreviewAction;
