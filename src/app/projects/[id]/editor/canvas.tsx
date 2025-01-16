import Variable from '@/app/blocks/variable';
import { VariableBlock } from './editor';
import { useDroppable } from '@dnd-kit/core';

export default function Canvas({ blocks }: { blocks: VariableBlock[] }) {
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
        />
      ))}
    </div>
  );
}
