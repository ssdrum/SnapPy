import { OuterDropzonePosition } from '../blocks/types';
import classes from '../blocks/blocks.module.css';
import { useDndContext, useDroppable } from '@dnd-kit/core';
import { useBlocks } from '../contexts/blocks-context';

interface OuterDropZoneProps {
  blockId: string;
  position: OuterDropzonePosition;
}

export default function OuterDropZone({
  blockId,
  position,
}: OuterDropZoneProps) {
  const { state } = useBlocks();

  const { setNodeRef, isOver } = useDroppable({
    id: `stack_${position}_${blockId}`,
  });

  const { active } = useDndContext();

  const isVisible =
    Boolean(active) && isOver && !state.draggedGroupBlockIds?.has(blockId);

  return (
    <div
      ref={setNodeRef}
      className={classes.outerDropzone}
      style={{
        backgroundColor: '#FFD54F',
        position: isVisible ? 'static' : 'absolute',
        [position === OuterDropzonePosition.Top ? 'top' : 'bottom']: '-20px',
        opacity: isVisible ? 1 : 0,
        zIndex: state.draggedGroupBlockIds ? 10 : -1, // Push on top when dragging something
      }}
    />
  );
}
