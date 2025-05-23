import { Block, BlockChildren } from '../blocks/types';
import {
  findBlockById,
  getBlocksSequence,
  removeBlockById,
  removeBlocks,
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
    const parentBlock = findBlockById(targetBlock.parentId, canvas);
    if (!parentBlock) {
      console.error(
        `Error in handleSnapTop: parent block with ID = ${targetBlock.parentId} not found`
      );

      return canvas;
    }

    return handleNestedSnapTop(blockToSnap, targetBlock, parentBlock, canvas);
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
  if (targetBlock.parentId) {
    const parentBlock = findBlockById(targetBlock.parentId, canvas);
    if (!parentBlock) {
      console.error(
        `Error in handleSnapBottom: parent block with ID = ${targetBlock.parentId} not found`
      );

      return canvas;
    }

    return handleNestedSnapBottom(
      blockToSnap,
      targetBlock,
      parentBlock,
      canvas
    );
  }

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
  parentBlock: Block,
  canvas: Block[]
): Block[] {
  // Find which child array contains the target block
  const key = getChildArrayKey(parentBlock, targetBlock);
  if (!key) {
    console.error(
      `Error in handleNestedSnapTop: could not find target block in parent's children`
    );

    return canvas;
  }

  if (blockToSnap.nextId) {
    return handleNestedSnapSequenceTop(
      blockToSnap,
      targetBlock,
      parentBlock,
      key,
      canvas
    );
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

/**
 * Snaps a single block above another (nested) block
 */
function handleNestedSnapBottom(
  blockToSnap: Block,
  targetBlock: Block,
  parentBlock: Block,
  canvas: Block[]
): Block[] {
  // Find which child array contains the target block
  const key = getChildArrayKey(parentBlock, targetBlock);
  if (!key) {
    console.error(
      `Error in handleNestedSnapBottom: could not find target block in parent's children`
    );
    return canvas;
  }
  if (targetBlock.nextId) {
    return handleNestedSnapSequenceMiddle(
      blockToSnap,
      targetBlock,
      parentBlock,
      key,
      canvas
    );
  }

  if (blockToSnap.nextId) {
    return handleNestedSnapSequenceBottom(
      blockToSnap,
      targetBlock,
      parentBlock,
      key,
      canvas
    );
  }

  const newBlockToSnap: Block = {
    ...blockToSnap,
    prevId: targetBlock.id,
    parentId: parentBlock.id,
  };
  const newTargetBlock: Block = { ...targetBlock, nextId: blockToSnap.id };

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

/**
 * Snaps a sequence of blocks above a nested block or nested sequence of blocks
 */
function handleNestedSnapSequenceTop(
  blockToSnap: Block,
  targetBlock: Block,
  parentBlock: Block,
  key: string,
  canvas: Block[]
) {
  // Find last block in sequence to be snapped
  const sequence = getBlocksSequence(blockToSnap, canvas);
  let lastBlock: Block | undefined;
  for (const block of sequence) {
    if (!block.nextId) {
      lastBlock = block;
      break;
    }
  }

  if (!lastBlock) {
    console.error(
      `Error in handleNestedSnapSequenceTop: could not find last block`
    );

    return canvas;
  }

  // Remove blocks in sequence to snap from canvas
  let newCanvas = removeBlocks(sequence, canvas);

  //  Create a new parent block with updated children
  const newParentBlock = { ...parentBlock };

  // Deep clone the children
  const childrenArrays: BlockChildren = { ...newParentBlock.children };

  // Create a new array for the specific key
  childrenArrays[key] = [...(childrenArrays[key] || [])].filter(
    (block) => block.id !== targetBlock.id // Remove target block from original array
  );

  // Add new target block back in
  const newTargetBlock: Block = { ...targetBlock, prevId: lastBlock.id };
  childrenArrays[key].push(newTargetBlock);

  // Add the modified blocks to the children array
  for (const block of sequence) {
    block.parentId = parentBlock.id; // Add parent id

    // Connect last block with new next
    if (block.id === lastBlock.id) {
      block.nextId = targetBlock.id;
    }

    childrenArrays[key].push(block);
  }

  // Update the children object and replace parent block
  (newParentBlock.children as BlockChildren) = childrenArrays;
  newCanvas = updateBlockById(newCanvas, parentBlock.id, newParentBlock);

  return newCanvas;
}

/**
 * Snaps a sequence of blocks below a nested block or nested sequence of blocks
 */
function handleNestedSnapSequenceBottom(
  blockToSnap: Block,
  targetBlock: Block,
  parentBlock: Block,
  key: string,
  canvas: Block[]
) {
  // Remove blocks in sequence to snap from canvas
  const sequence = getBlocksSequence(blockToSnap, canvas);
  let newCanvas = removeBlocks(sequence, canvas);

  //  Create a new parent block with updated children
  const newParentBlock = { ...parentBlock };

  // Deep clone the children
  const childrenArrays: BlockChildren = { ...newParentBlock.children };

  // Create a new array for the specific key
  childrenArrays[key] = [...(childrenArrays[key] || [])].filter(
    (block) => block.id !== targetBlock.id // Remove target block from original array
  );

  // Add new target block back in
  const newTargetBlock: Block = { ...targetBlock, nextId: blockToSnap.id };
  childrenArrays[key].push(newTargetBlock);

  // Add the modified blocks to the children array
  for (const block of sequence) {
    block.parentId = parentBlock.id; // Add parent id

    // Connect last block with new next
    if (block.id === blockToSnap.id) {
      block.prevId = targetBlock.id;
    }

    childrenArrays[key].push(block);
  }

  // Update the children object and replace parent block
  (newParentBlock.children as BlockChildren) = childrenArrays;
  newCanvas = updateBlockById(newCanvas, parentBlock.id, newParentBlock);

  return newCanvas;
}

/**
 * Snaps a sequence of blocks in between a nested sequence of blocks
 */
function handleNestedSnapSequenceMiddle(
  blockToSnap: Block,
  targetBlock: Block,
  parentBlock: Block,
  key: string,
  canvas: Block[]
) {
  // Remove blocks in sequence to snap from canvas
  const sequence = getBlocksSequence(blockToSnap, canvas);
  let newCanvas = removeBlocks(sequence, canvas);

  //  Create a new parent block with updated children
  const newParentBlock = { ...parentBlock };

  // Deep clone the children
  const childrenArrays: BlockChildren = { ...newParentBlock.children };

  // Create a new array for the specific key
  childrenArrays[key] = [...(childrenArrays[key] || [])].filter(
    (block) => block.id !== targetBlock.id && block.id !== targetBlock.nextId // Remove target block and its next
  );

  // Add new target block back in
  const newTargetBlock: Block = { ...targetBlock, nextId: blockToSnap.id };
  childrenArrays[key].push(newTargetBlock);

  let newTargetNextBlock = findBlockById(targetBlock.nextId!, canvas);
  if (!newTargetNextBlock) {
    console.error(
      `Error in handleNestedSnapSequenceMiddle: could not find target's next block`
    );

    return canvas;
  }

  // Set new target's next blocks prev to last block of sequence to snap
  const lastBlock = sequence[sequence.length - 1];
  newTargetNextBlock.prevId = lastBlock.id;
  childrenArrays[key].push(newTargetNextBlock);

  // Update prev and next in sequence to snap
  for (const block of sequence) {
    block.parentId = parentBlock.id; // Add parent id

    if (block.id === blockToSnap.id) {
      block.prevId = targetBlock.id;
    }
    if (block.id === lastBlock.id) {
      block.nextId = newTargetNextBlock.id;
    }

    childrenArrays[key].push(block);
  }

  // Update the children object and replace parent block
  (newParentBlock.children as BlockChildren) = childrenArrays;
  newCanvas = updateBlockById(newCanvas, parentBlock.id, newParentBlock);

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
