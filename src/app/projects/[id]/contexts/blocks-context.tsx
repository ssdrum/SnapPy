/* Provides all blocks state to /editor */
'use client';

import {
  Block,
  CanvasState,
  BlockState,
  BlockType,
  OuterDropzonePosition,
  BooleanValue,
} from '../blocks/types';
import { createContext, useContext, useReducer } from 'react';
import BlocksReducer from '../reducers/blocks-reducer';
import { Coordinates } from '@dnd-kit/core/dist/types';
import { findBlockById } from '../utils/utils';
import { CanvasEvent } from '../blocks/canvas-api';
import workbenchBlocks from './workbench-blocks';

interface BlocksProviderProps {
  children: React.ReactNode;
  canvas: Block[];
  variables: string[];
}

// This might seem redundant and it probably is. I just need to wrap it into an
// interface in order to make a union with null later, as the context is initialised
// to null.
interface BlocksContextType {
  state: CanvasState;
  selectBlockAction: (id: string) => void;
  deselectBlockAction: () => void;
  startDragAction: (id: string) => void;
  endDragAction: (delta: Coordinates) => void;
  createBlockAction: (id: string) => void;
  deleteBlockAction: (id: string) => void;
  createVariableAction: (name: string) => boolean;
  changeVariableSelectedOptionAction: (selected: string, id?: string) => void;
  addChildBlockAction: (id: string, targetId: string, prefix: string) => void;
  removeChildBlockAction: (id: string, parentId: string) => void;
  snapBlockAction: (
    id: string,
    targetId: string,
    position: OuterDropzonePosition
  ) => void;
  unsnapBlockAction: (id: string) => void;
  updateBlockAction: (id: string, updates: Partial<Block>) => void;
  highlightDropzoneAction: (id: string) => void;
  clearHighlightedDropzoneAction: () => void;
  changeInputTextAction: (
    id: string,
    text: string,
    isWorkbenchBlock: boolean
  ) => void;
  changeBooleanValueAction: (
    id: string,
    value: BooleanValue,
    isWorkbenchBlock: boolean
  ) => void;
}

// Create context object
export const BlocksContext = createContext<BlocksContextType | null>(null);

// Custom hook for accessing the context
export const useBlocks = () => {
  const context = useContext(BlocksContext);
  if (!context) {
    throw new Error('useBlocks must be used within a BlocksProvider');
  }

  return context;
};

export default function BlocksProvider({
  children,
  canvas,
  variables,
}: BlocksProviderProps) {
  const startBlock = findBlockById('start', canvas)!;
  const initialState: CanvasState = {
    workbench: workbenchBlocks,
    canvas: canvas,
    variables,
    selectedBlockId: null,
    draggedBlockId: null,
    draggedGroupBlockIds: null,
    highlightedDropZoneId: null,
    entrypointBlockId: startBlock.nextId,
  };

  const [state, dispatch] = useReducer(BlocksReducer, initialState);

  // ----------------- API to interact with blocks -------------------
  const selectBlockAction = (id: string) => {
    const selectedBlock = findBlockById(id, state.canvas);
    if (!selectedBlock) {
      return;
    }

    // TODO: This is a temporary fix that disables selecting a nested block
    // to avoid css positioning issues. It will need to be modified to allow
    // users to select nested blocks
    if (selectedBlock.state === BlockState.Nested) {
      return;
    }

    dispatch({
      type: CanvasEvent.SELECT_BLOCK,
      payload: { id },
    });
  };

  const deselectBlockAction = () => {
    dispatch({
      type: CanvasEvent.DESELECT_BLOCK,
    });
  };

  const startDragAction = (id: string) => {
    dispatch({
      type: CanvasEvent.START_DRAG,
      payload: { id },
    });
  };

  const endDragAction = (delta: Coordinates) => {
    dispatch({
      type: CanvasEvent.END_DRAG,
      payload: { delta },
    });
  };

  // In this case we're passing the id of the dragged workbench block
  const createBlockAction = (id: string) => {
    dispatch({
      type: CanvasEvent.CREATE_BLOCK,
      payload: { id },
    });
  };

  const deleteBlockAction = (id: string) => {
    dispatch({
      type: CanvasEvent.DELETE_BLOCK,
      payload: { id },
    });
  };

  const createVariableAction = (name: string): boolean => {
    if (state.variables.includes(name)) {
      console.error(`Variable with name: ${name} exists already`);
      return false;
    }

    dispatch({
      type: CanvasEvent.CREATE_VARIABLE,
      payload: { name },
    });
    return true;
  };

  const unsnapBlockAction = (id: string) => {
    dispatch({
      type: CanvasEvent.UNSNAP_BLOCK,
      payload: { id },
    });
  };

  /* If no id is passed, this function will update the workbench variable block */
  const changeVariableSelectedOptionAction = (
    selected: string,
    id?: string
  ) => {
    const isWorkbenchBlock = id ? false : true;

    // Find id of variable block in the workbench
    if (!id) {
      id = state.workbench.find((block) => {
        return block.type === BlockType.Variable;
      })!.id;
    }

    dispatch({
      type: CanvasEvent.CHANGE_VARIABLE_SELECTED_OPTION,
      payload: { id, isWorkbenchBlock, selected },
    });
  };

  const addChildBlockAction = (
    id: string,
    targetId: string,
    prefix: string
  ) => {
    dispatch({
      type: CanvasEvent.ADD_CHILD_BLOCK,
      payload: { id, targetId, prefix },
    });
  };

  const removeChildBlockAction = (id: string, parentId: string) => {
    dispatch({
      type: CanvasEvent.REMOVE_CHILD_BLOCK,
      payload: { id, parentId },
    });
  };

  const snapBlockAction = (
    id: string,
    targetId: string,
    position: OuterDropzonePosition
  ) => {
    dispatch({
      type: CanvasEvent.SNAP_BLOCK,
      payload: { id, targetId, position },
    });
  };

  const updateBlockAction = (id: string, updates: Partial<Block>) => {
    dispatch({
      type: CanvasEvent.UPDATE_BLOCK,
      payload: { id, updates },
    });
  };

  const highlightDropzoneAction = (id: string) => {
    dispatch({
      type: CanvasEvent.HIGHLIGHT_DROPZONE,
      payload: { id },
    });
  };

  const clearHighlightedDropzoneAction = () => {
    dispatch({
      type: CanvasEvent.CLEAR_HIGHLIGHTED_DROPZONE,
    });
  };

  const changeInputTextAction = (
    id: string,
    text: string,
    isWorkbenchBlock: boolean
  ) => {
    dispatch({
      type: CanvasEvent.CHANGE_INPUT_TEXT,
      payload: { id, isWorkbenchBlock, text },
    });
  };

  const changeBooleanValueAction = (
    id: string,
    value: BooleanValue,
    isWorkbenchBlock: boolean
  ) => {
    dispatch({
      type: CanvasEvent.CHANGE_BOOLEAN_VALUE,
      payload: { id, value, isWorkbenchBlock },
    });
  };

  const value: BlocksContextType = {
    state,
    selectBlockAction,
    deselectBlockAction,
    startDragAction,
    endDragAction,
    createBlockAction,
    deleteBlockAction,
    createVariableAction,
    changeVariableSelectedOptionAction,
    addChildBlockAction,
    removeChildBlockAction,
    snapBlockAction,
    unsnapBlockAction,
    updateBlockAction,
    highlightDropzoneAction,
    clearHighlightedDropzoneAction,
    changeInputTextAction,
    changeBooleanValueAction,
  };

  return (
    <BlocksContext.Provider value={value}>{children}</BlocksContext.Provider>
  );
}
