/* Provides all blocks state to /editor */
'use client';

import {
  Block,
  BlockActionEnum,
  BlocksState,
  BlockState,
  BlockType,
  DataType,
} from '../blocks/types';
import { createContext, useContext, useReducer } from 'react';
import BlocksReducer from '../reducers/blocks-reducer';
import { Coordinates } from '@dnd-kit/core/dist/types';
import { v4 as uuidv4 } from 'uuid';

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
  endDragAction: (delta: Coordinates) => void;
  createBlockAction: (id: string) => void;
  deleteBlockAction: (id: string) => void;
  createVariableAction: (name: string) => boolean;
  changeVariableSelectedOptionAction: (selected: string, id?: string) => void;
  addChildBlockAction: (id: string, target: string) => void;
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
    workbenchBlocks: workBenchBlocks,
    canvasBlocks,
    variables,
    selectedBlockId: null,
    draggingBlockId: null,
  };

  const [state, dispatch] = useReducer(BlocksReducer, initialState);

  // API to interact with blocks
  const selectBlockAction = (id: string) => {
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

  /* If no id is passed, this function will update the workbench variable block */
  const changeVariableSelectedOptionAction = (
    selected: string,
    id?: string
  ) => {
    const isWorkbenchBlock = id ? false : true;

    // Find id of variable block in the workbench
    if (!id) {
      id = state.workbenchBlocks.find((block) => {
        return block.type === BlockType.Variable;
      })!.id;
    }

    dispatch({
      type: BlockActionEnum.CHANGE_VARIABLE_SELECTED_OPTION,
      payload: { id, isWorkbenchBlock, selected },
    });
  };

  const addChildBlockAction = (id: string, target: string) => {
    dispatch({
      type: BlockActionEnum.ADD_CHILD_BLOCK,
      payload: { id, target },
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
  };

  return (
    <BlocksContext.Provider value={value}>{children}</BlocksContext.Provider>
  );
}

// Add workbench blocks here
const workBenchBlocks: Block[] = [
  {
    id: uuidv4(),
    type: BlockType.Empty,
    coords: { x: 0, y: 0 },
    isWorkbenchBlock: true,
    state: BlockState.Idle,
  },
  {
    id: uuidv4(),
    type: BlockType.Variable,
    coords: { x: 0, y: 0 },
    isWorkbenchBlock: true,
    state: BlockState.Idle,
    dataType: DataType.Int,
    selected: 'x',
    value: 1,
  },
];
