import Variable from '@/app/blocks/variable';
import { VariableBlock } from './editor';
import { useDroppable } from '@dnd-kit/core';
import { Dispatch, SetStateAction } from 'react';

interface CanvasProps {
  blocks: VariableBlock[];
  setCanvasBlocks: Dispatch<SetStateAction<VariableBlock[]>>;
}

export default function Canvas({ blocks, setCanvasBlocks }: CanvasProps) {
  const { setNodeRef } = useDroppable({ id: 'canvas' });

  const style: React.CSSProperties = {
    flex: '1',
  };

  return (
    <div ref={setNodeRef} style={style}>
      {blocks.map((block) => (
        <Variable
          key={block.id}
          id={block.id}
          top={block.coords.y}
          left={block.coords.x}
          zIndex={0}
          setCanvasBlocks={setCanvasBlocks}
        />
      ))}
    </div>
  );
}
