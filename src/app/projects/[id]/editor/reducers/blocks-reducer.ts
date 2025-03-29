import {
  Block,
  BlockState,
  BlocksState,
  BlockAction,
  BlockActionEnum,
} from '../blocks/types';
import { v4 as uuidv4 } from 'uuid';
import {
  findBlockById,
  removeBlockById,
  updateBlockById,
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

      const updatedBlock = { ...block, state: BlockState.Dragging };
      return {
        ...state,
        canvasBlocks: updateBlockById(state.canvasBlocks, id, updatedBlock),
        draggingBlockId: id,
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

      // Update coordinates and set state to idle
      const delta = action.payload.delta;
      const updatedBlock = {
        ...block,
        state: BlockState.Idle,
        coords: { x: block.coords.x + delta.x, y: block.coords.y + delta.y },
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
      const { id, target } = action.payload;

      const targetBlock = validateBlockExists(
        state.canvasBlocks,
        target,
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
        parentId: target,
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
        canvasBlocks: updateBlockById(newBlocks, target, updatedTargetBlock),
      };
    }

    case BlockActionEnum.REMOVE_CHILD_BLOCK: {
      const { id, parentId } = action.payload;

      // Find the parent block
      const parentBlock = findBlockById(state.canvasBlocks, parentId);
      if (!parentBlock) {
        console.error(
          `Error in action: ${BlockActionEnum.REMOVE_CHILD_BLOCK}. Parent block with id = ${parentId} not found`
        );
        return state;
      }

      // Find the child block in the parent's children array
      const childBlock = parentBlock.children.find((child) => child.id === id);
      if (!childBlock) {
        console.error(
          `Error in action: ${BlockActionEnum.REMOVE_CHILD_BLOCK}. Child block with id = ${id} not found in parent's children`
        );
        return state;
      }

      // Reset the child block's state and parent
      const updatedChildBlock = {
        ...childBlock,
        state: BlockState.Idle,
        parentId: null,
      };

      // Remove child from parent's children array
      const updatedParentBlock = {
        ...parentBlock,
        children: parentBlock.children.filter((child) => child.id !== id),
      };

      return {
        ...state,
        canvasBlocks: [
          ...state.canvasBlocks.filter((block) => block.id !== parentId),
          updatedParentBlock,
          updatedChildBlock,
        ],
      };
    }

    default:
      return state;
  }
}

// Helper functions
const validateBlockExists = (
  blocks: Block[],
  id: string | null,
  actionName: string
): Block | null => {
  if (!id) {
    return null;
  }

  const block = findBlockById(blocks, id);
  if (!block) {
    console.error(
      `Error in action: ${actionName}. Block with id = ${id} not found`
    );

    return null;
  }

  return block;
};
