import { useDraggable } from '@dnd-kit/core';
import { Block } from '../blocks/types';
import renderBlock from './render-block';
import { CSS } from '@dnd-kit/utilities';

interface WorkbenchBlocksRendererProps {
  workbench: Block[];
}

export default function WorkbenchBlocksRenderer({
  workbench,
}: WorkbenchBlocksRendererProps) {
  return (
    <>
      {workbench.map((block) => (
        <WorkbenchBlock key={block.id} block={block} />
      ))}
    </>
  );
}

interface WorkbenchBlockProps {
  block: Block;
}

function WorkbenchBlock({ block }: WorkbenchBlockProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: block.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
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
