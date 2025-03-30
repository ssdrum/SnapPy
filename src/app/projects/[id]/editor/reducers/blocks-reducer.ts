import {
  BlockState,
  BlocksState,
  BlockAction,
  BlockActionEnum,
  StackPosition,
} from '../blocks/types';
import { v4 as uuidv4 } from 'uuid';
import {
  removeBlockById,
  updateBlockById,
  validateBlockExists,
} from '../utils/utils';

export default function BlocksReducer(state: BlocksState, action: BlockAction) {
  switch (action.type) {
    case BlockActionEnum.SELECT_BLOCK: {
      const { id } = action.payload;
      const block = validateBlockExists(
        state.canvasBlocks,
        id,
        BlockActionEnum.SELECT_BLOCK
      );
      if (!block) {
        return state;
      }

      const updatedBlock = { ...block, state: BlockState.Selected };
      return {
        ...state,
        canvasBlocks: updateBlockById(state.canvasBlocks, id, updatedBlock),
        selectedBlockId: id,
      };
    }

    case BlockActionEnum.DESELECT_BLOCK: {
      const id = state.selectedBlockId;
      if (!id) {
        return state;
      }

      const block = validateBlockExists(
        state.canvasBlocks,
        id,
        BlockActionEnum.DESELECT_BLOCK
      );
      if (!block) {
        return state;
      }

      const updatedBlock = { ...block, state: BlockState.Idle };
      return {
        ...state,
        canvasBlocks: updateBlockById(state.canvasBlocks, id, updatedBlock),
        selectedBlockId: null,
      };
    }

    case BlockActionEnum.START_DRAG: {
      const { id } = action.payload;
      const block = validateBlockExists(
        state.canvasBlocks,
        id,
        BlockActionEnum.START_DRAG
      );
      if (!block) {
        return state;
      }

      const updatedBlock = {
        ...block,
        state: BlockState.Dragging,
        // Reset lastDelta when starting a new drag
        // This will signal to the MOVE_BLOCK handler that it's the first move
        lastDelta: undefined,
      };

      return {
        ...state,
        canvasBlocks: updateBlockById(state.canvasBlocks, id, updatedBlock),
        draggingBlockId: id,
      };
    }

    case BlockActionEnum.MOVE_BLOCK: {
      const { id, delta } = action.payload;
      const block = validateBlockExists(
        state.canvasBlocks,
        id,
        BlockActionEnum.MOVE_BLOCK
      );
      if (!block) {
        return state;
      }

      // For the first move after drag starts, store the original position
      // We'll need it to calculate the absolute position
      if (!block.lastDelta) {
        // First move in this drag session
        const updatedBlock = {
          ...block,
          coords: {
            x: block.coords.x + delta.x,
            y: block.coords.y + delta.y,
          },
          lastDelta: { ...delta },
        };

        return {
          ...state,
          canvasBlocks: updateBlockById(state.canvasBlocks, id, updatedBlock),
        };
      }

      // For subsequent moves, calculate the incremental change since last move
      const incrementalDelta = {
        x: delta.x - block.lastDelta.x,
        y: delta.y - block.lastDelta.y,
      };

      const updatedBlock = {
        ...block,
        coords: {
          x: block.coords.x + incrementalDelta.x,
          y: block.coords.y + incrementalDelta.y,
        },
        lastDelta: { ...delta },
      };

      return {
        ...state,
        canvasBlocks: updateBlockById(state.canvasBlocks, id, updatedBlock),
      };
    }

    case BlockActionEnum.END_DRAG: {
      const id = state.draggingBlockId;
      if (!id) {
        return state;
      }

      const block = validateBlockExists(
        state.canvasBlocks,
        id,
        BlockActionEnum.END_DRAG
      );
      if (!block) {
        return state;
      }

      const updatedBlock = {
        ...block,
        state: BlockState.Idle,
      };

      return {
        ...state,
        canvasBlocks: updateBlockById(state.canvasBlocks, id, updatedBlock),
        draggingBlockId: null,
      };
    }

    case BlockActionEnum.CREATE_BLOCK: {
      const { id } = action.payload;
      const block = validateBlockExists(
        state.workbenchBlocks,
        id,
        BlockActionEnum.CREATE_BLOCK
      );
      if (!block) {
        return state;
      }

      // Create a copy for the canvas with the same ID
      const newBlock = {
        ...block,
        isWorkbenchBlock: false,
      };

      // Create a replacement workbench block with a new ID
      const newWorkbenchBlock = {
        ...block,
        id: uuidv4(),
      };

      return {
        ...state,
        // Add the block to canvas blocks
        canvasBlocks: [...state.canvasBlocks, newBlock],
        // Replace the original workbench block with one having a new ID
        workbenchBlocks: state.workbenchBlocks.map((block) =>
          block.id === id ? newWorkbenchBlock : block
        ),
      };
    }

    case BlockActionEnum.DELETE_BLOCK: {
      const { id } = action.payload;

      const block = validateBlockExists(
        state.canvasBlocks,
        id,
        BlockActionEnum.DELETE_BLOCK
      );
      if (!block) {
        return state;
      }

      return {
        ...state,
        canvasBlocks: state.canvasBlocks.filter((block) => block.id !== id),
      };
    }

    case BlockActionEnum.CREATE_VARIABLE: {
      const { name } = action.payload;
      return { ...state, variables: [...state.variables, name] };
    }

    case BlockActionEnum.CHANGE_VARIABLE_SELECTED_OPTION: {
      const { id, isWorkbenchBlock, selected } = action.payload;

      const blocksArray = isWorkbenchBlock
        ? state.workbenchBlocks
        : state.canvasBlocks;

      const block = validateBlockExists(
        blocksArray,
        id,
        BlockActionEnum.CHANGE_VARIABLE_SELECTED_OPTION
      );
      if (!block) {
        return state;
      }

      // Update the block with the new selected variable option
      const updatedBlock = {
        ...block,
        selected: selected,
      };

      // Update the appropriate blocks array based on whether it's a workbench block
      if (isWorkbenchBlock) {
        return {
          ...state,
          workbenchBlocks: updateBlockById(
            state.workbenchBlocks,
            id,
            updatedBlock
          ),
        };
      } else {
        return {
          ...state,
          canvasBlocks: updateBlockById(state.canvasBlocks, id, updatedBlock),
        };
      }
    }

    case BlockActionEnum.ADD_CHILD_BLOCK: {
      const { id, targetId } = action.payload;

      const targetBlock = validateBlockExists(
        state.canvasBlocks,
        targetId,
        BlockActionEnum.ADD_CHILD_BLOCK
      );
      const blockToNest = validateBlockExists(
        state.canvasBlocks,
        id,
        BlockActionEnum.ADD_CHILD_BLOCK
      );
      if (!targetBlock || !blockToNest) {
        return state;
      }

      // Create an updated version of the block to be nested
      const updatedNestedBlock = {
        ...blockToNest,
        state: BlockState.Nested,
        parentId: targetId,
      };

      // First, remove the block from its current position in the forest
      const newBlocks = removeBlockById(state.canvasBlocks, id);

      // Then, update the target block to include the nested block in its children
      const updatedTargetBlock = {
        ...targetBlock,
        children: [...targetBlock.children, updatedNestedBlock],
      };

      // Finally, update the forest with the modified target block
      return {
        ...state,
        canvasBlocks: updateBlockById(newBlocks, targetId, updatedTargetBlock),
      };
    }

    case BlockActionEnum.REMOVE_CHILD_BLOCK: {
      const { id, parentId } = action.payload;
      const parentBlock = validateBlockExists(
        state.canvasBlocks,
        parentId,
        BlockActionEnum.REMOVE_CHILD_BLOCK
      );
      const childBlock = validateBlockExists(
        state.canvasBlocks,
        id,
        BlockActionEnum.REMOVE_CHILD_BLOCK
      );
      if (!parentBlock || !childBlock) {
        return state;
      }

      // First, remove the child from the existing forest structure
      const newBlocks = removeBlockById(state.canvasBlocks, id);

      // Create updated version of the child block with reset state and parentId
      const updatedChildBlock = {
        ...childBlock,
        state: BlockState.Idle,
        parentId: null,
      };

      // Add the reset child block back to the top level of the forest
      return {
        ...state,
        canvasBlocks: [...newBlocks, updatedChildBlock],
      };
    }

    case BlockActionEnum.STACK_BLOCK: {
      const { id, targetId, position } = action.payload;

      const targetBlock = validateBlockExists(
        state.canvasBlocks,
        targetId,
        BlockActionEnum.STACK_BLOCK
      );
      const blockToStack = validateBlockExists(
        state.canvasBlocks,
        id,
        BlockActionEnum.STACK_BLOCK
      );
      if (!targetBlock || !blockToStack) {
        return state;
      }

      // Copy blocks and update their prev and next block ids
      let updatedTargetBlock = { ...targetBlock };
      let updatedBlockToStack = { ...blockToStack };
      if (position === StackPosition.Top) {
        updatedTargetBlock.prevBlockId = id;
        blockToStack.nextBlockId = targetId;
      } else {
        updatedBlockToStack.prevBlockId = id;
        updatedTargetBlock.nextBlockId = targetId;
      }

      // Update the blocks in the canvas
      let updatedCanvasBlocks = updateBlockById(
        state.canvasBlocks,
        targetId,
        updatedTargetBlock
      );

      updatedCanvasBlocks = updateBlockById(
        updatedCanvasBlocks,
        id,
        updatedBlockToStack
      );

      return {
        ...state,
        canvasBlocks: updatedCanvasBlocks,
      };
    }

    default:
      return state;
  }
}
