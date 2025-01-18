import React, { Dispatch, SetStateAction, useState } from 'react';
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import { Coordinates } from '@dnd-kit/utilities';
import Workbench from './workbench';
import Canvas from './canvas';

export type VariableBlock = {
  id: number;
  name: string;
  value: string;
  coords: Coordinates;
};

interface EditorProps {
  canvasBlocks: VariableBlock[];
  setCanvasBlocks: Dispatch<SetStateAction<VariableBlock[]>>;
}

const workbenchBlocks: VariableBlock[] = [
  { id: -1, name: '', value: '', coords: { x: 0, y: 0 } },
];

export default function Editor({ canvasBlocks, setCanvasBlocks }: EditorProps) {
  const [blocksCount, setBlocksCount] = useState(0);

  const handleDragEnd = (active: number, over: any, delta: Coordinates) => {
    if (!over || over.id !== 'canvas') {
      return;
    }

    if (isWorkbenchBlock(active)) {
      addBlockToCanvas(active, delta);
    } else {
      moveExistingBlock(active, delta);
    }
  };

  const isWorkbenchBlock = (id: number) => id < 0;

  const addBlockToCanvas = (active: number, delta: Coordinates) => {
    const block = workbenchBlocks.find((b) => b.id === active);
    if (!block) return;

    const newBlockId = blocksCount + 1;
    const newBlock = {
      ...block,
      id: newBlockId,
      coords: {
        x: block.coords.x + delta.x,
        y: block.coords.y + delta.y,
      },
    };

    setCanvasBlocks((prev) => [...prev, newBlock]);
    setBlocksCount(newBlockId);
  };

  const moveExistingBlock = (active: number, delta: Coordinates) => {
    setCanvasBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === active
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

  // This workaround allows the onClick events for the input boxes to trigger.
  // Without it, the dragEvent will override any onClick
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0.1,
      },
    })
  );

  const style: React.CSSProperties = {
    display: 'flex',
    width: '1000px',
    height: '1500px',
    maxWidth: '80%', // Ensures it doesn't take more than 80% of the screen width
    maxHeight: '80vh', // Ensures it doesn't take more than 80% of the screen height
    border: '2px solid #333',
    position: 'relative',
    overflow: 'scroll',
  };

  return (
    <>
      {/* JSON Display for canvasBlocks */}
      <div style={{ display: 'flex' }}>
        <DndContext
          onDragEnd={({ delta, over, active }) => {
            handleDragEnd(active.id as number, over, delta);
          }}
          sensors={sensors}
        >
          <div style={style}>
            <Workbench blocks={workbenchBlocks} />
            <Canvas blocks={canvasBlocks} setCanvasBlocks={setCanvasBlocks} />
          </div>
        </DndContext>

        <div
          style={{
            marginBottom: '1rem',
            padding: '1rem',
            border: '1px solid #ccc',
            background: '#f9f9f9',
          }}
        >
          <strong>Canvas Blocks JSON:</strong>
          <pre>{JSON.stringify(canvasBlocks, null, 2)}</pre>
        </div>
      </div>
    </>
  );
}
