import { useDroppable, useDndContext } from '@dnd-kit/core';
import { useEffect } from 'react';
import { useBlocks } from '../contexts/blocks-context';
import { StackPosition } from '../blocks/types';

interface OuterDropZoneProps {
  blockId: string;
  position: StackPosition;
}

export default function OuterDropZone({
  blockId,
  position,
}: OuterDropZoneProps) {
  const { active } = useDndContext();
  const { displaySnapPreviewAction, hideSnapPreviewAction, state } =
    useBlocks();

  // Check if we're dragging the current block (to prevent self-dropping)
  const isDraggingSelf = active ? active.id === blockId : false;

  const { isOver, setNodeRef } = useDroppable({
    id: `stack_${position}_${blockId}`,
    disabled: isDraggingSelf,
  });

  // Only show indicator if something is dragging, it's not this block, and it's over the drop zone
  const show = Boolean(active) && !isDraggingSelf && isOver;

  useEffect(() => {
    if (show) {
      // Hide all previews before opening a new one
      for (const block of state.canvasBlocks) {
        hideSnapPreviewAction(block.id);
      }
      displaySnapPreviewAction(blockId, position);
    } else {
      hideSnapPreviewAction(blockId);
    }
  }, [show]);

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        [position === StackPosition.Top ? 'top' : 'bottom']: '-20px',
        height: '20px',
        backgroundColor: show ? '#FFD54F' : 'transparent',
        opacity: show ? 1 : 0,
        borderRadius: '4px',
        transition: 'opacity 0.2s ease-in',
        zIndex: -1,
      }}
    />
  );
}
