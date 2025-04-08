import {
  Block,
  BlockChildren,
  BlockState,
  CanvasState,
  OuterDropzonePosition,
} from '../blocks/types';
import { v4 as uuidv4 } from 'uuid';
import {
  findBlockById,
  findRoot,
  getBlocksSequence,
  getConnectedBlockIds,
  removeBlocks,
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
      };

      const newCanvas = updateBlockById(state.canvas, id, newBlock);

      return {
        ...state,
        canvas: newCanvas,
        draggedGroupBlockIds: getConnectedBlockIds(newCanvas, id),
        draggedBlockId: id,
      };
    }

    case CanvasEvent.END_DRAG: {
      const { delta } = action.payload;
      const id = state.draggedBlockId;
      if (!id) return state;
      const block = validateBlockExists(state.canvas, id, CanvasEvent.END_DRAG);
      if (!block) return state;

      const newBlock = {
        ...block,
        state: BlockState.Idle,
        coords: { x: block.coords.x + delta.x, y: block.coords.y + delta.y },
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

      // Find sequence
      const sequenceToNest = getBlocksSequence(blockToNest, newCanvas);

      // Update blocks in sequence
      for (const block of sequenceToNest) {
        block.state = BlockState.Nested;
        block.parentId = targetId;
      }

      // Remove blocks in sequence from canvas
      newCanvas = removeBlocks(newCanvas, sequenceToNest);

      // Update the target block to include the updated sequence in its children
      const newChildren: BlockChildren = { ...targetBlock.children };
      newChildren[prefix] = [...newChildren[prefix], ...sequenceToNest];

      // Update target block
      const newTargetBlock = {
        ...targetBlock,
        children: newChildren,
      } as Block;

      // Update canvas
      newCanvas = updateBlockById(newCanvas, targetId, newTargetBlock);

      // Update positions of following blocks
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

      // Find sequence
      const sequenceToUnnest = getBlocksSequence(child, newCanvas);

      // Update blocks in sequence
      for (const block of sequenceToUnnest) {
        block.state = BlockState.Idle;
        block.parentId = null;
      }

      // Remove blocks in sequence from canvas
      newCanvas = removeBlocks(newCanvas, sequenceToUnnest);

      const newParent = findBlockById(newCanvas, parentId);
      if (!newParent) return state;

      // Add sequence back to the top level of the canvas
      newCanvas = [...newCanvas, ...sequenceToUnnest];

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
      let newTargetBlock = { ...targetBlock };
      let newBlockToStack = { ...blockToStack };

      if (position === OuterDropzonePosition.Top) {
        // Stacking above the target block
        newBlockToStack.nextId = targetBlock.id;
        newTargetBlock.prevId = blockToStack.id;

        if (targetBlock.prevId) {
          const newTargetPrev = findBlockById(state.canvas, targetBlock.prevId);
          if (!newTargetPrev) return state; // TODO: Handle this better
          newTargetPrev.nextId = blockToStack.id;
          newBlockToStack.prevId = targetBlock.prevId;
        } else {
          newBlockToStack.coords = { ...newTargetBlock.coords }; // Place the new start block where the previous start blockk was
          newTargetBlock.coords = { x: 0, y: 0 };
        }
      } else {
        // Stacking below the target block
        newTargetBlock.nextId = blockToStack.id;
        newBlockToStack.prevId = targetBlock.id;

        if (targetBlock.nextId) {
          const newTargetNext = findBlockById(state.canvas, targetBlock.nextId);
          if (!newTargetNext) return state; // TODO: Handle this better
          newTargetNext.prevId = blockToStack.id;
          newBlockToStack.nextId = targetBlock.nextId;
        }
      }

      newCanvas = updateBlockById(newCanvas, blockToStack.id, newBlockToStack);
      newCanvas = updateBlockById(newCanvas, targetBlock.id, newTargetBlock);

      return {
        ...state,
        canvas: newCanvas,
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

    default:
      return state;
  }
}
