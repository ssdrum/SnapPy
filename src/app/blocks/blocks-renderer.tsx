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
}

export default function BlocksRenderer({
  blocks,
  setCanvasBlocks,
}: BlocksRendererProps) {
  return (
    <>
      {blocks.map((block) => {
        const { id, type, coords, isWorkbenchBlock } = block;

        switch (type) {
          case BlockTypes.VARIABLE:
            return (
              <Variable
                id={id}
                top={coords.y}
                left={coords.x}
                isWorkbenchBlock={isWorkbenchBlock}
                setCanvasBlocks={setCanvasBlocks}
              />
            );
          case BlockTypes.EMPTY:
            return (
              <Empty
                id={id}
                top={coords.y}
                left={coords.x}
                isWorkbenchBlock={isWorkbenchBlock}
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
