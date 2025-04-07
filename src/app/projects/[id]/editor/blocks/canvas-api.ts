import { Coordinates } from '@dnd-kit/core/dist/types';
import { Block, StackPosition } from './types';

// All possible block events
export enum CanvasEvent {
  SELECT_BLOCK = 'select block',
  DESELECT_BLOCK = 'deselect block',
  START_DRAG = 'start drag',
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

interface SelectBlock {
  type: CanvasEvent.SELECT_BLOCK;
  payload: { id: string };
}
interface DeselectBlock {
  type: CanvasEvent.DESELECT_BLOCK;
}
interface StartDrag {
  type: CanvasEvent.START_DRAG;
  payload: { id: string };
}
interface EndDrag {
  type: CanvasEvent.END_DRAG;
  payload: { delta: Coordinates };
}
interface CreateBlock {
  type: CanvasEvent.CREATE_BLOCK;
  payload: { id: string };
}
interface CreateAndDragBlock {
  type: CanvasEvent.CREATE_AND_DRAG_BLOCK;
  payload: { id: string };
}
interface DeleteBlock {
  type: CanvasEvent.DELETE_BLOCK;
  payload: { id: string };
}
interface CreateVariable {
  type: CanvasEvent.CREATE_VARIABLE;
  payload: { name: string };
}
interface ChangeVariableSelectedOption {
  type: CanvasEvent.CHANGE_VARIABLE_SELECTED_OPTION;
  payload: { id: string; isWorkbenchBlock: boolean; selected: string };
}
interface AddChildBlock {
  type: CanvasEvent.ADD_CHILD_BLOCK;
  payload: { id: string; targetId: string; prefix: string };
}
interface RemoveChildBlock {
  type: CanvasEvent.REMOVE_CHILD_BLOCK;
  payload: { id: string; parentId: string };
}
interface StackBlock {
  type: CanvasEvent.STACK_BLOCK;
  payload: { id: string; targetId: string; position: StackPosition };
}
interface BreakStack {
  type: CanvasEvent.BREAK_STACK;
  payload: { id: string };
}
interface UpdateBlock {
  type: CanvasEvent.UPDATE_BLOCK;
  payload: { id: string; updates: Partial<Block> };
}
interface HighlightDropzone {
  type: CanvasEvent.HIGHLIGHT_DROPZONE;
  payload: { id: string };
}
interface ClearHighlightedDropzone {
  type: CanvasEvent.CLEAR_HIGHLIGHTED_DROPZONE;
}
interface DisplaySnapPreview {
  type: CanvasEvent.DISPLAY_SNAP_PREVIEW;
  payload: { id: string; position: StackPosition };
}
interface HideSnapPreview {
  type: CanvasEvent.HIDE_SNAP_PREVIEW;
  payload: { id: string };
}

export type CanvasAction =
  | SelectBlock
  | DeselectBlock
  | StartDrag
  | EndDrag
  | CreateBlock
  | CreateAndDragBlock
  | DeleteBlock
  | CreateVariable
  | ChangeVariableSelectedOption
  | AddChildBlock
  | RemoveChildBlock
  | StackBlock
  | BreakStack
  | UpdateBlock
  | HighlightDropzone
  | ClearHighlightedDropzone
  | DisplaySnapPreview
  | HideSnapPreview;
