import Empty from '../blocks/empty';
import { Block } from '../blocks/types';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface BlocksRendererProps {
  blocks: Block[];
}

function DraggableBlock({ block }: { block: Block }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: block.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    position: block.isWorkbenchBlock ? 'static' : 'absolute',
  };

  return (
    <div
      key={block.id}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {renderBlock(block)}
    </div>
  );
}

export default function BlocksRenderer({ blocks }: BlocksRendererProps) {
  const startBlocks = blocks.filter((block) => block.prevId === null);

  return (
    <>
      {startBlocks.map((block) => (
        <DraggableBlock key={block.id} block={block} />
      ))}
    </>
  );
}

const renderBlock = (block: Block) => {
  switch (block.type) {
    default:
      return <Empty key={block.id} />;
  }
};

//import React from 'react';
//import { Block, BlockType } from '../blocks/types';
//import Empty from '../blocks/empty';
//import Variable from '../blocks/variable';
//import While from '../blocks/while';
//import { findBlockById } from '../utils/utils';
//
//interface BlocksRendererProps {
//  blocks: Block[];
//}
//
//export default function BlocksRenderer({ blocks }: BlocksRendererProps) {
//  // Find the start nodes
//  const startNodes = blocks.filter((block) => block.prevId === null);
//
//  // Render the start nodes
//  return (
//    <>
//      {startNodes.map((block) => (
//        <React.Fragment key={block.id}>
//          {renderBlockSequence(block, blocks)}
//        </React.Fragment>
//      ))}
//    </>
//  );
//}
//
//export const renderBlockSequence = (
//  currBlock: Block,
//  canvas: Block[]
//): React.ReactNode => {
//  const renderedBlock = renderBlock(currBlock);
//
//  if (!currBlock.nextId) return renderedBlock;
//
//  const nextBlock = findBlockById(canvas, currBlock.nextId);
//
//  if (!nextBlock) {
//    console.warn(`Next block with id ${currBlock.nextId} not found`);
//    return renderedBlock;
//  }
//
//  return (
//    <>
//      {renderedBlock}
//      {renderBlockSequence(nextBlock, canvas)}
//    </>
//  );
//};
//
//// Helper function to render a single block based on its type
//const renderBlock = (block: Block) => {
//  const {
//    id,
//    type,
//    coords,
//    isWorkbenchBlock,
//    stackOptions,
//    state,
//    parentId,
//    children,
//  } = block;
//
//  switch (type) {
//    case BlockType.Empty:
//      return (
//        <Empty
//          key={id}
//          id={id}
//          top={coords.y}
//          left={coords.x}
//          blockType={type}
//          isWorkbenchBlock={isWorkbenchBlock}
//          stackOptions={stackOptions}
//          blockState={state}
//          parentId={parentId}
//        >
//          {children}
//        </Empty>
//      );
//    case BlockType.Variable:
//      const { selected } = block;
//      return (
//        <Variable
//          key={id}
//          id={id}
//          top={coords.y}
//          left={coords.x}
//          blockType={type}
//          isWorkbenchBlock={isWorkbenchBlock}
//          stackOptions={stackOptions}
//          blockState={state}
//          parentId={parentId}
//          selected={selected}
//        >
//          {children}
//        </Variable>
//      );
//    case BlockType.While: {
//      return (
//        <While
//          key={id}
//          id={id}
//          top={coords.y}
//          left={coords.x}
//          blockType={type}
//          isWorkbenchBlock={isWorkbenchBlock}
//          stackOptions={stackOptions}
//          blockState={state}
//          parentId={parentId}
//        >
//          {children}
//        </While>
//      );
//    }
//    default:
//      console.error(`Invalid block type in BlockRenderer: ${type}`);
//      return null;
//  }
//};
