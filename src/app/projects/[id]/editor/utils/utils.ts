import { Coordinates } from '@dnd-kit/core/dist/types';
import { Block } from '../blocks/types';

/**
 * Traverses the canvas recursively and returns the block with the provided id
 * if found. Returns null if not found.
 * Note: A canvas is a set of disjoint trees.
 * TODO: Add unit tests
 */
export function findBlockById(canvas: Block[], id: string): Block | null {
  for (const root of canvas) {
    if (root.id === id) {
      return root;
    }

    if (root.children.length > 0) {
      const found = findBlockById(root.children, id);
      if (found) {
        return found;
      }
    }
  }

  return null;
}

/**
 * Traverses the canvas recursively and updates the block with the provided id
 * with the updatedBlock.
 * TODO: Add unit tests
 */
export function updateBlockById(
  blocks: Block[],
  id: string,
  updatedBlock: Block
): Block[] {
  // Create a new array to avoid mutating the original
  return blocks.map((block) => {
    // If this is the block to update, return the updated block
    if (block.id === id) {
      return updatedBlock;
    }

    // If this block has children, recursively update them
    if (block.children.length > 0) {
      return {
        ...block,
        children: updateBlockById(block.children, id, updatedBlock),
      };
    }

    // Otherwise, return the block unchanged
    return block;
  });
}

/**
 * Removes the block with the provided id from the canvas.
 */
export function removeBlockById(blocks: Block[], id: string): Block[] {
  // First filter out any blocks that match the id at the current level
  const filteredBlocks = blocks.filter((block) => block.id !== id);

  // If we removed something, return the filtered array
  if (filteredBlocks.length < blocks.length) {
    return filteredBlocks;
  }

  // Otherwise, map through the blocks and check children
  return blocks.map((block) => {
    // If this block has children, recursively check them
    if (block.children.length > 0) {
      return {
        ...block,
        children: removeBlockById(block.children, id),
      };
    }

    // Otherwise, return the block unchanged
    return block;
  });
}

export function validateBlockExists(
  blocks: Block[],
  id: string | null,
  actionName: string
): Block | null {
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
}

/**
 * Resizes a select element to match the width of its selected option
 * @param selectRef React ref to the select element
 * source: https://stackoverflow.com/questions/28308103/adjust-width-of-select-element-according-to-selected-options-width
 */
export function resizeSelect(
  selectRef: React.RefObject<HTMLSelectElement | null>
): void {
  if (!selectRef.current) return;

  const select = selectRef.current;

  // Create a temporary option with the same text as the selected option
  const tempOption = document.createElement('option');
  tempOption.textContent = select.selectedOptions[0].textContent;

  // Create a temporary select and add the option to it
  const tempSelect = document.createElement('select');
  tempSelect.style.visibility = 'hidden';
  tempSelect.style.position = 'fixed';

  // Copy relevant styles that affect width
  const styles = window.getComputedStyle(select);
  tempSelect.style.fontSize = styles.fontSize;
  tempSelect.style.fontFamily = styles.fontFamily;
  tempSelect.style.fontWeight = styles.fontWeight;
  tempSelect.style.padding = styles.padding;

  tempSelect.appendChild(tempOption);

  // Add to DOM to calculate width
  select.parentNode?.appendChild(tempSelect);

  // Set width
  select.style.width = `${tempSelect.clientWidth}px`;

  // Clean up
  tempSelect.remove();
}

// Calculates the start position for the next block in the sequence
export function calcNextBlockStartPosition(currBlock: Block): Coordinates {
  const nextBlockStartPosition = {
    x: currBlock.coords.x,
    y: currBlock.coords.y,
  };

  // Base height for every block
  nextBlockStartPosition.y += 34.8; // TODO: Remove magic numbers

  // Calculate max nesting depth and multiply by 14
  const maxDepth = getMaxDepth(currBlock);
  if (maxDepth > 0) {
    nextBlockStartPosition.y += maxDepth * 14;
  }

  return nextBlockStartPosition;
}

// Recursive function that finds the max depth of a tree
function getMaxDepth(block: Block): number {
  if (block.children.length === 0) {
    return 0;
  }

  // Find the maximum depth among children
  let maxDepth = 0;
  for (const child of block.children) {
    const childDepth = getMaxDepth(child);
    maxDepth = Math.max(maxDepth, childDepth);
  }

  return maxDepth + 1;
}

export function findRoot(canvas: Block[], currBlock: Block) {
  if (!currBlock.parentId) {
    return currBlock;
  }

  const parentBlock = findBlockById(canvas, currBlock.parentId);
  if (!parentBlock) {
    console.error(
      `Error in findRoot: parent block with id = ${currBlock.parentId} not found in canvas`
    );
    return currBlock;
  }

  return findRoot(canvas, parentBlock);
}

export function updateSequencePositions(
  blocks: Block[],
  startBlock: Block
): Block[] {
  let updatedBlocks = [...blocks];
  let currBlock = startBlock;
  let nextBlockId = currBlock.nextBlockId;

  while (nextBlockId) {
    const nextBlock = findBlockById(updatedBlocks, nextBlockId);
    if (!nextBlock) {
      break;
    }

    const updatedNextBlock = {
      ...nextBlock,
      coords: calcNextBlockStartPosition(currBlock),
    };

    updatedBlocks = updateBlockById(
      updatedBlocks,
      nextBlockId,
      updatedNextBlock
    );

    // Move to the next iteration
    currBlock = updatedNextBlock;
    nextBlockId = currBlock.nextBlockId;
  }

  return updatedBlocks;
}

/**
 * Returns a set with the ids of all blocks connected to the given block in the
 * canvas.
 * */
export function getConnectedBlockIds(canvas: Block[], id: string): Set<string> {
  const idSet = new Set<string>();
  const block = findBlockById(canvas, id);
  if (!block) {
    return idSet;
  }

  // Find the root of the tree containing the block
  const root = findRoot(canvas, block);
  // Add all block IDs in the tree rooted at root
  addTreeIdsRecursive(root, idSet);
  // Traverse block chain
  traverseSequence(canvas, root, idSet);
  return idSet;
}

/**
 * Helper function for getConnectedBlockIds.
 * Recursively adds all block IDs in a tree to the set
 */
function addTreeIdsRecursive(block: Block, idSet: Set<string>): void {
  // Add current block ID
  idSet.add(block.id);
  // Recursively process all children
  for (const child of block.children) {
    addTreeIdsRecursive(child, idSet);
  }
}

/**
 * Helper function for getConnectedBlockIds.
 * Traverses forward through the nextBlockId chain and adds all connected blocks
 */
function traverseSequence(
  canvas: Block[],
  startBlock: Block,
  idSet: Set<string>
): void {
  // Traverse forward through nextBlockId chain
  let currBlock = startBlock;
  while (currBlock && currBlock.nextBlockId) {
    const nextBlock = findBlockById(canvas, currBlock.nextBlockId);
    if (!nextBlock || idSet.has(nextBlock.id)) {
      break;
    }
    // Add the next block and all its children
    addTreeIdsRecursive(nextBlock, idSet);
    // Continue traversing forward
    currBlock = nextBlock;
  }
}

export function drawConnectedBlocks(
  canvas: Block[],
  rootBlock: Block
): Block[] {
  // Copy forest
  let newCanvas = [...canvas];
  let currentBlock = rootBlock;
  while (currentBlock && currentBlock.nextBlockId) {
    const nextBlock = findBlockById(newCanvas, currentBlock.nextBlockId);
    if (!nextBlock) break;

    // Calculate the correct position based on the current block
    const nextPosition = calcNextBlockStartPosition(currentBlock);

    // Update the next block with the correctly calculated position
    const updatedNextBlock = {
      ...nextBlock,
      coords: nextPosition,
    };

    newCanvas = updateBlockById(newCanvas, nextBlock.id, updatedNextBlock);
    currentBlock = updatedNextBlock;
  }

  return newCanvas;
}
