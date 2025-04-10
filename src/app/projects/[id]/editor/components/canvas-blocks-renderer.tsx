import { Block } from '../blocks/types';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { getBlocksSequence } from '../utils/utils';
import renderBlock from './render-block';
import { useBlocks } from '../contexts/blocks-context';

interface CanvasBlocksRendererProps {
  canvas: Block[];
  enableSequences: boolean;
}

export default function CanvasBlocksRenderer({
  canvas,
  enableSequences,
}: CanvasBlocksRendererProps) {
  const startBlocks = canvas.filter((block) => block.prevId === null);

  return (
    <>
      {startBlocks.map((block) => {
        return (
          <BlockGroupWrapper
            key={block.id}
            sequence={getBlocksSequence(block, canvas)}
            enableSequences={enableSequences}
          />
        );
      })}
    </>
  );
}

interface BlockGroupWrapperProps {
  sequence: Block[];
  enableSequences: boolean;
}

function BlockGroupWrapper({
  sequence,
  enableSequences,
}: BlockGroupWrapperProps) {
  const startBlock = sequence[0];
  const { id, coords } = startBlock;
  const { state } = useBlocks();

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    position: startBlock.parentId ? 'static' : 'absolute', // Use position static if nested, otherwise position absolutely
    top: coords.y,
    left: coords.x,
    zIndex: state.draggedGroupBlockIds?.has(id) ? 10 : 1,
  };

  return (
    <div
      key={`sequence_${id}`} // id of a sequence is always 'sequence_' + start block id
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {sequence.map((block) => renderBlock(block, enableSequences))}
    </div>
  );
}
