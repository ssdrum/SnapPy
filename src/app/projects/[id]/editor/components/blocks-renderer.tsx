import React from 'react';
import { Block, BlockType, VariableBlock } from '../blocks/types';
import Empty from '../blocks/empty';
import Variable from '../blocks/variable';
import { calcNextBlockStartPosition } from '../utils/utils';

interface BlocksRendererProps {
  blocks: Block[];
}

export default function BlocksRenderer({ blocks }: BlocksRendererProps) {
  // Find the start nodes
  const startNodes = findStartNodes(blocks);

  // Render the start nodes
  return (
    <>
      {startNodes.map((block) => (
        <React.Fragment key={block.id}>
          {renderBlockSequence(block, blocks)}
        </React.Fragment>
      ))}
    </>
  );
}

const renderBlockSequence = (
  currBlock: Block,
  allBlocks: Block[]
): React.ReactNode => {
  const renderedBlock = renderBlock(currBlock);

  if (!currBlock.nextBlockId) {
    return renderedBlock;
  }

  const nextBlock = allBlocks.find(
    (block) => block.id === currBlock.nextBlockId
  );

  if (!nextBlock) {
    console.warn(`Next block with id ${currBlock.nextBlockId} not found`);
    return renderedBlock;
  }

  return (
    <>
      {renderedBlock}
      {renderBlockSequence(
        {
          ...nextBlock,
          coords: calcNextBlockStartPosition(currBlock),
        },
        allBlocks
      )}
    </>
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
      console.error(`Invalid block type in BlockRenderer: ${type}`);
      return null;
  }
};

// Find all blocks that don't have a previous block (these are starting blocks)
const findStartNodes = (blocks: Block[]): Block[] => {
  // Find blocks with no previous block
  return blocks.filter((block) => block.prevBlockId === null);
};
