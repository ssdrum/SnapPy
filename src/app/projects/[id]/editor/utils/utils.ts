import { Coordinates } from '@dnd-kit/core/dist/types';
import { Block } from '../blocks/types';

/**
 * Traverses the forest recursively and returns the block with the provided id
 * if found. Returns null if not found.
 * Note: A forest is a set of disjoint trees.
 * TODO: Add unit tests
 */
export function findBlockById(forest: Block[], id: string): Block | null {
  for (const root of forest) {
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
 * Traverses the forest recursively and updates the block with the provided id
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
 * Removes the block with the provided id from the forest.
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

export function findRoot(forest: Block[], currBlock: Block) {
  if (!currBlock.parentId) {
    return currBlock;
  }

  const parentBlock = findBlockById(forest, currBlock.parentId);
  if (!parentBlock) {
    console.error(
      `Error in findRoot: parent block with id = ${currBlock.parentId} not found in forest`
    );
    return currBlock;
  }

  return findRoot(forest, parentBlock);
}

export function updateSequencePositions(
  blocks: Block[],
  startBlock: Block
): Block[] {
  let updatedBlocks = [...blocks];
  let currentBlock = startBlock;
  let nextBlockId = currentBlock.nextBlockId;

  while (nextBlockId) {
    const nextBlock = findBlockById(updatedBlocks, nextBlockId);
    if (!nextBlock) {
      break;
    }

    const updatedNextBlock = {
      ...nextBlock,
      coords: calcNextBlockStartPosition(currentBlock),
    };

    updatedBlocks = updateBlockById(
      updatedBlocks,
      nextBlockId,
      updatedNextBlock
    );

    // Move to the next iteration
    currentBlock = updatedNextBlock;
    nextBlockId = currentBlock.nextBlockId;
  }

  return updatedBlocks;
}
