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
  drawConnectedBlocks,
  findBlockById,
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
        state.canvas,
        id,
        BlockActionEnum.SELECT_BLOCK
      );
      if (!block) return state;

      const updatedBlock = { ...block, state: BlockState.Selected };
      return {
        ...state,
        canvas: updateBlockById(state.canvas, id, updatedBlock),
        selectedBlockId: id,
      };
    }

    case BlockActionEnum.DESELECT_BLOCK: {
      const id = state.selectedBlockId;
      if (!id) return state;

      const block = validateBlockExists(
        state.canvas,
        id,
        BlockActionEnum.DESELECT_BLOCK
      );
      if (!block) return state;

      const updatedBlock = { ...block, state: BlockState.Idle };
      return {
        ...state,
        canvas: updateBlockById(state.canvas, id, updatedBlock),
        selectedBlockId: null,
      };
    }

    case BlockActionEnum.START_DRAG: {
      const { id } = action.payload;
      const block = validateBlockExists(
        state.canvas,
        id,
        BlockActionEnum.START_DRAG
      );
      if (!block) return state;

      const updatedBlock = {
        ...block,
        state: BlockState.Dragging,
        // Reset lastDelta when starting a new drag
        // This will signal to the MOVE_BLOCK handler that it's the first move
        lastDelta: undefined,
      };

      const newCanvasBlocks = updateBlockById(state.canvas, id, updatedBlock);

      return {
        ...state,
        canvas: newCanvasBlocks,
        dragGroupBlockIds: getConnectedBlockIds(newCanvasBlocks, id),
        draggingBlockId: id,
      };
    }

    case BlockActionEnum.MOVE_BLOCK: {
      const { id, delta } = action.payload;
      const block = validateBlockExists(
        state.canvas,
        id,
        BlockActionEnum.MOVE_BLOCK
      );
      if (!block) {
        return state;
      }

      let updatedBlocks = [...state.canvas];

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
          canvas: updatedBlocks,
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
        canvas: updatedBlocks,
      };
    }

    case BlockActionEnum.END_DRAG: {
      const id = state.draggingBlockId;
      if (!id) {
        return state;
      }

      const block = validateBlockExists(
        state.canvas,
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
        canvas: updateBlockById(state.canvas, id, updatedBlock),
        draggingBlockId: null,
        dragGroupBlockIds: null,
      };
    }

    case BlockActionEnum.CREATE_BLOCK: {
      const { id } = action.payload;
      const block = validateBlockExists(
        state.workbench,
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
        canvas: [...state.canvas, newBlock],
        // Replace the original workbench block with one having a new ID
        workbench: state.workbench.map((block) =>
          block.id === id ? newWorkbenchBlock : block
        ),
      };
    }

    case BlockActionEnum.CREATE_AND_DRAG_BLOCK: {
      const { id } = action.payload;
      const block = validateBlockExists(
        state.workbench,
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
        canvas: [...state.canvas, newBlock],
        // Replace the original workbench block with one having a new ID
        workbench: state.workbench.map((block) =>
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
        state.canvas,
        id,
        BlockActionEnum.DELETE_BLOCK
      );
      if (!block) {
        return state;
      }

      return {
        ...state,
        canvas: state.canvas.filter((block) => block.id !== id),
      };
    }

    case BlockActionEnum.CREATE_VARIABLE: {
      const { name } = action.payload;
      return { ...state, variables: [...state.variables, name] };
    }

    case BlockActionEnum.CHANGE_VARIABLE_SELECTED_OPTION: {
      const { id, isWorkbenchBlock, selected } = action.payload;

      const blocksArray = isWorkbenchBlock ? state.workbench : state.canvas;

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
          workbench: updateBlockById(state.workbench, id, updatedBlock),
        };
      } else {
        return {
          ...state,
          canvas: updateBlockById(state.canvas, id, updatedBlock),
        };
      }
    }

    case BlockActionEnum.ADD_CHILD_BLOCK: {
      const { id, targetId } = action.payload;
      const targetBlock = validateBlockExists(
        state.canvas,
        targetId,
        BlockActionEnum.ADD_CHILD_BLOCK
      );
      const blockToNest = validateBlockExists(
        state.canvas,
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
      let newBlocks = removeBlockById(state.canvas, id);

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
        canvas: newBlocks,
        draggingBlockId: null,
        highlightedDropZoneId: null,
      };
    }

    case BlockActionEnum.REMOVE_CHILD_BLOCK: {
      const { id, parentId } = action.payload;
      const parentBlock = validateBlockExists(
        state.canvas,
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
        state.canvas,
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
        canvas: newBlocks,
        draggingBlockId: id,
      };
    }

    // TODO: Not proud of this... but it works!
    case BlockActionEnum.STACK_BLOCK: {
      const { id, targetId, position } = action.payload;

      const targetBlock = validateBlockExists(
        state.canvas,
        targetId,
        BlockActionEnum.STACK_BLOCK
      );
      const blockToStack = validateBlockExists(
        state.canvas,
        id,
        BlockActionEnum.STACK_BLOCK
      );
      if (!targetBlock || !blockToStack) {
        return state;
      }

      // Copy canvas blocks
      let updatedCanvas = [...state.canvas];
      // Copy involved blocks
      let updatedTargetBlock = { ...targetBlock };
      let updatedBlockToStack = { ...blockToStack };

      // Set up connections based on position
      if (position === StackPosition.Top) {
        // Save the reference to the target's previous block
        const targetPrevBlockId = updatedTargetBlock.prevBlockId;

        // Check if we're dealing with a single block or a chain
        if (!updatedBlockToStack.nextBlockId) {
          // Single block case - simpler handling

          // If target has a previous block, connect it to our block
          if (targetPrevBlockId) {
            const updatedPrevBlock = {
              ...findBlockById(updatedCanvas, targetPrevBlockId)!,
            };
            updatedPrevBlock.nextBlockId = id;
            updatedCanvas = updateBlockById(
              updatedCanvas,
              targetPrevBlockId,
              updatedPrevBlock
            );

            // Connect our block back to the previous block
            updatedBlockToStack.prevBlockId = targetPrevBlockId;
          }

          // Connect our block to the target
          updatedBlockToStack.nextBlockId = targetId;

          // Update target to point to the block that was inserted above it
          updatedTargetBlock.prevBlockId = updatedBlockToStack.id;
        } else {
          // Chain case - need to find the first and last blocks in the chain

          // First block is already updatedBlockToStack
          // Find the last block in the chain
          let lastStackBlock = updatedBlockToStack;
          let currentBlock = updatedBlockToStack;

          // Traverse the chain to find the last block
          while (currentBlock.nextBlockId) {
            const nextBlock = findBlockById(
              updatedCanvas,
              currentBlock.nextBlockId
            );
            if (!nextBlock || nextBlock.id === targetId) break; // Avoid loops
            lastStackBlock = nextBlock;
            currentBlock = nextBlock;
          }

          // If target has a previous block, connect it to the first block in our chain
          if (targetPrevBlockId) {
            const updatedPrevBlock = {
              ...findBlockById(updatedCanvas, targetPrevBlockId)!,
            };
            updatedPrevBlock.nextBlockId = updatedBlockToStack.id;
            updatedCanvas = updateBlockById(
              updatedCanvas,
              targetPrevBlockId,
              updatedPrevBlock
            );

            // Connect first block in chain back to the previous block
            updatedBlockToStack.prevBlockId = targetPrevBlockId;
          } else {
            // No previous block, so our chain starts fresh
            updatedBlockToStack.prevBlockId = null;
          }

          // Connect last block in our chain to the target
          const updatedLastBlock = {
            ...lastStackBlock,
            nextBlockId: targetId,
          };
          updatedCanvas = updateBlockById(
            updatedCanvas,
            lastStackBlock.id,
            updatedLastBlock
          );

          // Update target to point to the last block in chain that was inserted above it
          updatedTargetBlock.prevBlockId = lastStackBlock.id;
        }
      } else {
        // Save the reference to the target's next block before we change it
        const targetNextBlockId = updatedTargetBlock.nextBlockId;

        // Check if we're dealing with a single block or a chain
        if (!updatedBlockToStack.nextBlockId) {
          // Single block case - simpler handling

          // If target has a next block, connect our block to it
          if (targetNextBlockId) {
            // Connect the new block to what was previously the target's next block
            updatedBlockToStack.nextBlockId = targetNextBlockId;

            // Update the original next block to point back to our block
            const updatedNextBlock = {
              ...findBlockById(updatedCanvas, targetNextBlockId)!,
              prevBlockId: id,
            };
            updatedCanvas = updateBlockById(
              updatedCanvas,
              targetNextBlockId,
              updatedNextBlock
            );
          }
        } else {
          // Chain case - need to find the last block in the chain
          let lastStackBlock = updatedBlockToStack;
          let currentBlock = updatedBlockToStack;

          // Traverse the chain to find the last block
          while (currentBlock.nextBlockId) {
            const nextBlock = findBlockById(
              updatedCanvas,
              currentBlock.nextBlockId
            );
            if (!nextBlock) break;
            lastStackBlock = nextBlock;
            currentBlock = nextBlock;
          }

          // If target has a next block, connect our chain's last block to it
          if (targetNextBlockId) {
            // Update the last block in our stack chain to point to target's next block
            const updatedLastBlock = {
              ...lastStackBlock,
              nextBlockId: targetNextBlockId,
            };
            updatedCanvas = updateBlockById(
              updatedCanvas,
              lastStackBlock.id,
              updatedLastBlock
            );

            // Update the original next block to point back to our chain's last block
            const updatedNextBlock = {
              ...findBlockById(updatedCanvas, targetNextBlockId)!,
              prevBlockId: lastStackBlock.id,
            };
            updatedCanvas = updateBlockById(
              updatedCanvas,
              targetNextBlockId,
              updatedNextBlock
            );
          }
        }

        // Connect the target block to the first block in our chain
        updatedTargetBlock.nextBlockId = id;
        updatedBlockToStack.prevBlockId = targetId;
      }

      // Update the target blocks
      updatedCanvas = updateBlockById(
        updatedCanvas,
        targetId,
        updatedTargetBlock
      );

      updatedCanvas = updateBlockById(updatedCanvas, id, updatedBlockToStack);

      // Update positions for the entire sequence
      // Find the start of the sequence
      let startBlock = updatedBlockToStack;
      if (position === StackPosition.Top) {
        // If we stacked on top, the blockToStack is the new start
        while (startBlock.prevBlockId) {
          const prevBlock = updatedCanvas.find(
            (b) => b.id === startBlock.prevBlockId
          );
          if (!prevBlock) break;
          startBlock = prevBlock;
        }
      } else {
        // If we stacked on bottom, we need to find the start of targetBlock's sequence
        startBlock = updatedTargetBlock;
        while (startBlock.prevBlockId) {
          const prevBlock = updatedCanvas.find(
            (b) => b.id === startBlock.prevBlockId
          );
          if (!prevBlock) break;
          startBlock = prevBlock;
        }
      }

      // Now update positions for the sequence
      let currentBlock = startBlock;
      while (currentBlock.nextBlockId) {
        const nextBlock = updatedCanvas.find(
          (b) => b.id === currentBlock.nextBlockId
        );
        if (!nextBlock) break;

        // Update the next block's position
        const nextPosition = calcNextBlockStartPosition(currentBlock);
        updatedCanvas = updateBlockById(updatedCanvas, nextBlock.id, {
          ...nextBlock,
          coords: nextPosition,
        });

        // Move to the next block
        currentBlock = {
          ...nextBlock,
          coords: nextPosition,
        };
      }

      return {
        ...state,
        canvas: updatedCanvas,
        highlightedDropZoneId: null,
      };
    }

    case BlockActionEnum.BREAK_STACK: {
      const { id } = action.payload;
      const block = validateBlockExists(
        state.canvas,
        id,
        BlockActionEnum.BREAK_STACK
      );
      if (!block) return state;

      const prevBlockId = block.prevBlockId;
      if (!prevBlockId) return state;

      const prevBlock = validateBlockExists(
        state.canvas,
        prevBlockId,
        BlockActionEnum.BREAK_STACK
      );
      if (!prevBlock) return state;

      const updatedBlock = { ...block, prevBlockId: null };
      const updatedPrevBlock = { ...prevBlock, nextBlockId: null };

      let updatedCanvas = updateBlockById(state.canvas, id, updatedBlock);
      updatedCanvas = updateBlockById(
        updatedCanvas,
        prevBlockId,
        updatedPrevBlock
      );

      return { ...state, canvas: updatedCanvas };
    }

    case BlockActionEnum.UPDATE_BLOCK: {
      const { id, updates } = action.payload;
      const block = validateBlockExists(
        state.canvas,
        id,
        BlockActionEnum.BREAK_STACK
      );
      if (!block) {
        return state;
      }

      return {
        ...state,
        canvas: updateBlockById(state.canvas, id, {
          ...block,
          ...updates,
        }),
      };
    }

    case BlockActionEnum.HIGHLIGHT_DROPZONE: {
      const { id } = action.payload;
      if (state.dragGroupBlockIds?.has(id)) return state;
      return { ...state, highlightedDropZoneId: id };
    }

    case BlockActionEnum.CLEAR_HIGHLIGHTED_DROPZONE: {
      return { ...state, highlightedDropZoneId: null };
    }

    case BlockActionEnum.DISPLAY_SNAP_PREVIEW: {
      const { id, position } = action.payload;
      let currBlock = validateBlockExists(
        state.canvas,
        id,
        BlockActionEnum.DISPLAY_SNAP_PREVIEW
      );
      if (!currBlock) {
        return state;
      }

      // Copy canvas
      let newCanvas = [...state.canvas];

      if (
        position === StackPosition.Top &&
        !currBlock.prevBlockId &&
        currBlock.nextBlockId
      ) {
        return state;
      }
      if (
        position === StackPosition.Top &&
        currBlock.prevBlockId &&
        currBlock.prevBlockId
      ) {
        newCanvas = updateBlockById(newCanvas, id, {
          ...currBlock,
          coords: { ...currBlock.coords, y: currBlock.coords.y + 20 },
        });
      }

      // Update positions of all blocks in sequence
      while (currBlock && currBlock.nextBlockId) {
        const nextBlock = findBlockById(newCanvas, currBlock.nextBlockId);
        if (!nextBlock) {
          break;
        }

        const updatedNextBlock = {
          ...nextBlock,
          coords: { x: nextBlock.coords.x, y: nextBlock.coords.y + 20 },
        };
        newCanvas = updateBlockById(newCanvas, nextBlock.id, updatedNextBlock);
        currBlock = nextBlock;
      }

      return { ...state, canvas: newCanvas };
    }

    case BlockActionEnum.HIDE_SNAP_PREVIEW: {
      const { id } = action.payload;
      let rootBlock = validateBlockExists(
        state.canvas,
        id,
        BlockActionEnum.HIDE_SNAP_PREVIEW
      );
      if (!rootBlock || !rootBlock.nextBlockId) {
        return state;
      }

      // Redraw connected blocks
      const newCanvas = drawConnectedBlocks(state.canvas, rootBlock);
      return { ...state, canvas: newCanvas };
    }

    default:
      return state;
  }
}
