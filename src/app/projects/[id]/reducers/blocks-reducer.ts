import {
  Block,
  BlockChildren,
  BlockState,
  BlockType,
  BooleanBlock,
  CanvasState,
  NumberBlock,
  OuterDropzonePosition,
  VariableValueBlock,
} from '../blocks/types';
import { v4 as uuidv4 } from 'uuid';
import {
  findBlockById,
  getBlocksSequence,
  getConnectedBlockIds,
  removeBlockById,
  removeBlocks,
  updateBlockById,
  validateBlockExists,
} from '../utils/utils';
import { CanvasAction, CanvasEvent } from '../blocks/canvas-api';
import { handleSnapBottom, handleSnapTop } from '../utils/snap';

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
      if (!block || block.type === BlockType.ProgramStart) return state;

      let newCanvas = [...state.canvas];

      // Delete all blocks connected to deleted block
      const blocksToDelete = getConnectedBlockIds(state.canvas, id);
      for (const blockId of blocksToDelete) {
        newCanvas = removeBlockById(newCanvas, blockId);
      }

      return {
        ...state,
        canvas: newCanvas,
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

    case CanvasEvent.CHANGE_VARIABLE_VALUE_SELECTED_OPTION: {
      const { id, selected, isWorkbenchBlock } = action.payload;
      const blocksArray = isWorkbenchBlock ? state.workbench : state.canvas;

      const block = validateBlockExists(
        blocksArray,
        id,
        CanvasEvent.CHANGE_BOOLEAN_VALUE
      );
      if (!block) return state;

      const newBlock: VariableValueBlock = {
        ...(block as VariableValueBlock),
        selected: selected,
      };

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
      if (
        !targetBlock ||
        !blockToNest ||
        blockToNest.type === BlockType.ProgramStart
      )
        return { ...state, draggedBlockId: null, highlightedDropZoneId: null };

      // Avoid nesting into itself
      if (state.draggedGroupBlockIds?.has(targetId))
        return { ...state, draggedBlockId: null, highlightedDropZoneId: null };

      let newCanvas = [...state.canvas];

      // Find sequence
      const sequenceToNest = getBlocksSequence(blockToNest, newCanvas);

      // Update blocks in sequence
      for (const block of sequenceToNest) {
        block.state = BlockState.Nested;
        block.parentId = targetId;
      }

      // Remove blocks in sequence from canvas
      newCanvas = removeBlocks(sequenceToNest, newCanvas);

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
      if (!child) {
        return { ...state, draggedBlockId: null, highlightedDropZoneId: null };
      }

      let newCanvas = [...state.canvas];

      // Find sequence
      const sequenceToUnnest = getBlocksSequence(child, newCanvas);

      // Update blocks in sequence
      for (const block of sequenceToUnnest) {
        block.state = BlockState.Idle;
        block.parentId = null;
      }

      // Remove blocks in sequence from canvas
      newCanvas = removeBlocks(sequenceToUnnest, newCanvas);

      const newParent = findBlockById(parentId, newCanvas);
      if (!newParent) {
        return { ...state, draggedBlockId: null, highlightedDropZoneId: null };
      }

      // Add sequence back to the top level of the canvas
      newCanvas = [...newCanvas, ...sequenceToUnnest];

      return {
        ...state,
        canvas: newCanvas,
        draggedBlockId: id,
        highlightedDropZoneId: null,
      };
    }

    case CanvasEvent.SNAP_BLOCK: {
      const { id, targetId, position } = action.payload;
      const targetBlock = validateBlockExists(
        state.canvas,
        targetId,
        CanvasEvent.SNAP_BLOCK
      );
      const blockToSnap = validateBlockExists(
        state.canvas,
        id,
        CanvasEvent.SNAP_BLOCK
      );
      if (!targetBlock || !blockToSnap) return state;

      let newCanvas: Block[] = [];

      if (position === OuterDropzonePosition.Top) {
        newCanvas = handleSnapTop(blockToSnap, targetBlock, state.canvas);

        // update start program block
        if (blockToSnap.type === BlockType.ProgramStart) {
          return {
            ...state,
            canvas: newCanvas,
            entrypointBlockId: targetId,
          } as CanvasState;
        }
      } else {
        newCanvas = handleSnapBottom(blockToSnap, targetBlock, state.canvas);

        // update start program block
        if (targetBlock.type === BlockType.ProgramStart) {
          return {
            ...state,
            canvas: newCanvas,
            entrypointBlockId: id,
          } as CanvasState;
        }
      }

      return {
        ...state,
        canvas: newCanvas,
      };
    }

    case CanvasEvent.UNSNAP_BLOCK: {
      const { id } = action.payload;
      const block = validateBlockExists(
        state.canvas,
        id,
        CanvasEvent.UNSNAP_BLOCK
      );
      if (!block) return state;

      const prevId = block.prevId;
      if (!prevId) return state;

      const prevBlock = validateBlockExists(
        state.canvas,
        prevId,
        CanvasEvent.UNSNAP_BLOCK
      );
      if (!prevBlock) return state;

      const newBlock = { ...block, prevId: null };
      const updatedPrevBlock = { ...prevBlock, nextId: null };

      let newCanvas = updateBlockById(state.canvas, id, newBlock);
      newCanvas = updateBlockById(newCanvas, prevId, updatedPrevBlock);

      // Set start block id to null if we unsnapped the start block
      if (block.id === state.entrypointBlockId) {
        return {
          ...state,
          canvas: newCanvas,
          entrypointBlockId: null,
        } as CanvasState;
      }

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
      if (state.draggedGroupBlockIds?.has(id)) {
        return { ...state, highlightedDropZoneId: null };
      }

      return { ...state, highlightedDropZoneId: id };
    }

    case CanvasEvent.CLEAR_HIGHLIGHTED_DROPZONE: {
      return { ...state, highlightedDropZoneId: null };
    }

    case CanvasEvent.CHANGE_INPUT_TEXT: {
      const { id, isWorkbenchBlock, text } = action.payload;

      const blocksArray = isWorkbenchBlock ? state.workbench : state.canvas;

      const block = validateBlockExists(
        blocksArray,
        id,
        CanvasEvent.CHANGE_INPUT_TEXT
      );
      if (!block) return state;

      // Update the block with the new selected variable option
      const newBlock: NumberBlock = {
        ...(block as NumberBlock),
        value: text,
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

    case CanvasEvent.CHANGE_BOOLEAN_VALUE: {
      const { id, value, isWorkbenchBlock } = action.payload;

      const blocksArray = isWorkbenchBlock ? state.workbench : state.canvas;

      const block = validateBlockExists(
        blocksArray,
        id,
        CanvasEvent.CHANGE_BOOLEAN_VALUE
      );
      if (!block) return state;

      const newBlock: BooleanBlock = {
        ...(block as BooleanBlock),
        value: value,
      };

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

    default:
      return state;
  }
}
