// Empty block for testing purposes
import React, { Dispatch, SetStateAction, useRef, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Block } from './types';
import { updateBlockPosition } from './helpers';

// Draggable boxes
interface EmptyProps {
  id: number;
  top: number;
  left: number;
  isWorkbenchBlock: boolean;
  setWorkbenchBlocks: Dispatch<SetStateAction<Block[]>> | null;
}

export default function Empty({
  id,
  top,
  left,
  isWorkbenchBlock,
  setWorkbenchBlocks,
}: EmptyProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  // Need this ref to calculate the position of the block relative to its container
  // (if is a workbench block)
  const localRef = useRef<HTMLDivElement | null>(null);

  // update x and y coordinates of workBenchBlocks
  useEffect(() => {
    if (isWorkbenchBlock) {
      updateBlockPosition(localRef, setWorkbenchBlocks, id); // Use the extracted function
    }
  }, []);

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    top: isWorkbenchBlock ? 0 : top,
    left: isWorkbenchBlock ? 0 : left,
    position: isWorkbenchBlock ? 'static' : 'absolute',
    zIndex: isWorkbenchBlock ? '2' : '0',
    cursor: 'grab',
  };

  return (
    <div
      ref={(node) => {
        setNodeRef(node); // For DnD kit
        localRef.current = node; // For measuring offsets
      }}
      style={style}
      {...listeners}
      {...attributes}
    >
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
