import { Block } from './types';
import React, { Dispatch, SetStateAction } from 'react';

/**
 * Updates the position of a block in the workbench based on its current position
 * relative to its parent container. This function is necessary because React
 * DnD Kit requires the block's coordinates to be exact and relative to
 * its parent, and these coordinates need to be calculated at render time.
 *
 * @param localRef - A React ref object pointing to the HTML element of the block.
 * @param setWorkbenchBlocks - A state updater function to update the workbench blocks.
 * @param id - The identifier of the block to be updated.
 */
export function updateWorkbenchBlockCoords(
  localRef: React.RefObject<HTMLDivElement | null>,
  setWorkbenchBlocks: Dispatch<SetStateAction<Block[]>> | null,
  id: number
) {
  if (!localRef) {
    console.error('updateBlockPosition: localRef is null or undefined.');
    return;
  }

  if (!setWorkbenchBlocks) {
    console.error(
      'updateBlockPosition: setWorkbenchBlocks is null or undefined.'
    );
    return;
  }

  const rect = localRef.current?.getBoundingClientRect(); // Get block's bounding rectangle
  if (!rect) {
    console.error('updateBlockPosition: rect is undefined.');
    return;
  }

  const parentRect = localRef.current?.offsetParent?.getBoundingClientRect(); // Get block's parent's bounding rectangle
  if (!parentRect) {
    console.error('updateBlockPosition: parentRect is undefined.');
    return;
  }

  const offsetX = rect.left - parentRect.left;
  const offsetY = rect.top - parentRect.top;

  // Update x and y coordinates of the block in state
  setWorkbenchBlocks((prevBlocks) =>
    prevBlocks.map((block) =>
      block.id === id
        ? {
            ...block,
            coords: { x: offsetX, y: offsetY },
          }
        : block
    )
  );
}
