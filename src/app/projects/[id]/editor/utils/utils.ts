import { Block } from '../blocks/types';

/**
 * Returns true if block with id = id is in blocks array
 */
export const isBlockInArray = (blocks: Block[], id: string) => {
  return blocks.some((block) => block.id === id);
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
