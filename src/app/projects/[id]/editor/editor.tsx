import React, { useState } from 'react';
import { Coordinates } from '@dnd-kit/utilities';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import Variable from '@/app/blocks/variable';

interface Block {
  id: string;
  coords: Coordinates;
}

export default function Editor() {
  // Temporarily just hardcoding blocks in the editor's state
  const [blocks, setBlocks] = useState<Block[]>([
    { id: '1', coords: { x: 0, y: 0 } },
  ]);

  // This function is triggered whenever a drag event ends. It moves dragged
  // element into its new position
  const handleDragEnd = (id: string, delta: Coordinates) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === id
          ? {
              ...block,
              coords: {
                x: block.coords.x + delta.x,
                y: block.coords.y + delta.y,
              },
            }
          : block
      )
    );
  };

  const wrapperStyle: React.CSSProperties = {
    width: '600px',
    height: '1500px',
    maxWidth: '80%', // Ensures it doesn't take more than 80% of the screen width
    maxHeight: '80vh', // Ensures it doesn't take more than 80% of the screen height
    border: '2px solid #333',
    position: 'relative',
    overflow: 'scroll',
  };

  // This workaround allows the onClick events for the input boxes to trigger.
  // Without it, the dragEvent will override any onClick
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    })
  );

  return (
    <div style={wrapperStyle}>
      <DndContext
        modifiers={[restrictToParentElement]}
        onDragEnd={({ delta, active }) => {
          handleDragEnd(active.id as string, delta);
        }}
        sensors={sensors}
      >
        {blocks.map((block) => (
          <Variable
            key={block.id}
            id={block.id}
            top={block.coords.y}
            left={block.coords.x}
          />
        ))}
      </DndContext>
    </div>
  );
}
