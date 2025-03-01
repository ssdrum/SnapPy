import React from 'react';
import { Block, BlockTypes, VariableBlock } from './types';
import Variable from './variable';
import Empty from './empty';

interface BlocksRendererProps {
  blocks: Block[];
}

export default function BlocksRenderer({ blocks }: BlocksRendererProps) {
  return (
    <>
      {blocks.map((block) => {
        const { id, type, coords, isWorkbenchBlock } = block;

        switch (type) {
          case BlockTypes.VARIABLE: {
            const { name, value } = block as VariableBlock;
            return (
              <Variable
                key={id}
                id={id}
                top={coords.y}
                left={coords.x}
                isWorkbenchBlock={isWorkbenchBlock}
                name={name}
                value={value}
              />
            );
          }
          case BlockTypes.EMPTY:
            return (
              <Empty
                key={id}
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
