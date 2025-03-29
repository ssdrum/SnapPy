import { Block } from '../blocks/types';

/**
 * Returns true if block with id = id is in blocks array
 */
export const isBlockInArray = (blocks: Block[], id: string) => {
  return blocks.some((block) => block.id === id);
};

/**
 * Finds the parent ID of a block with the given ID by traversing the block structure
 */
export const findParentId = (blocks: Block[], id: string): string | null => {
  // Direct check for the block in the current level
  const block = blocks.find((block) => block.id === id);
  if (block) {
    return block.parentId;
  }

  // Recursively search through children of each block
  for (const block of blocks) {
    // Check if any child has the target ID
    for (const childBlock of block.children) {
      if (childBlock.id === id) {
        return block.id;
      }
    }

    // Recursively search deeper in the children
    const foundInChildren = findParentId(block.children, id);
    if (foundInChildren !== null) {
      return foundInChildren;
    }
  }

  return null;
};

/**
 * Traverses the forest recursively and returns the block with the provided id
 * if found. Returns null if not found.
 */
export const findBlockById = (forest: Block[], id: string): Block | null => {
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
};

/**
 * Resizes a select element to match the width of its selected option
 * @param selectRef React ref to the select element
 * source: https://stackoverflow.com/questions/28308103/adjust-width-of-select-element-according-to-selected-options-width
 */
export const resizeSelect = (
  selectRef: React.RefObject<HTMLSelectElement | null>
): void => {
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
};
