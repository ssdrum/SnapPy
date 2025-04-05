import {
  Block,
  BlockChildren,
  BlockState,
  CanvasState,
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
import { CanvasAction, CanvasEvent } from '../blocks/canvas-api';

export default function BlocksReducer(
  state: CanvasState,
  action: CanvasAction
) {
  switch (action.type) {
    case CanvasEvent.SELECT_BLOCK: {
      const { id } = action.payload;
      const block = validateBlockExists(
        state.canvas,
        id,
        CanvasEvent.SELECT_BLOCK
      );
      if (!block) return state;

      const newBlock = { ...block, state: BlockState.Selected };
      return {
        ...state,
        canvas: updateBlockById(state.canvas, id, newBlock),
        selectedBlockId: id,
      };
    }

    case CanvasEvent.DESELECT_BLOCK: {
      const id = state.selectedBlockId;
      if (!id) return state;

      const block = validateBlockExists(
        state.canvas,
        id,
        CanvasEvent.DESELECT_BLOCK
      );
      if (!block) return state;

      const newBlock = { ...block, state: BlockState.Idle };
      return {
        ...state,
        canvas: updateBlockById(state.canvas, id, newBlock),
        selectedBlockId: null,
      };
    }

    case CanvasEvent.START_DRAG: {
      const { id } = action.payload;
      const block = validateBlockExists(
        state.canvas,
        id,
        CanvasEvent.START_DRAG
      );
      if (!block) return state;

      const newBlock = {
        ...block,
        state: BlockState.Dragging,
        // Reset lastDelta when starting a new drag
        // This will signal to the MOVE_BLOCK handler that it's the first move
        lastDelta: undefined,
      };

      const newCanvas = updateBlockById(state.canvas, id, newBlock);

      return {
        ...state,
        canvas: newCanvas,
        draggedGroupBlockIds: getConnectedBlockIds(newCanvas, id),
        draggedBlockId: id,
      };
    }

    case CanvasEvent.MOVE_BLOCK: {
      const { id, delta } = action.payload;
      const block = validateBlockExists(
        state.canvas,
        id,
        CanvasEvent.MOVE_BLOCK
      );
      if (!block) return state;

      let newBlocks = [...state.canvas];

      // For the first move after drag starts, store the original position
      if (!block.lastDelta) {
        // First move in this drag session
        const newBlock = {
          ...block,
          coords: {
            x: block.coords.x + delta.x,
            y: block.coords.y + delta.y,
          },
          lastDelta: { ...delta },
        };

        // Update the dragged block first
        newBlocks = updateBlockById(newBlocks, id, newBlock);

        // Now update any blocks that follow in the sequence
        let currentBlock = newBlock;
        while (currentBlock.nextId) {
          // Find the next block
          const nextBlock = newBlocks.find((b) => b.id === currentBlock.nextId);
          if (!nextBlock) break;

          // Calculate the next position
          const nextPosition = calcNextBlockStartPosition(currentBlock);

          // Update the next block
          const updatedNextBlock = {
            ...nextBlock,
            coords: nextPosition,
            lastDelta: { x: 0, y: 0 },
          };

          // Update our working copy
          newBlocks = updateBlockById(
            newBlocks,
            nextBlock.id,
            updatedNextBlock
          );

          // Move to the next block
          currentBlock = updatedNextBlock;
        }

        return {
          ...state,
          canvas: newBlocks,
        };
      }

      // For subsequent moves, calculate the incremental change since last move
      const incrementalDelta = {
        x: delta.x - block.lastDelta.x,
        y: delta.y - block.lastDelta.y,
      };

      const newBlock = {
        ...block,
        coords: {
          x: block.coords.x + incrementalDelta.x,
          y: block.coords.y + incrementalDelta.y,
        },
        lastDelta: { ...delta },
      };

      // Update the dragged block first
      newBlocks = updateBlockById(newBlocks, id, newBlock);

      // Now update any blocks that follow in the sequence
      let currentBlock = newBlock;
      while (currentBlock.nextId) {
        // Find the next block
        const nextBlock = newBlocks.find((b) => b.id === currentBlock.nextId);
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
        newBlocks = updateBlockById(newBlocks, nextBlock.id, updatedNextBlock);

        // Move to the next block
        currentBlock = updatedNextBlock;
      }

      return {
        ...state,
        canvas: newBlocks,
      };
    }

    case CanvasEvent.END_DRAG: {
      const id = state.draggedBlockId;
      if (!id) return state;
      const block = validateBlockExists(state.canvas, id, CanvasEvent.END_DRAG);
      if (!block) return state;

      const newBlock = {
        ...block,
        state: BlockState.Idle,
      };

      return {
        ...state,
        canvas: updateBlockById(state.canvas, id, newBlock),
        draggedBlockId: null,
        draggedGroupBlockIds: null,
      };
    }

    case CanvasEvent.CREATE_BLOCK: {
      const { id } = action.payload;
      const block = validateBlockExists(
        state.workbench,
        id,
        CanvasEvent.CREATE_BLOCK
      );
      if (!block) return state;

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

    case CanvasEvent.CREATE_AND_DRAG_BLOCK: {
      const { id } = action.payload;
      const block = validateBlockExists(
        state.workbench,
        id,
        CanvasEvent.CREATE_AND_DRAG_BLOCK
      );
      if (!block) return state;

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
        // Set as the dragged block
        draggedBlockId: id,
        draggedGroupBlockIds: new Set<string>([id]), // Initially, just this block
      };
    }

    case CanvasEvent.DELETE_BLOCK: {
      const { id } = action.payload;

      const block = validateBlockExists(
        state.canvas,
        id,
        CanvasEvent.DELETE_BLOCK
      );
      if (!block) return state;

      return {
        ...state,
        canvas: state.canvas.filter((block) => block.id !== id),
      };
    }

    case CanvasEvent.CREATE_VARIABLE: {
      const { name } = action.payload;
      return { ...state, variables: [...state.variables, name] };
    }

    case CanvasEvent.CHANGE_VARIABLE_SELECTED_OPTION: {
      const { id, isWorkbenchBlock, selected } = action.payload;

      const blocksArray = isWorkbenchBlock ? state.workbench : state.canvas;

      const block = validateBlockExists(
        blocksArray,
        id,
        CanvasEvent.CHANGE_VARIABLE_SELECTED_OPTION
      );
      if (!block) return state;

      // Update the block with the new selected variable option
      const newBlock = {
        ...block,
        selected: selected,
      };

      // Update the appropriate blocks array based on whether it's a workbench block
      if (isWorkbenchBlock) {
        return {
          ...state,
          workbench: updateBlockById(state.workbench, id, newBlock),
        };
      } else {
        return {
          ...state,
          canvas: updateBlockById(state.canvas, id, newBlock),
        };
      }
    }

    case CanvasEvent.ADD_CHILD_BLOCK: {
      const { id, targetId, prefix } = action.payload;
      const targetBlock = validateBlockExists(
        state.canvas,
        targetId,
        CanvasEvent.ADD_CHILD_BLOCK
      );
      const blockToNest = validateBlockExists(
        state.canvas,
        id,
        CanvasEvent.ADD_CHILD_BLOCK
      );
      if (!targetBlock || !blockToNest) return state;

      // Avoid nesting into itself
      if (state.draggedGroupBlockIds?.has(targetId)) return state;

      let newCanvas = [...state.canvas];

      // Create sequence to be nested
      const sequenceToNest: Block[] = [
        { ...blockToNest, state: BlockState.Nested, parentId: targetId },
      ];
      let nextId = blockToNest.nextId;
      while (nextId) {
        let curr = findBlockById(state.canvas, nextId);
        if (!curr) break;

        sequenceToNest.push({
          ...curr,
          state: BlockState.Nested,
          parentId: targetId,
        });
        nextId = curr.nextId;
      }

      // Remove blocks in sequence from canvas
      for (const block of sequenceToNest) {
        newCanvas = removeBlockById(newCanvas, block.id);
      }

      // Update the target block to include the nested block in its children
      const newChildren: BlockChildren = { ...targetBlock.children };
      newChildren[prefix] = [...newChildren[prefix], ...sequenceToNest];

      const newTargetBlock = {
        ...targetBlock,
        children: newChildren,
      } as Block;

      newCanvas = updateBlockById(newCanvas, targetId, newTargetBlock);

      //Update positions of following blocks
      const rootBlock = findRoot(newCanvas, newTargetBlock);
      if (rootBlock.nextId) {
        newCanvas = updateSequencePositions(newCanvas, rootBlock);
      }

      return {
        ...state,
        canvas: newCanvas,
        draggedBlockId: null,
        highlightedDropZoneId: null,
      };
    }

    case CanvasEvent.REMOVE_CHILD_BLOCK: {
      const { id, parentId } = action.payload;
      const parent = validateBlockExists(
        state.canvas,
        parentId,
        CanvasEvent.REMOVE_CHILD_BLOCK
      );
      if (!parent) return state;
      const child = validateBlockExists(
        state.canvas,
        id,
        CanvasEvent.REMOVE_CHILD_BLOCK
      );
      if (!child) return state;

      let newCanvas = [...state.canvas];

      newCanvas = removeBlockById(newCanvas, id);
      const newParent = findBlockById(newCanvas, parentId);
      if (!newParent) return state;

      // Create updated version of the child block with reset state and parentId
      const newChild = {
        ...child,
        state: BlockState.Idle,
        parentId: null,
      };

      // Add the reset child block back to the top level of the canvas
      newCanvas = [...newCanvas, newChild];

      // Update positions of following blocks in the sequence if parent is part of a sequence
      const root = findRoot(newCanvas, newParent);
      if (root.nextId) {
        newCanvas = updateSequencePositions(newCanvas, root);
      }

      return {
        ...state,
        canvas: newCanvas,
        draggedBlockId: id,
      };
    }

    // TODO: Not proud of this... but it works!
    case CanvasEvent.STACK_BLOCK: {
      const { id, targetId, position } = action.payload;

      const targetBlock = validateBlockExists(
        state.canvas,
        targetId,
        CanvasEvent.STACK_BLOCK
      );
      const blockToStack = validateBlockExists(
        state.canvas,
        id,
        CanvasEvent.STACK_BLOCK
      );
      if (!targetBlock || !blockToStack) return state;

      // Copy canvas blocks
      let newCanvas = [...state.canvas];
      // Copy involved blocks
      let updatedTargetBlock = { ...targetBlock };
      let newBlockToStack = { ...blockToStack };

      // Set up connections based on position
      if (position === StackPosition.Top) {
        // Save the reference to the target's previous block
        const targetPrevBlockId = updatedTargetBlock.prevId;

        // Check if we're dealing with a single block or a chain
        if (!newBlockToStack.nextId) {
          // Single block case - simpler handling

          // If target has a previous block, connect it to our block
          if (targetPrevBlockId) {
            const updatedPrevBlock = {
              ...findBlockById(newCanvas, targetPrevBlockId)!,
            };
            updatedPrevBlock.nextId = id;
            newCanvas = updateBlockById(
              newCanvas,
              targetPrevBlockId,
              updatedPrevBlock
            );

            // Connect our block back to the previous block
            newBlockToStack.prevId = targetPrevBlockId;
          }

          // Connect our block to the target
          newBlockToStack.nextId = targetId;

          // Update target to point to the block that was inserted above it
          updatedTargetBlock.prevId = newBlockToStack.id;
        } else {
          // Chain case - need to find the first and last blocks in the chain

          // First block is already newBlockToStack
          // Find the last block in the chain
          let lastStackBlock = newBlockToStack;
          let currentBlock = newBlockToStack;

          // Traverse the chain to find the last block
          while (currentBlock.nextId) {
            const nextBlock = findBlockById(newCanvas, currentBlock.nextId);
            if (!nextBlock || nextBlock.id === targetId) break; // Avoid loops
            lastStackBlock = nextBlock;
            currentBlock = nextBlock;
          }

          // If target has a previous block, connect it to the first block in our chain
          if (targetPrevBlockId) {
            const updatedPrevBlock = {
              ...findBlockById(newCanvas, targetPrevBlockId)!,
            };
            updatedPrevBlock.nextId = newBlockToStack.id;
            newCanvas = updateBlockById(
              newCanvas,
              targetPrevBlockId,
              updatedPrevBlock
            );

            // Connect first block in chain back to the previous block
            newBlockToStack.prevId = targetPrevBlockId;
          } else {
            // No previous block, so our chain starts fresh
            newBlockToStack.prevId = null;
          }

          // Connect last block in our chain to the target
          const updatedLastBlock = {
            ...lastStackBlock,
            nextId: targetId,
          };
          newCanvas = updateBlockById(
            newCanvas,
            lastStackBlock.id,
            updatedLastBlock
          );

          // Update target to point to the last block in chain that was inserted above it
          updatedTargetBlock.prevId = lastStackBlock.id;
        }
      } else {
        // Save the reference to the target's next block before we change it
        const targetNextBlockId = updatedTargetBlock.nextId;

        // Check if we're dealing with a single block or a chain
        if (!newBlockToStack.nextId) {
          // Single block case - simpler handling

          // If target has a next block, connect our block to it
          if (targetNextBlockId) {
            // Connect the new block to what was previously the target's next block
            newBlockToStack.nextId = targetNextBlockId;

            // Update the original next block to point back to our block
            const updatedNextBlock = {
              ...findBlockById(newCanvas, targetNextBlockId)!,
              prevId: id,
            };
            newCanvas = updateBlockById(
              newCanvas,
              targetNextBlockId,
              updatedNextBlock
            );
          }
        } else {
          // Chain case - need to find the last block in the chain
          let lastStackBlock = newBlockToStack;
          let currentBlock = newBlockToStack;

          // Traverse the chain to find the last block
          while (currentBlock.nextId) {
            const nextBlock = findBlockById(newCanvas, currentBlock.nextId);
            if (!nextBlock) break;
            lastStackBlock = nextBlock;
            currentBlock = nextBlock;
          }

          // If target has a next block, connect our chain's last block to it
          if (targetNextBlockId) {
            // Update the last block in our stack chain to point to target's next block
            const updatedLastBlock = {
              ...lastStackBlock,
              nextId: targetNextBlockId,
            };
            newCanvas = updateBlockById(
              newCanvas,
              lastStackBlock.id,
              updatedLastBlock
            );

            // Update the original next block to point back to our chain's last block
            const updatedNextBlock = {
              ...findBlockById(newCanvas, targetNextBlockId)!,
              prevId: lastStackBlock.id,
            };
            newCanvas = updateBlockById(
              newCanvas,
              targetNextBlockId,
              updatedNextBlock
            );
          }
        }

        // Connect the target block to the first block in our chain
        updatedTargetBlock.nextId = id;
        newBlockToStack.prevId = targetId;
      }

      // Update the target blocks
      newCanvas = updateBlockById(newCanvas, targetId, updatedTargetBlock);

      newCanvas = updateBlockById(newCanvas, id, newBlockToStack);

      // Update positions for the entire sequence
      // Find the start of the sequence
      let startBlock = newBlockToStack;
      if (position === StackPosition.Top) {
        // If we stacked on top, the blockToStack is the new start
        while (startBlock.prevId) {
          const prevBlock = newCanvas.find((b) => b.id === startBlock.prevId);
          if (!prevBlock) break;
          startBlock = prevBlock;
        }
      } else {
        // If we stacked on bottom, we need to find the start of targetBlock's sequence
        startBlock = updatedTargetBlock;
        while (startBlock.prevId) {
          const prevBlock = newCanvas.find((b) => b.id === startBlock.prevId);
          if (!prevBlock) break;
          startBlock = prevBlock;
        }
      }

      // Now update positions for the sequence
      let currentBlock = startBlock;
      while (currentBlock.nextId) {
        const nextBlock = newCanvas.find((b) => b.id === currentBlock.nextId);
        if (!nextBlock) break;

        // Update the next block's position
        const nextPosition = calcNextBlockStartPosition(currentBlock);
        newCanvas = updateBlockById(newCanvas, nextBlock.id, {
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
        canvas: newCanvas,
        highlightedDropZoneId: null,
      };
    }

    case CanvasEvent.BREAK_STACK: {
      const { id } = action.payload;
      const block = validateBlockExists(
        state.canvas,
        id,
        CanvasEvent.BREAK_STACK
      );
      if (!block) return state;

      const prevId = block.prevId;
      if (!prevId) return state;

      const prevBlock = validateBlockExists(
        state.canvas,
        prevId,
        CanvasEvent.BREAK_STACK
      );
      if (!prevBlock) return state;

      const newBlock = { ...block, prevId: null };
      const updatedPrevBlock = { ...prevBlock, nextId: null };

      let newCanvas = updateBlockById(state.canvas, id, newBlock);
      newCanvas = updateBlockById(newCanvas, prevId, updatedPrevBlock);

      return { ...state, canvas: newCanvas };
    }

    case CanvasEvent.UPDATE_BLOCK: {
      //const { id, updates } = action.payload;
      //const block = validateBlockExists(
      //  state.canvas,
      //  id,
      //  CanvasEvent.BREAK_STACK
      //);
      //if (!block) {
      //  return state;
      //}
      //
      //return {
      //  ...state,
      //  canvas: updateBlockById(state.canvas, id, {
      //    ...block,
      //    ...updates,
      //  }),
      //};
      return state;
    }

    case CanvasEvent.HIGHLIGHT_DROPZONE: {
      const { id } = action.payload;
      if (state.draggedGroupBlockIds?.has(id)) return state;
      return { ...state, highlightedDropZoneId: id };
    }

    case CanvasEvent.CLEAR_HIGHLIGHTED_DROPZONE: {
      return { ...state, highlightedDropZoneId: null };
    }

    case CanvasEvent.DISPLAY_SNAP_PREVIEW: {
      const { id, position } = action.payload;
      let currBlock = validateBlockExists(
        state.canvas,
        id,
        CanvasEvent.DISPLAY_SNAP_PREVIEW
      );
      if (!currBlock) return state;

      // Copy canvas
      let newCanvas = [...state.canvas];

      if (
        position === StackPosition.Top &&
        !currBlock.prevId &&
        currBlock.nextId
      ) {
        return state;
      }
      if (
        position === StackPosition.Top &&
        currBlock.prevId &&
        currBlock.prevId
      ) {
        newCanvas = updateBlockById(newCanvas, id, {
          ...currBlock,
          coords: { ...currBlock.coords, y: currBlock.coords.y + 20 },
        });
      }

      // Update positions of all blocks in sequence
      while (currBlock && currBlock.nextId) {
        const nextBlock = findBlockById(newCanvas, currBlock.nextId);
        if (!nextBlock) break;

        const updatedNextBlock = {
          ...nextBlock,
          coords: { x: nextBlock.coords.x, y: nextBlock.coords.y + 20 },
        };
        newCanvas = updateBlockById(newCanvas, nextBlock.id, updatedNextBlock);
        currBlock = nextBlock;
      }

      return { ...state, canvas: newCanvas };
    }

    case CanvasEvent.HIDE_SNAP_PREVIEW: {
      const { id } = action.payload;
      let rootBlock = validateBlockExists(
        state.canvas,
        id,
        CanvasEvent.HIDE_SNAP_PREVIEW
      );
      if (!rootBlock || !rootBlock.nextId) return state;

      // Redraw connected blocks
      const newCanvas = drawConnectedBlocks(state.canvas, rootBlock);
      return { ...state, canvas: newCanvas };
    }

    default:
      return state;
  }
}
