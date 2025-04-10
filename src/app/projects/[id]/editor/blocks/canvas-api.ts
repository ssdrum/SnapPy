import { Coordinates } from '@dnd-kit/core/dist/types';
import { Block, OuterDropzonePosition } from './types';

// All possible block events
export enum CanvasEvent {
  SELECT_BLOCK = 'select block',
  DESELECT_BLOCK = 'deselect block',
  START_DRAG = 'start drag',
  END_DRAG = 'end drag',
  CREATE_BLOCK = 'create block',
  DELETE_BLOCK = 'delete block',
  CREATE_VARIABLE = 'create variable',
  CHANGE_VARIABLE_SELECTED_OPTION = 'change variable selected option',
  ADD_CHILD_BLOCK = 'add child block',
  REMOVE_CHILD_BLOCK = 'remove child block',
  SNAP_BLOCK = 'snap block',
  UNSNAP_BLOCK = 'unsnap block',
  UPDATE_BLOCK = 'update block',
  HIGHLIGHT_DROPZONE = 'highlight dropzone',
  CLEAR_HIGHLIGHTED_DROPZONE = 'clear highlighted dropzone',
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
interface SnapBlock {
  type: CanvasEvent.SNAP_BLOCK;
  payload: { id: string; targetId: string; position: OuterDropzonePosition };
}
interface UnsnapBlock {
  type: CanvasEvent.UNSNAP_BLOCK;
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
interface HighlightDropzone {
  type: CanvasEvent.HIGHLIGHT_DROPZONE;
  payload: { id: string };
}
interface ClearHighlightedDropzone {
  type: CanvasEvent.CLEAR_HIGHLIGHTED_DROPZONE;
}

export type CanvasAction =
  | SelectBlock
  | DeselectBlock
  | StartDrag
  | EndDrag
  | CreateBlock
  | DeleteBlock
  | CreateVariable
  | ChangeVariableSelectedOption
  | AddChildBlock
  | RemoveChildBlock
  | SnapBlock
  | UnsnapBlock
  | UpdateBlock
  | HighlightDropzone
  | ClearHighlightedDropzone
  | HighlightDropzone
  | ClearHighlightedDropzone;
