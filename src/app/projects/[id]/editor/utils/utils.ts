import { Coordinates } from '@dnd-kit/core/dist/types';
import { Block, BlockType } from '../blocks/types';

/**
 * Traverses the canvas recursively and returns the block with the provided id
 * if found. Returns null if not found.
 * Note: A canvas is a set of disjoint trees.
 */
export function findBlockById(canvas: Block[], id: string): Block | null {
  for (const block of canvas) {
    if (block.id === id) return block;

    // Skip if the block has no children
    if (!block.children) continue;

    // Use Object.entries() instead of for...in to avoid type issues
    const entries = Object.entries(block.children);
    for (const [_, children] of entries) {
      if (children.length > 0) {
        const found = findBlockById(children, id);
        if (found) {
          return found;
        }
      }
    }
  }

  return null;
}

/**
 * Traverses the canvas recursively and updates the block with the provided id
 * with the updatedBlock.
 */
export function updateBlockById(
  canvas: Block[],
  id: string,
  updatedBlock: Block
): Block[] {
  // Create a new array to avoid mutating the original
  return canvas.map((block) => {
    // If this is the block to update, return the updated block
    if (block.id === id) return updatedBlock;

    // If no children, return the block as is
    if (!block.children) return block;

    // Create a new block with the same properties
    const newBlock = { ...block } as Block; // TS compiler is inferring that we don't have children here so we need to cast to a full Block again

    // Process children
    newBlock.children = processBlockChildren(
      block,
      updateBlockById,
      id,
      updatedBlock
    );

    return newBlock;
  });
}

/**
 * Removes the block with the provided id from the canvas.
 */
export function removeBlockById(blocks: Block[], id: string): Block[] {
  // Filter out the block with the given id at this level
  return blocks
    .filter((block) => block.id !== id)
    .map((block) => {
      // If no children, return the block as is
      if (!block.children) return block;

      // Create a new block with the same properties
      const newBlock = { ...block } as Block; // TS compiler is inferring that we don't have children here so we need to cast to a full Block again

      // Process children
      newBlock.children = processBlockChildren(block, removeBlockById, id);

      return newBlock;
    });
}

/**
 * Processes children of a block based on its type by applying the provided
 * operation function to each child array.
 */
function processBlockChildren(
  block: Block,
  operation: (blocks: Block[], ...args: any[]) => Block[],
  ...args: any[]
) {
  switch (block.type) {
    case BlockType.Variable:
      return {
        expression: operation(block.children.expression, ...args),
      };
    case BlockType.While:
      return {
        condition: operation(block.children.condition, ...args),
        body: operation(block.children.body, ...args),
      };
    case BlockType.Empty:
      return null;
  }
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
