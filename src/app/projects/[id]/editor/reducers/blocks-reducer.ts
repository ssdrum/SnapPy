import {
  BlockState,
  BlocksState,
  BlockAction,
  BlockActionEnum,
  StackPosition,
} from '../blocks/types';
import { v4 as uuidv4 } from 'uuid';
import {
  calcNextBlockStartPosition,
  findRoot,
  getConnectedBlockIds,
  removeBlockById,
  updateBlockById,
  updateSequencePositions,
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

      const newCanvasBlocks = updateBlockById(
        state.canvasBlocks,
        id,
        updatedBlock
      );

      return {
        ...state,
        canvasBlocks: newCanvasBlocks,
        dragGroupBlockIds: getConnectedBlockIds(newCanvasBlocks, id),
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

      let updatedBlocks = [...state.canvasBlocks];

      // For the first move after drag starts, store the original position
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

        // Update the dragged block first
        updatedBlocks = updateBlockById(updatedBlocks, id, updatedBlock);

        // Now update any blocks that follow in the sequence
        let currentBlock = updatedBlock;
        while (currentBlock.nextBlockId) {
          // Find the next block
          const nextBlock = updatedBlocks.find(
            (b) => b.id === currentBlock.nextBlockId
          );
          if (!nextBlock) {
            break;
          }

          // Calculate the next position
          const nextPosition = calcNextBlockStartPosition(currentBlock);

          // Update the next block
          const updatedNextBlock = {
            ...nextBlock,
            coords: nextPosition,
            lastDelta: { x: 0, y: 0 },
          };

          // Update our working copy
          updatedBlocks = updateBlockById(
            updatedBlocks,
            nextBlock.id,
            updatedNextBlock
          );

          // Move to the next block
          currentBlock = updatedNextBlock;
        }

        return {
          ...state,
          canvasBlocks: updatedBlocks,
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

      // Update the dragged block first
      updatedBlocks = updateBlockById(updatedBlocks, id, updatedBlock);

      // Now update any blocks that follow in the sequence
      let currentBlock = updatedBlock;
      while (currentBlock.nextBlockId) {
        // Find the next block
        const nextBlock = updatedBlocks.find(
          (b) => b.id === currentBlock.nextBlockId
        );
        if (!nextBlock) {
          break;
        }

        // Calculate the next position
        const nextPosition = calcNextBlockStartPosition(currentBlock);

        // Update the next block
        const updatedNextBlock = {
          ...nextBlock,
          coords: nextPosition,
          lastDelta: { x: 0, y: 0 },
        };

        // Update our working copy
        updatedBlocks = updateBlockById(
          updatedBlocks,
          nextBlock.id,
          updatedNextBlock
        );

        // Move to the next block
        currentBlock = updatedNextBlock;
      }

      return {
        ...state,
        canvasBlocks: updatedBlocks,
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
        dragGroupBlockIds: null,
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

    case BlockActionEnum.CREATE_AND_DRAG_BLOCK: {
      const { id } = action.payload;
      const block = validateBlockExists(
        state.workbenchBlocks,
        id,
        BlockActionEnum.CREATE_AND_DRAG_BLOCK
      );
      if (!block) {
        return state;
      }

      // Create a copy for the canvas with the same ID
      const newBlock = {
        ...block,
        isWorkbenchBlock: false,
        state: BlockState.Dragging,
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
        // Set as the dragging block
        draggingBlockId: id,
        dragGroupBlockIds: new Set<string>([id]), // Initially, just this block
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
      // Avoid nesting into itself
      if (state.dragGroupBlockIds?.has(targetId)) {
        return state;
      }

      // Create an updated version of the block to be nested
      const updatedNestedBlock = {
        ...blockToNest,
        state: BlockState.Nested,
        parentId: targetId,
      };

      // Remove the block from its current position in the forest
      let newBlocks = removeBlockById(state.canvasBlocks, id);

      // Update the target block to include the nested block in its children
      const updatedTargetBlock = {
        ...targetBlock,
        children: [...targetBlock.children, updatedNestedBlock],
      };

      newBlocks = updateBlockById(newBlocks, targetId, updatedTargetBlock);

      // Update positions of following blocks
      const rootBlock = findRoot(newBlocks, updatedTargetBlock);
      if (rootBlock.nextBlockId) {
        newBlocks = updateSequencePositions(newBlocks, rootBlock);
      }

      return {
        ...state,
        canvasBlocks: newBlocks,
      };
    }

    case BlockActionEnum.REMOVE_CHILD_BLOCK: {
      const { id, parentId } = action.payload;
      const parentBlock = validateBlockExists(
        state.canvasBlocks,
        parentId,
        BlockActionEnum.REMOVE_CHILD_BLOCK
      );
      if (!parentBlock) {
        return state;
      }

      // Find the child block in the parent's children
      const childBlock = parentBlock.children.find((child) => child.id === id);
      if (!childBlock) {
        return state;
      }

      // Create updated version of the parent without this child
      const updatedParentBlock = {
        ...parentBlock,
        children: parentBlock.children.filter((child) => child.id !== id),
      };

      // Update the parent block in our forest
      let newBlocks = updateBlockById(
        state.canvasBlocks,
        parentId,
        updatedParentBlock
      );

      // Create updated version of the child block with reset state and parentId
      const updatedChildBlock = {
        ...childBlock,
        state: BlockState.Idle,
        parentId: null,
      };

      // Add the reset child block back to the top level of the forest
      newBlocks = [...newBlocks, updatedChildBlock];

      // Update positions of following blocks in the sequence if parent is part of a sequence
      const rootBlock = findRoot(newBlocks, updatedParentBlock);
      if (rootBlock.nextBlockId) {
        newBlocks = updateSequencePositions(newBlocks, rootBlock);
      }

      return {
        ...state,
        canvasBlocks: newBlocks,
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

      // Initialize the updated blocks array
      let updatedCanvasBlocks = [...state.canvasBlocks];

      // Create copies to modify
      let updatedTargetBlock = { ...targetBlock };
      let updatedBlockToStack = { ...blockToStack };

      // Set up connections based on position
      if (position === StackPosition.Top) {
        // Block will be placed above target block
        // Handle current connections first

        // If blockToStack already has a next block, we need to disconnect it
        if (updatedBlockToStack.nextBlockId) {
          // Find blockToStack's current next block
          const currentNextBlock = updatedCanvasBlocks.find(
            (b) => b.id === updatedBlockToStack.nextBlockId
          );
          if (currentNextBlock) {
            // Update this block to disconnect from blockToStack
            updatedCanvasBlocks = updateBlockById(
              updatedCanvasBlocks,
              currentNextBlock.id,
              {
                ...currentNextBlock,
                prevBlockId: null,
              }
            );
          }
        }

        // If targetBlock already has a previous block, we need to disconnect it
        if (updatedTargetBlock.prevBlockId) {
          // Find targetBlock's current previous block
          const currentPrevBlock = updatedCanvasBlocks.find(
            (b) => b.id === updatedTargetBlock.prevBlockId
          );
          if (currentPrevBlock) {
            // Update this block to disconnect from targetBlock
            updatedCanvasBlocks = updateBlockById(
              updatedCanvasBlocks,
              currentPrevBlock.id,
              {
                ...currentPrevBlock,
                nextBlockId: null,
              }
            );
          }
        }

        // Now connect blockToStack to targetBlock
        updatedBlockToStack.nextBlockId = targetId;
        updatedTargetBlock.prevBlockId = id;
      } else {
        // Block will be placed below target block

        // If blockToStack already has a previous block, we need to disconnect it
        if (updatedBlockToStack.prevBlockId) {
          // Find blockToStack's current previous block
          const currentPrevBlock = updatedCanvasBlocks.find(
            (b) => b.id === updatedBlockToStack.prevBlockId
          );
          if (currentPrevBlock) {
            // Update this block to disconnect from blockToStack
            updatedCanvasBlocks = updateBlockById(
              updatedCanvasBlocks,
              currentPrevBlock.id,
              {
                ...currentPrevBlock,
                nextBlockId: null,
              }
            );
          }
        }

        // If targetBlock already has a next block, we need to disconnect it
        if (updatedTargetBlock.nextBlockId) {
          // Find targetBlock's current next block
          const currentNextBlock = updatedCanvasBlocks.find(
            (b) => b.id === updatedTargetBlock.nextBlockId
          );
          if (currentNextBlock) {
            // Update this block to disconnect from targetBlock
            updatedCanvasBlocks = updateBlockById(
              updatedCanvasBlocks,
              currentNextBlock.id,
              {
                ...currentNextBlock,
                prevBlockId: null,
              }
            );
          }
        }

        // Now connect targetBlock to blockToStack
        updatedTargetBlock.nextBlockId = id;
        updatedBlockToStack.prevBlockId = targetId;
      }

      // Update the target blocks
      updatedCanvasBlocks = updateBlockById(
        updatedCanvasBlocks,
        targetId,
        updatedTargetBlock
      );

      updatedCanvasBlocks = updateBlockById(
        updatedCanvasBlocks,
        id,
        updatedBlockToStack
      );

      // Update positions for the entire sequence
      // Find the start of the sequence
      let startBlock = updatedBlockToStack;
      if (position === StackPosition.Top) {
        // If we stacked on top, the blockToStack is the new start
        while (startBlock.prevBlockId) {
          const prevBlock = updatedCanvasBlocks.find(
            (b) => b.id === startBlock.prevBlockId
          );
          if (!prevBlock) break;
          startBlock = prevBlock;
        }
      } else {
        // If we stacked on bottom, we need to find the start of targetBlock's sequence
        startBlock = updatedTargetBlock;
        while (startBlock.prevBlockId) {
          const prevBlock = updatedCanvasBlocks.find(
            (b) => b.id === startBlock.prevBlockId
          );
          if (!prevBlock) break;
          startBlock = prevBlock;
        }
      }

      // Now update positions for the sequence
      let currentBlock = startBlock;
      while (currentBlock.nextBlockId) {
        const nextBlock = updatedCanvasBlocks.find(
          (b) => b.id === currentBlock.nextBlockId
        );
        if (!nextBlock) break;

        // Update the next block's position
        const nextPosition = calcNextBlockStartPosition(currentBlock);
        updatedCanvasBlocks = updateBlockById(
          updatedCanvasBlocks,
          nextBlock.id,
          {
            ...nextBlock,
            coords: nextPosition,
          }
        );

        // Move to the next block
        currentBlock = {
          ...nextBlock,
          coords: nextPosition,
        };
      }

      return {
        ...state,
        canvasBlocks: updatedCanvasBlocks,
      };
    }

    case BlockActionEnum.BREAK_STACK: {
      const { id } = action.payload;
      const block = validateBlockExists(
        state.canvasBlocks,
        id,
        BlockActionEnum.BREAK_STACK
      );
      if (!block) {
        return state;
      }
      const prevBlockId = block.prevBlockId;
      if (!prevBlockId) {
        return state;
      }
      const prevBlock = validateBlockExists(
        state.canvasBlocks,
        prevBlockId,
        BlockActionEnum.BREAK_STACK
      );
      if (!prevBlock) {
        return state;
      }

      const updatedBlock = { ...block, prevBlockId: null };
      const updatedPrevBlock = { ...prevBlock, nextBlockId: null };

      let updatedCanvasBlocks = updateBlockById(
        state.canvasBlocks,
        id,
        updatedBlock
      );
      updatedCanvasBlocks = updateBlockById(
        updatedCanvasBlocks,
        prevBlockId,
        updatedPrevBlock
      );

      return { ...state, canvasBlocks: updatedCanvasBlocks };
    }

    case BlockActionEnum.UPDATE_BLOCK: {
      const { id, updates } = action.payload;
      const block = validateBlockExists(
        state.canvasBlocks,
        id,
        BlockActionEnum.BREAK_STACK
      );
      if (!block) {
        return state;
      }

      return {
        ...state,
        canvasBlocks: updateBlockById(state.canvasBlocks, id, {
          ...block,
          ...updates,
        }),
      };
    }

    default:
      return state;
  }
}
