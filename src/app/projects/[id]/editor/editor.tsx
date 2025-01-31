import React, { Dispatch, SetStateAction } from 'react';
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import { Coordinates } from '@dnd-kit/utilities';
import Workbench from './workbench';
import Canvas from './canvas';
import { Block } from '@/app/blocks/types';
import { saveProject } from './actions';

interface EditorProps {
  workbenchBlocks: Block[];
  setWorkbenchBlocks: Dispatch<SetStateAction<Block[]>>;
  canvasBlocks: Block[];
  setCanvasBlocks: Dispatch<SetStateAction<Block[]>>;
  blocksCount: number;
  setBlocksCount: Dispatch<SetStateAction<number>>;
  projectId: number;
}

export default function Editor({
  workbenchBlocks,
  setWorkbenchBlocks,
  canvasBlocks,
  setCanvasBlocks,
  blocksCount,
  setBlocksCount,
  projectId,
}: EditorProps) {
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

  // Return true if block with id = is is a workbench block. Return false otherwise.
  const isWorkbenchBlock = (id: number) => id < 0;

  // Adds a new block to the canvas
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
      isWorkbenchBlock: false,
    };

    setCanvasBlocks((prev) => [...prev, newBlock]);
    setBlocksCount(newBlockId);
  };

  // Moves an existing block on the canvas
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

  const handleSubmit = () => {
    saveProject(projectId, JSON.stringify(canvasBlocks));
  };

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
      {/* Save blocks to DB */}
      <form action={handleSubmit}>
        <button type='submit'>Save</button>
      </form>

      <div style={{ display: 'flex' }}>
        <DndContext
          id='dnd-context' // Needs a unique id to avoid hydration errors
          onDragEnd={({ delta, over, active }) => {
            handleDragEnd(active.id as number, over, delta);
          }}
          sensors={sensors}
        >
          <div style={style}>
            <Workbench
              blocks={workbenchBlocks}
              setWorkbenchBlocks={setWorkbenchBlocks}
            />
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
          <strong>Canvas Blocks:</strong>
          <pre>{JSON.stringify(canvasBlocks, null, 2)}</pre>
        </div>
      </div>
    </>
  );
}
