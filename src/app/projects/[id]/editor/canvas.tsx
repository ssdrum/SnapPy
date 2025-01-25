import { Block } from '@/app/blocks/types';
import BlocksRenderer from '@/app/blocks/blocks-renderer';
import { useDroppable } from '@dnd-kit/core';
import { Dispatch, SetStateAction } from 'react';

interface CanvasProps {
  blocks: Block[];
  setCanvasBlocks: Dispatch<SetStateAction<Block[]>>; // Function to update canvas blocks
}

export default function Canvas({ blocks, setCanvasBlocks }: CanvasProps) {
  const { setNodeRef } = useDroppable({ id: 'canvas' });

  const style: React.CSSProperties = {
    flex: '1',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <BlocksRenderer
        blocks={blocks}
        setCanvasBlocks={setCanvasBlocks}
        setWorkbenchBlocks={null}
      />
    </div>
  );
}
