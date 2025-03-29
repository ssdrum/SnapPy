import React from 'react';
import { Block, BlockType, VariableBlock } from '../blocks/types';
import Empty from '../blocks/empty';
import Variable from '../blocks/variable';

interface BlocksRendererProps {
  blocks: Block[];
}

// Helper function to render a single block based on its type
const renderBlock = (block: Block) => {
  const {
    id,
    type,
    coords,
    isWorkbenchBlock,
    stackOptions,
    state,
    parentId,
    children,
  } = block;

  switch (type) {
    case BlockType.Empty:
      return (
        <Empty
          key={id}
          id={id}
          top={coords.y}
          left={coords.x}
          blockType={type}
          isWorkbenchBlock={isWorkbenchBlock}
          stackOptions={stackOptions}
          state={state}
          parentId={parentId}
        >
          {children}
        </Empty>
      );
    case BlockType.Variable:
      const variableBlock = block as VariableBlock;
      const { selected } = variableBlock;
      return (
        <Variable
          key={id}
          id={id}
          top={coords.y}
          left={coords.x}
          blockType={type}
          isWorkbenchBlock={isWorkbenchBlock}
          stackOptions={stackOptions}
          state={state}
          parentId={parentId}
          selected={selected}
        >
          {children}
        </Variable>
      );
    default:
      console.error(`invalid block type in BlockRenderer: ${type}`);
      return null;
  }
};

// Find all blocks that don't have a previous block (these are starting blocks)
const findStartNodes = (blocks: Block[]): Block[] => {
  // Simply find blocks with no previous block
  return blocks.filter((block) => block.prevBlockId === null);
};

export default function BlocksRenderer({ blocks }: BlocksRendererProps) {
  // Find the start nodes
  const startNodes = findStartNodes(blocks);

  // For now, just render the start nodes
  return <>{startNodes.map((block) => renderBlock(block))}</>;
}
