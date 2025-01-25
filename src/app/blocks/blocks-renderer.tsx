/* 
  Renders a list of blocks
 */
import React, { Dispatch, SetStateAction } from 'react';
import { Block, BlockTypes } from './types';
import Variable from './variable';
import Empty from './empty';

interface BlocksRendererProps {
  blocks: Block[];
  setCanvasBlocks: Dispatch<SetStateAction<Block[]>> | null;
  setWorkbenchBlocks: Dispatch<SetStateAction<Block[]>> | null;
}

export default function BlocksRenderer({
  blocks,
  setCanvasBlocks,
  setWorkbenchBlocks,
}: BlocksRendererProps) {
  return (
    <>
      {blocks.map((block) => {
        const { id, type, coords, isWorkbenchBlock } = block;

        switch (type) {
          case BlockTypes.VARIABLE:
            return (
              <Variable
                key={id}
                id={id}
                top={coords.y}
                left={coords.x}
                isWorkbenchBlock={isWorkbenchBlock}
                setCanvasBlocks={setCanvasBlocks}
                setWorkbenchBlocks={setWorkbenchBlocks}
              />
            );
          case BlockTypes.EMPTY:
            return (
              <Empty
                key={id}
                id={id}
                top={coords.y}
                left={coords.x}
                isWorkbenchBlock={isWorkbenchBlock}
                setWorkbenchBlocks={setWorkbenchBlocks}
              />
            );
          default:
            console.log(`invalid block type in BlockRenderer: ${type}`);
            return null;
        }
      })}
    </>
  );
}
