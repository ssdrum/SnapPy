'use client';

import { useState, useContext } from 'react';
import { EditorContext } from './editor-context';
import Editor from './editor';
import { Block, BlockTypes } from '@/app/blocks/types';

export default function Page() {
  const project = useContext(EditorContext)!; // Fetch projects from context
  const { id, data } = project.project;

  // TODO: Parse data and set canvasBlocks
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
    {
      id: -3,
      type: BlockTypes.EMPTY,
      coords: { x: 0, y: 0 },
      isWorkbenchBlock: true,
    },
  ]);
  const [canvasBlocks, setCanvasBlocks] = useState<Block[]>([]);
  const [blocksCount, setBlocksCount] = useState<number>(0);

  return (
    <>
      <h1>Project ID: {id}</h1>
      <p>{JSON.stringify(data)}</p>
      <Editor
        workbenchBlocks={workbenchBlocks}
        setWorkbenchBlocks={setWorkbenchBlocks}
        canvasBlocks={canvasBlocks}
        setCanvasBlocks={setCanvasBlocks}
        blocksCount={blocksCount}
        setBlocksCount={setBlocksCount}
        projectId={id}
      />
    </>
  );
}
