import { useDroppable } from '@dnd-kit/core';
import classes from '../blocks/blocks.module.css';
import { Block } from '../blocks/types';
import BlocksRenderer from './blocks-renderer';
import { useBlocks } from '../contexts/blocks-context';

interface InnerDropZoneProps {
  blockId: string;
  children: Block[];
  enabled: boolean;
}

export default function InnerDropZone({
  blockId,
  children,
  enabled,
}: InnerDropZoneProps) {
  const { state } = useBlocks();
  const { setNodeRef } = useDroppable({
    id: `innerdrop_${blockId}`,
  });
  const active = children.length === 0;
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
