import { RefObject } from 'react';
import { Block, BlockType, LogicalOperator } from '../blocks/types';

/**
 * Traverses the canvas recursively and returns the block with the provided id
 * if found. Returns null if not found.
 * Note: A canvas is a set of disjoint trees.
 */
export function findBlockById(id: string, canvas: Block[]): Block | null {
  for (const block of canvas) {
    if (block.id === id) return block;

    // Skip if the block has no children
    if (!block.children) continue;

    // Use Object.entries() instead of for...in to avoid type issues
    const entries = Object.entries(block.children);
    for (const [_, children] of entries) {
      if (children.length > 0) {
        const found = findBlockById(id, children);
        if (found) return found;
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
    case BlockType.Print:
      return {
        expression: operation(block.children.expression, ...args),
      };
    case BlockType.While:
    case BlockType.If:
      return {
        condition: operation(block.children.condition, ...args),
        body: operation(block.children.body, ...args),
      };
    case BlockType.Math:
    case BlockType.Comparison:
      return {
        left: operation(block.children.left, ...args),
        right: operation(block.children.right, ...args),
      };
    case BlockType.Logical:
      // Check if it's a binary or unary logical operator
      if ('left' in block.children && 'right' in block.children) {
        // Binary operator (AND, OR)
        return {
          left: operation(block.children.left, ...args),
          right: operation(block.children.right, ...args),
        };
      } else if ('operand' in block.children) {
        // Unary operator (NOT)
        return {
          operand: operation(block.children.operand, ...args),
        };
      }
      return null;
    case BlockType.IfElse:
      return {
        condition: operation(block.children.condition, ...args),
        ifBody: operation(block.children.ifBody, ...args),
        elseBody: operation(block.children.elseBody, ...args),
      };
    case BlockType.For:
      return {
        expression: operation(block.children.expression, ...args),
        body: operation(block.children.body, ...args),
      };
    case BlockType.ProgramStart:
    case BlockType.Number:
    case BlockType.String:
    case BlockType.Boolean:
    case BlockType.VariableValue:
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

  const block = findBlockById(id, blocks);
  if (!block) {
    console.error(
      `Error in action: ${actionName}. Block with id = ${id} not found`
    );

    return null;
  }

  return block;
}

export function findRoot(canvas: Block[], currBlock: Block) {
  if (!currBlock.parentId) return currBlock;

  const parentBlock = findBlockById(currBlock.parentId, canvas);
  if (!parentBlock) {
    console.error(
      `Error in findRoot: parent block with id = ${currBlock.parentId} not found in canvas`
    );

    return currBlock;
  }

  return findRoot(canvas, parentBlock);
}

/**
 * Returns a set with the ids of all blocks connected to the given block in the
 * canvas.
 */
export function getConnectedBlockIds(canvas: Block[], id: string): Set<string> {
  const idSet = new Set<string>();

  const block = findBlockById(id, canvas);
  if (!block) return idSet;

  // Find the root of the tree containing the block
  const root = findRoot(canvas, block);

  // Add all block IDs in the tree rooted at root
  addTreeIdsRecursive(root, idSet, canvas);

  // Traverse block chain
  traverseSequence(canvas, root, idSet);

  return idSet;
}

/**
 * Helper function for getConnectedBlockIds.
 * Recursively adds all block IDs in a tree to the set
 */
function addTreeIdsRecursive(
  block: Block,
  idSet: Set<string>,
  canvas: Block[]
): void {
  // Add current block ID
  idSet.add(block.id);

  // If no children, return early
  if (!block.children) return;

  // Helper operation to add IDs from a block array
  function addIdsOperation(blocks: Block[]): Block[] {
    for (const child of blocks) {
      addTreeIdsRecursive(child, idSet, canvas);
    }

    return blocks;
  }

  // Process all children based on block type using the existing helper function
  processBlockChildren(block, addIdsOperation);
}

/**
 * Helper function for getConnectedBlockIds.
 * Traverses forward through the nextId chain and adds all connected blocks
 */
function traverseSequence(
  canvas: Block[],
  startBlock: Block,
  idSet: Set<string>
): void {
  // Traverse forward through nextId chain
  let currBlock = startBlock;
  while (currBlock && currBlock.nextId) {
    const nextBlock = findBlockById(currBlock.nextId, canvas);
    if (!nextBlock || idSet.has(nextBlock.id)) break;

    // Add the next block and all its children
    addTreeIdsRecursive(nextBlock, idSet, canvas);

    // Continue traversing forward
    currBlock = nextBlock;
  }
}

/**
 * Helper function to remove multiple blocks from canvas
 */
export function removeBlocks(blocksToRemove: Block[], canvas: Block[]) {
  let newCanvas = [...canvas];

  for (const block of blocksToRemove) {
    newCanvas = removeBlockById(newCanvas, block.id);
  }

  return newCanvas;
}

/**
 * Returns the sequence of blocks that starts from startBlock
 */
export function getBlocksSequence(startBlock: Block, canvas: Block[]) {
  const sequence: Block[] = [{ ...startBlock }];

  let nextId = startBlock.nextId;
  while (nextId) {
    let curr = findBlockById(nextId, canvas);
    if (!curr) break;

    sequence.push({ ...curr });
    nextId = curr.nextId;
  }

  return sequence;
}

/**
 * Sorts a sequence of blocks. Finds the block with no prevId, then builds the
 * sequence starting from it.
 */
export function sortBlocks(blocks: Block[]) {
  const startBlock = blocks.find((block) => block.prevId === null);
  if (!startBlock) {
    console.error(
      `Error in sortBlocks. Start block not found in blocks = ${blocks}`
    );
    return [];
  }

  return getBlocksSequence(startBlock, blocks);
}

/**
 * Resizes the input to match the text width
 */
export function resizeInput(
  inputRef: RefObject<HTMLInputElement | null>,
  hiddenRef: RefObject<HTMLSpanElement | null>
) {
  if (inputRef.current && hiddenRef.current) {
    // Update the hidden span's text to match the input
    hiddenRef.current.textContent = inputRef.current.value || '0';

    // Get the width of the hidden span (plus some padding)
    const width = hiddenRef.current.offsetWidth;

    // Set the input width (with minimum width)
    inputRef.current.style.width = `${Math.max(35, width + 25)}px`;
  }
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

export function isLogicalBinaryOperator(op: LogicalOperator) {
  return op === LogicalOperator.And || op === LogicalOperator.Or;
}
