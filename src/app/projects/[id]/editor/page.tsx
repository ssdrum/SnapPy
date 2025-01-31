'use client';

import { useState, useContext } from 'react';
import { EditorContext } from './editor-context';
import Editor from './editor';
import { Block, BlockTypes } from '@/app/blocks/types';
import { saveProject } from './actions';

export default function Page() {
  const project = useContext(EditorContext)!; // Fetch projects from context
  const { id, name, data } = project.project;

  const [workbenchBlocks, setWorkbenchBlocks] = useState<Block[]>([
    {
      id: -1,
      type: BlockTypes.VARIABLE,
      coords: { x: 0, y: 0 },
      isWorkbenchBlock: true,
      name: '',
      value: '',
    },
    {
      id: -2,
      type: BlockTypes.EMPTY,
      coords: { x: 0, y: 0 },
      isWorkbenchBlock: true,
    },
  ]);

  const [canvasBlocks, setCanvasBlocks] = useState<Block[]>(() => {
    if (!data) {
      return [];
    }

    try {
      return JSON.parse(data as string) as Block[]; // Parse project data retreived from DB into blocks array
    } catch (error) {
      console.error('Error parsing canvasBlocks from data:', error);
      return [];
    }
  });

  const [blocksCount, setBlocksCount] = useState<number>(() => {
    if (!canvasBlocks) {
      return 0;
    }

    // Get highest block id
    const maxId =
      canvasBlocks.length > 0
        ? Math.max(...canvasBlocks.map((block) => block.id))
        : 0;
    return maxId;
  });

  const handleSubmit = () => {
    saveProject(id, JSON.stringify(canvasBlocks));
  };

  const style: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    maxHeight: '100vh',
  };

  return (
    <div style={style}>
      <h1>{name}</h1>

      {/* Save blocks to DB */}
      <form action={handleSubmit}>
        <button type='submit'>Save</button>
      </form>

      <Editor
        workbenchBlocks={workbenchBlocks}
        setWorkbenchBlocks={setWorkbenchBlocks}
        canvasBlocks={canvasBlocks}
        setCanvasBlocks={setCanvasBlocks}
        blocksCount={blocksCount}
        setBlocksCount={setBlocksCount}
      />
    </div>
  );
}
