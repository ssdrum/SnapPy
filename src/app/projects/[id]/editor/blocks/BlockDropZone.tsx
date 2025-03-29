import { useDroppable } from '@dnd-kit/core';
import classes from './blocks.module.css';

interface BlockDropZoneProps {
  blockId: string;
  position: 'top' | 'bottom';
}

export default function BlockDropZone({
  blockId,
  position,
}: BlockDropZoneProps) {
  const { setNodeRef } = useDroppable({
    id: `stack_${position}_${blockId}`,
  });

  return <div className={classes.blockDropZone} ref={setNodeRef} />;
}
