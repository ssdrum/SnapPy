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

interface EditorProps {
  workbenchBlocks: Block[];
  setWorkbenchBlocks: Dispatch<SetStateAction<Block[]>>;
  canvasBlocks: Block[];
  setCanvasBlocks: Dispatch<SetStateAction<Block[]>>;
  blocksCount: number;
  setBlocksCount: Dispatch<SetStateAction<number>>;
}

export default function Editor({
  workbenchBlocks,
  setWorkbenchBlocks,
  canvasBlocks,
  setCanvasBlocks,
  blocksCount,
  setBlocksCount,
}: EditorProps) {
  const handleDragEnd = (active: number, over: any, delta: Coordinates) => {
    if (!over) {
      return;
    }

    if (over.id === 'canvas') {
      if (isWorkbenchBlock(active)) {
        addBlockToCanvas(active, delta);
      } else {
        moveExistingBlock(active, delta);
      }
    }

    if (over.id === 'bin') {
      if (!isWorkbenchBlock(active)) {
        deleteBlockFromCanvas(active);
      }
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

  // Deletes a new block to the canvas
  const deleteBlockFromCanvas = (active: number) => {
    setCanvasBlocks((prev) => prev.filter((block) => block.id !== active));
    console.log(`Deleting block with ID: ${active}`);
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

  // CSS
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexGrow: 1,
    height: '100vh', // Ensures the container takes up full viewport height
    overflow: 'hidden', // Prevents container overflow
  };

  const editorStyle: React.CSSProperties = {
    display: 'flex',
    flexGrow: 1, // Take up remaining space
    width: '100%',
    border: '2px solid #333',
    position: 'relative',
  };

  const codeWrapperStyle: React.CSSProperties = {
    backgroundColor: '#F5F5F5',
    width: '380px',
    maxWidth: '380px',
    overflow: 'auto', // Scroll only if content overflows
  };

  return (
    <div style={containerStyle}>
      <DndContext
        id='dnd-context' // Needs a unique id to avoid hydration errors
        onDragEnd={({ delta, over, active }) => {
          handleDragEnd(active.id as number, over, delta);
        }}
        sensors={sensors}
      >
        <div style={editorStyle}>
          <Workbench
            blocks={workbenchBlocks}
            setWorkbenchBlocks={setWorkbenchBlocks}
          />
          <Canvas blocks={canvasBlocks} setCanvasBlocks={setCanvasBlocks} />
        </div>
      </DndContext>

      <div style={codeWrapperStyle}>
        <h2>Canvas Blocks:</h2>
        <pre>{JSON.stringify(canvasBlocks, null, 2)}</pre>
      </div>
    </div>
  );
}
