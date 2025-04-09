import { Block } from '../blocks/types';
import { findBlockById, getBlocksSequence, updateBlockById } from './utils';

/**
 * Snaps a single block above another block
 */
export function handleSnapTop(
  blockToSnap: Block,
  targetBlock: Block,
  canvas: Block[]
) {
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
  let newCanvas = updateBlockById(canvas, lastBlock.id, lastBlock);

  originalNext.prevId = lastBlock.id;
  newCanvas = updateBlockById(newCanvas, originalNext.id, originalNext);

  newCanvas = updateBlockById(newCanvas, newBlockToSnap.id, newBlockToSnap);
  newCanvas = updateBlockById(newCanvas, newTargetBlock.id, newTargetBlock);

  return newCanvas;
}
