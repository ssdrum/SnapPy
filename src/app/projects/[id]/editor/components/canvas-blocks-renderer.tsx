import { Block } from '../blocks/types';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { getBlocksSequence } from '../utils/utils';
import renderBlock from './render-block';

interface CanvasBlocksRendererProps {
  canvas: Block[];
}

export default function CanvasBlocksRenderer({
  canvas,
}: CanvasBlocksRendererProps) {
  const startBlocks = canvas.filter((block) => block.prevId === null);

  return (
    <>
      {startBlocks.map((block) => {
        return (
          <SequenceWrapper
            key={block.id}
            sequence={getBlocksSequence(block, canvas)}
          />
        );
      })}
    </>
  );
}

interface SequenceWrapperProps {
  sequence: Block[];
}

function SequenceWrapper({ sequence }: SequenceWrapperProps) {
  const startBlock = sequence[0];
  const { id, coords } = startBlock;

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    position: 'absolute',
    top: coords.y,
    left: coords.x,
  };

  return (
    <div
      key={`sequence_${id}`} // id of a sequence is always 'sequence_' + start block id
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {sequence.map((block) => renderBlock(block))}
    </div>
  );
}

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
