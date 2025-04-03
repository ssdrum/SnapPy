import { useDroppable, useDndContext } from '@dnd-kit/core';

interface OuterDropZoneProps {
  blockId: string;
  position: 'top' | 'bottom';
}

export default function OuterDropZone({
  blockId,
  position,
}: OuterDropZoneProps) {
  const { active } = useDndContext();

  // Check if we're dragging the current block (to prevent self-dropping)
  const isDraggingSelf = active ? active.id === blockId : false;

  const { isOver, setNodeRef } = useDroppable({
    id: `stack_${position}_${blockId}`,
    disabled: isDraggingSelf,
  });

  // Only show indicator if something is dragging, it's not this block, and it's over the drop zone
  const showIndicator = Boolean(active) && !isDraggingSelf && isOver;

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        [position === 'top' ? 'top' : 'bottom']: '-15px',
        height: '15px',
        backgroundColor: showIndicator ? '#FFD54F' : 'transparent',
        opacity: showIndicator ? 1 : 0,
        borderRadius: '4px',
        transition: 'opacity 0.2s ease-in',
        zIndex: 10,
      }}
    />
  );
}
