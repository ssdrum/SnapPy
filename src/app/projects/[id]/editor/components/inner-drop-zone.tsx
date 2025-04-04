import { useDroppable } from '@dnd-kit/core';
import classes from '../blocks/blocks.module.css';
import { Block } from '../blocks/types';
import BlocksRenderer from './blocks-renderer';
import { useBlocks } from '../contexts/blocks-context';

interface InnerDropZoneProps {
  id: string;
  children: Block[];
  enabled: boolean;
  enableStacking: boolean;
}

export default function InnerDropZone({
  id,
  children,
  enabled,
  enableStacking,
}: InnerDropZoneProps) {
  const { state } = useBlocks();
  const { setNodeRef } = useDroppable({ id });

  const active = children.length === 0;
  const [_, blockId] = id.split('_');
  const highlighted = state.highlightedDropZoneId === blockId;

  return (
    <div
      ref={enabled && active ? setNodeRef : undefined} // Only make droppable if there's no children
      className={classes.innerDropZone}
      style={{
        backgroundColor: highlighted ? '#FFD54F' : undefined,
      }}
    >
      {children && <BlocksRenderer blocks={children} />}
    </div>
  );
}
