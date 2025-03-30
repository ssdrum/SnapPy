import React from 'react';
import { Block, BlockType, VariableBlock } from '../blocks/types';
import Empty from '../blocks/empty';
import Variable from '../blocks/variable';

interface BlocksRendererProps {
  blocks: Block[];
}

export default function BlocksRenderer({ blocks }: BlocksRendererProps) {
  // Find the start nodes
  const startNodes = findStartNodes(blocks);
  // Render the start nodes
  return <>{startNodes.map((block) => renderBlockSequence(block, blocks))}</>;
}

const renderBlockSequence = (currBlock: Block, allBlocks: Block[]) => {
  const renderedBlock = renderBlock(currBlock);

  // Temporarily hardcoded
  const nextBlockStartPosition = {
    x: currBlock.coords.x,
    y: currBlock.coords.y + 50,
  };

  return (
    <div>
      {renderedBlock}
      {/* Render the next block in the sequence if it exists */}
      {currBlock.nextBlockId &&
        renderBlockSequence(
          {
            ...allBlocks.find((block) => block.id === currBlock.nextBlockId)!,
            coords: nextBlockStartPosition, // Pass the hardcoded position to the next block
          },
          allBlocks
        )}
    </div>
  );
};

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
  // Find blocks with no previous block
  return blocks.filter((block) => block.prevBlockId === null);
};
