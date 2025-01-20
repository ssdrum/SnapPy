// Empty block for testing purposes
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

// Draggable boxes
interface EmptyProps {
  id: number;
  top: number;
  left: number;
  isWorkbenchBlock: boolean;
}

export default function Empty({ id, top, left, isWorkbenchBlock }: EmptyProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    top: isWorkbenchBlock ? 0 : top,
    left: isWorkbenchBlock ? 0 : left,
    position: isWorkbenchBlock ? 'static' : 'absolute',
    zIndex: isWorkbenchBlock ? '2' : '0',
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <svg width='250' height='60' xmlns='http://www.w3.org/2000/svg'>
        {/* Main block shape */}
        <rect
          x='0'
          y='0'
          width='250'
          height='50'
          rx='10'
          ry='10'
          fill='grey'
          stroke='black'
          strokeWidth='1'
        />
      </svg>
    </div>
  );
}
