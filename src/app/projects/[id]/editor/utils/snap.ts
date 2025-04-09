import { Block, BlockChildren } from '../blocks/types';
import {
  findBlockById,
  getBlocksSequence,
  removeBlockById,
  updateBlockById,
} from './utils';

/**
 * Snaps a single block above another block
 */
export function handleSnapTop(
  blockToSnap: Block,
  targetBlock: Block,
  canvas: Block[]
) {
  if (targetBlock.parentId) {
    return handleNestedSnapTop(blockToSnap, targetBlock, canvas);
  }

  if (blockToSnap.nextId) {
    return handleSnapSequenceTop(blockToSnap, targetBlock, canvas);
  }

  const newBlockToSnap = { ...blockToSnap };
  const newTargetBlock = { ...targetBlock };

  newBlockToSnap.nextId = newTargetBlock.id;
  newTargetBlock.prevId = newBlockToSnap.id;
  newBlockToSnap.coords = { ...newTargetBlock.coords };

  let newCanvas = updateBlockById(canvas, newBlockToSnap.id, newBlockToSnap);
  newCanvas = updateBlockById(newCanvas, newTargetBlock.id, newTargetBlock);

  return newCanvas;
}

/**
 * Snaps a sequence of blocks above another block
 */
function handleSnapSequenceTop(
  blockToSnap: Block,
  targetBlock: Block,
  canvas: Block[]
) {
  const newBlockToSnap = { ...blockToSnap };
  const newTargetBlock = { ...targetBlock };

  // Find last block in sequence to be snapped
  const sequence = getBlocksSequence(blockToSnap, canvas);
  const lastBlock = sequence[sequence.length - 1];

  // Connect last block with first block of target sequence
  lastBlock.nextId = newTargetBlock.id;
  newTargetBlock.prevId = lastBlock.id;

  // Position new first block
  newBlockToSnap.coords = { ...newTargetBlock.coords };

  let newCanvas = updateBlockById(canvas, lastBlock.id, lastBlock);
  newCanvas = updateBlockById(newCanvas, newBlockToSnap.id, newBlockToSnap);
  newCanvas = updateBlockById(newCanvas, newTargetBlock.id, newTargetBlock);

  return newCanvas;
}

/**
 * Snaps a sequence of blocks below a a sequence of blocks
 */
export function handleSnapBottom(
  blockToSnap: Block,
  targetBlock: Block,
  canvas: Block[]
) {
  if (targetBlock.nextId) {
    return handleSnapBetweenBlocks(blockToSnap, targetBlock, canvas);
  }

  const newBlockToSnap = { ...blockToSnap };
  const newTargetBlock = { ...targetBlock };

  newTargetBlock.nextId = newBlockToSnap.id;
  newBlockToSnap.prevId = newTargetBlock.id;

  let newCanvas = updateBlockById(canvas, newBlockToSnap.id, newBlockToSnap);
  newCanvas = updateBlockById(newCanvas, newTargetBlock.id, newTargetBlock);

  return newCanvas;
}

/**
 * Snaps a single block between a sequence of blocks
 */
export function handleSnapBetweenBlocks(
  blockToSnap: Block,
  targetBlock: Block,
  canvas: Block[]
) {
  if (blockToSnap.nextId) {
    return handleSnapSequenceBetweenBlocks(blockToSnap, targetBlock, canvas);
  }

  const newBlockToSnap = { ...blockToSnap };
  const newTargetBlock = { ...targetBlock };

  newTargetBlock.nextId = newBlockToSnap.id;
  newBlockToSnap.prevId = newTargetBlock.id;
  newBlockToSnap.nextId = targetBlock.nextId;

  const originalNext = findBlockById(targetBlock.nextId!, canvas);
  if (!originalNext) {
    console.error(
      `Error in handleSnapBetweenBlocks: block with ID = ${targetBlock.nextId!} not found`
    );
    return canvas;
  }

  originalNext.prevId = newBlockToSnap.id;

  let newCanvas = updateBlockById(canvas, originalNext.id, originalNext);
  newCanvas = updateBlockById(newCanvas, newBlockToSnap.id, newBlockToSnap);
  newCanvas = updateBlockById(newCanvas, newTargetBlock.id, newTargetBlock);

  return newCanvas;
}

/**
 * Snaps a sequence of blocks between a sequence of blocks
 */
export function handleSnapSequenceBetweenBlocks(
  blockToSnap: Block,
  targetBlock: Block,
  canvas: Block[]
) {
  const newBlockToSnap = { ...blockToSnap };
  const newTargetBlock = { ...targetBlock };

  newTargetBlock.nextId = newBlockToSnap.id;
  newBlockToSnap.prevId = newTargetBlock.id;

  const sequence = getBlocksSequence(blockToSnap, canvas);
  const lastBlock = sequence[sequence.length - 1];

  const originalNext = findBlockById(targetBlock.nextId!, canvas);
  if (!originalNext) {
    console.error(
      `Error in handleSnapSequenceBetweenBlocks: block with ID = ${targetBlock.nextId!} not found`
    );
    return canvas;
  }

  lastBlock.nextId = originalNext.id;
  originalNext.prevId = lastBlock.id;

  let newCanvas = updateBlockById(canvas, lastBlock.id, lastBlock);
  newCanvas = updateBlockById(newCanvas, originalNext.id, originalNext);
  newCanvas = updateBlockById(newCanvas, newBlockToSnap.id, newBlockToSnap);
  newCanvas = updateBlockById(newCanvas, newTargetBlock.id, newTargetBlock);

  return newCanvas;
}

/**
 * Snaps a single block above another (nested) block
 */
function handleNestedSnapTop(
  blockToSnap: Block,
  targetBlock: Block,
  canvas: Block[]
): Block[] {
  // Verify target block has a parent
  if (!targetBlock.parentId) {
    console.error('Error in handleNestedSnapTop: targetBlock has no parentId');
    return canvas;
  }

  // Find the parent block
  const parentBlock = findBlockById(targetBlock.parentId, canvas);
  if (!parentBlock) {
    console.error(
      `Error in handleNestedSnapTop: parent block with ID = ${targetBlock.parentId} not found`
    );
    return canvas;
  }

  // Find which child array contains the target block
  const key = getChildArrayKey(parentBlock, targetBlock);
  if (!key) {
    console.error(
      `Error in handleNestedSnapTop: could not find target block in parent's children`
    );
    return canvas;
  }

  // Create new objects to maintain immutability
  const newBlockToSnap = {
    ...blockToSnap,
    nextId: targetBlock.id,
    parentId: targetBlock.parentId, // Set the parentId to match the target's parent
  };

  const newTargetBlock = {
    ...targetBlock,
    prevId: blockToSnap.id,
  };

  // Remove the block from the canvas
  let newCanvas = removeBlockById(canvas, blockToSnap.id);

  //  Create a new parent block with updated children
  const newParentBlock = { ...parentBlock };

  // Deep clone the children
  const childrenArrays: BlockChildren = { ...newParentBlock.children };

  // Create a new array for the specific key
  childrenArrays[key] = [...(childrenArrays[key] || [])];

  // Add the modified block to the children array
  childrenArrays[key].push(newBlockToSnap);

  // Update the children object
  (newParentBlock.children as BlockChildren) = childrenArrays;

  // First update the parent block (which now contains our block to snap in its children)
  newCanvas = updateBlockById(newCanvas, parentBlock.id, newParentBlock);

  // Then update the target block
  newCanvas = updateBlockById(newCanvas, targetBlock.id, newTargetBlock);

  return newCanvas;
}

function getChildArrayKey(parent: Block, child: Block) {
  if ('children' in parent && parent.children) {
    for (const [key, children] of Object.entries(parent.children)) {
      const index = children.findIndex((block) => block.id === child.id);
      if (index !== -1) {
        return key;
      }
    }
  }

  return null;
}
