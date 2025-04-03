/* Provides all blocks state to /editor */
'use client';

import {
  Block,
  BlockActionEnum,
  BlocksState,
  BlockState,
  BlockType,
  StackPosition,
} from '../blocks/types';
import { createContext, useContext, useReducer } from 'react';
import BlocksReducer from '../reducers/blocks-reducer';
import { Coordinates } from '@dnd-kit/core/dist/types';
import { v4 as uuidv4 } from 'uuid';
import { findBlockById } from '../utils/utils';

interface BlocksProviderProps {
  children: React.ReactNode;
  canvasBlocks: Block[];
  variables: string[];
}

// This might seem redundant and it probably is. I just need to wrap it into an
// interface in order to make a union with null later, as the context is initialised
// to null.
interface BlocksContextType {
  state: BlocksState;
  selectBlockAction: (id: string) => void;
  deselectBlockAction: () => void;
  startDragAction: (id: string) => void;
  moveBlockAction: (id: string, delta: Coordinates) => void;
  endDragAction: (delta: Coordinates) => void;
  createBlockAction: (id: string) => void;
  createAndDragBlockAction: (id: string) => void;
  deleteBlockAction: (id: string) => void;
  createVariableAction: (name: string) => boolean;
  changeVariableSelectedOptionAction: (selected: string, id?: string) => void;
  addChildBlockAction: (id: string, targetId: string) => void;
  removeChildBlockAction: (id: string, parentId: string) => void;
  stackBlockAction: (
    id: string,
    targetId: string,
    position: StackPosition
  ) => void;
  breakStackAction: (id: string) => void;
  updateBlockAction: (id: string, updates: Partial<Block>) => void;
  highlightDropzoneAction: (id: string) => void;
  clearHighlightedDropzoneAction: () => void;
  displaySnapPreviewAction: (id: string, position: StackPosition) => void;
  hideSnapPreviewAction: (id: string) => void;
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
  canvasBlocks,
  variables,
}: BlocksProviderProps) {
  const initialState: BlocksState = {
    workbench: workBench,
    canvasBlocks,
    variables,
    selectedBlockId: null,
    draggingBlockId: null,
    dragGroupBlockIds: null,
    highlightedDropZoneId: null,
  };

  const [state, dispatch] = useReducer(BlocksReducer, initialState);

  // ----------------- API to interact with blocks -------------------
  const selectBlockAction = (id: string) => {
    const selectedBlock = findBlockById(state.canvasBlocks, id);
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
      type: BlockActionEnum.SELECT_BLOCK,
      payload: { id },
    });
  };

  const deselectBlockAction = () => {
    dispatch({
      type: BlockActionEnum.DESELECT_BLOCK,
    });
  };

  const startDragAction = (id: string) => {
    dispatch({
      type: BlockActionEnum.START_DRAG,
      payload: { id },
    });
  };

  const moveBlockAction = (id: string, delta: Coordinates) => {
    dispatch({
      type: BlockActionEnum.MOVE_BLOCK,
      payload: { id, delta },
    });
  };

  const endDragAction = (delta: Coordinates) => {
    dispatch({
      type: BlockActionEnum.END_DRAG,
      payload: { delta },
    });
  };

  // In this case we're passing the id of the dragged workbench block
  const createBlockAction = (id: string) => {
    dispatch({
      type: BlockActionEnum.CREATE_BLOCK,
      payload: { id },
    });
  };

  const createAndDragBlockAction = (id: string) => {
    dispatch({
      type: BlockActionEnum.CREATE_AND_DRAG_BLOCK,
      payload: { id },
    });
  };

  const deleteBlockAction = (id: string) => {
    dispatch({
      type: BlockActionEnum.DELETE_BLOCK,
      payload: { id },
    });
  };

  const createVariableAction = (name: string): boolean => {
    if (state.variables.includes(name)) {
      console.error(`Variable with name: ${name} exists already`);
      return false;
    }

    dispatch({
      type: BlockActionEnum.CREATE_VARIABLE,
      payload: { name },
    });
    return true;
  };

  const breakStackAction = (id: string) => {
    dispatch({
      type: BlockActionEnum.BREAK_STACK,
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
      type: BlockActionEnum.CHANGE_VARIABLE_SELECTED_OPTION,
      payload: { id, isWorkbenchBlock, selected },
    });
  };

  const addChildBlockAction = (id: string, targetId: string) => {
    dispatch({
      type: BlockActionEnum.ADD_CHILD_BLOCK,
      payload: { id, targetId },
    });
  };

  const removeChildBlockAction = (id: string, parentId: string) => {
    dispatch({
      type: BlockActionEnum.REMOVE_CHILD_BLOCK,
      payload: { id, parentId },
    });
  };

  const stackBlockAction = (
    id: string,
    targetId: string,
    position: StackPosition
  ) => {
    dispatch({
      type: BlockActionEnum.STACK_BLOCK,
      payload: { id, targetId, position },
    });
  };

  const updateBlockAction = (id: string, updates: Partial<Block>) => {
    dispatch({
      type: BlockActionEnum.UPDATE_BLOCK,
      payload: { id, updates },
    });
  };

  const highlightDropzoneAction = (id: string) => {
    dispatch({
      type: BlockActionEnum.HIGHLIGHT_DROPZONE,
      payload: { id },
    });
  };

  const clearHighlightedDropzoneAction = () => {
    dispatch({
      type: BlockActionEnum.CLEAR_HIGHLIGHTED_DROPZONE,
    });
  };

  const displaySnapPreviewAction = (id: string, position: StackPosition) => {
    dispatch({
      type: BlockActionEnum.DISPLAY_SNAP_PREVIEW,
      payload: { id, position },
    });
  };

  const hideSnapPreviewAction = (id: string) => {
    dispatch({
      type: BlockActionEnum.HIDE_SNAP_PREVIEW,
      payload: { id },
    });
  };

  const value: BlocksContextType = {
    state,
    selectBlockAction,
    deselectBlockAction,
    startDragAction,
    moveBlockAction,
    endDragAction,
    createBlockAction,
    createAndDragBlockAction,
    breakStackAction,
    deleteBlockAction,
    createVariableAction,
    changeVariableSelectedOptionAction,
    addChildBlockAction,
    removeChildBlockAction,
    stackBlockAction,
    updateBlockAction,
    highlightDropzoneAction,
    clearHighlightedDropzoneAction,
    displaySnapPreviewAction,
    hideSnapPreviewAction,
  };

  return (
    <BlocksContext.Provider value={value}>{children}</BlocksContext.Provider>
  );
}

// Add workbench blocks here
const workBench: Block[] = [
  {
    id: uuidv4(),
    type: BlockType.Empty,
    coords: { x: 0, y: 0 },
    isWorkbenchBlock: true,
    state: BlockState.Idle,
    stackOptions: { top: true, bottom: true },
    parentId: null,
    prevBlockId: null,
    nextBlockId: null,
    children: [],
  },
  {
    id: uuidv4(),
    type: BlockType.Variable,
    coords: { x: 0, y: 0 },
    isWorkbenchBlock: true,
    state: BlockState.Idle,
    selected: 'x',
    stackOptions: { top: true, bottom: true },
    parentId: null,
    prevBlockId: null,
    nextBlockId: null,
    children: [],
  },
];
