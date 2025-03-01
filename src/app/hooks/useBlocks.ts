import { useState } from 'react';
import { Block, BlockTypes } from '@/app/blocks/types';
import { JsonValue } from '@prisma/client/runtime/library';
import { Coordinates } from '@dnd-kit/core/dist/types';

export default function useBlocks(data: JsonValue) {
  const [workbenchBlocks, setWorkbenchBlocks] = useState<Block[]>([
    // Blocks in the workbench
    {
      id: -1,
      type: BlockTypes.VARIABLE,
      coords: { x: 0, y: 0 },
      isWorkbenchBlock: true,
      name: '',
      value: '',
    },
    {
      id: -2,
      type: BlockTypes.EMPTY,
      coords: { x: 0, y: 0 },
      isWorkbenchBlock: true,
    },
  ]);

  const [canvasBlocks, setCanvasBlocks] = useState<Block[]>( // Blocks in the canvas
    parseBlocksFromDB(data)
  );

  const [highestBlockId, setHighestBlockId] = useState<number>( // Id variable to initialise new blocks
    findMaxId(canvasBlocks)
  );

  // Returns a unique id for a new block
  const getNewBlockId = (): number => {
    const id = highestBlockId + 1;
    setHighestBlockId(id);
    return id;
  };

  const createCanvasBlock = (
    originalBlockId: number,
    delta: Coordinates
  ): void => {
    // Find the original block from workbench
    const block =
      workbenchBlocks[findBlockIndex(workbenchBlocks, originalBlockId)];

    if (!block) {
      console.warn(
        `Block with ID ${originalBlockId} not found in workbench blocks`
      );
      return;
    }

    // Create a new block with updated properties
    const newBlock = {
      ...block,
      id: getNewBlockId(),
      coords: {
        x: block.coords.x + delta.x,
        y: block.coords.y + delta.y,
      },
      isWorkbenchBlock: false,
    };

    setCanvasBlocks((prevBlocks) => [...prevBlocks, newBlock]);
  };

  const moveCanvasBlock = (blockId: number, delta: Coordinates): void => {
    setCanvasBlocks((prevBlocks) => {
      const index = findBlockIndex(prevBlocks, blockId);

      if (index === -1) {
        console.warn(`Block with ID ${blockId} not found in canvas blocks`);
        return prevBlocks;
      }

      // Create a new array with the moved block
      const newBlocks = [...prevBlocks];
      const prevCoords = { ...newBlocks[index].coords };

      newBlocks[index] = {
        ...newBlocks[index],
        coords: {
          x: prevCoords.x + delta.x,
          y: prevCoords.y + delta.y,
        },
      };

      return newBlocks;
    });
  };

  const deleteCanvasBlock = (blockId: number) => {
    setCanvasBlocks(canvasBlocks.filter((b) => b.id !== blockId));
  };

  const updateWorkbenchBlockFieldById = <T extends Block>(
    blockId: number,
    updates: Partial<T>
  ): void => {
    setWorkbenchBlocks((prevBlocks) => {
      const index = findBlockIndex(prevBlocks, blockId);

      if (index === -1) {
        return prevBlocks; // Return unchanged state if block not found
      }

      // Create a new array with the updated block
      const newBlocks = [...prevBlocks];
      const existingBlock = newBlocks[index];
      newBlocks[index] = {
        ...existingBlock,
        ...updates,
      } as T;

      return newBlocks;
    });
  };

  const updateCanvasBlockFieldById = <T extends Block>(
    blockId: number,
    updates: Partial<T>
  ): void => {
    setCanvasBlocks((prevBlocks) => {
      const index = findBlockIndex(prevBlocks, blockId);

      if (index === -1) {
        return prevBlocks; // Return unchanged state if block not found
      }

      // Create a new array with the updated block
      const newBlocks = [...prevBlocks];
      const existingBlock = newBlocks[index];
      newBlocks[index] = {
        ...existingBlock,
        ...updates,
      } as T;

      return newBlocks;
    });
  };

  return {
    workbenchBlocks,
    setWorkbenchBlocks,
    canvasBlocks,
    getNewBlockId,
    createCanvasBlock,
    moveCanvasBlock,
    deleteCanvasBlock,
    updateCanvasBlockFieldById,
    updateWorkbenchBlockFieldById,
  };
}

// Find maximum id between all blocks
function findMaxId(blocks: Block[]): number {
  if (!blocks) {
    return 0;
  }

  let maxId = 0;
  blocks.forEach((block) => {
    maxId = Math.max(block.id, maxId);
  });

  return maxId;
}

// Parses JSON data to an array of blocks
function parseBlocksFromDB(data: JsonValue): Block[] {
  if (!data) {
    console.error('No data returned from DB');
    return [];
  }

  try {
    return JSON.parse(JSON.stringify(data)) as Block[]; // Parse project data retreived from DB into blocks array
  } catch (error) {
    console.error('Error parsing canvasBlocks from data:', error);
    return [];
  }
}

const findBlockIndex = (blocks: Block[], blockId: number) => {
  return blocks.findIndex((b) => b.id === blockId);
};
