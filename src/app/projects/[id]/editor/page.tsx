'use client';

import { useState, useContext } from 'react';
import { EditorContext } from './editor-context';
import Editor from './editor';
import { Block } from '@/app/blocks/types';

export default function Page() {
  const project = useContext(EditorContext)!; // Fetch projects from context
  const { id, data } = project.project;

  // TODO: Parse data and set canvasBlocks
  const [canvasBlocks, setCanvasBlocks] = useState<Block[]>([]);
  const [blocksCount, setBlocksCount] = useState<number>(0);

  return (
    <>
      <h1>Project ID: {id}</h1>
      <p>{JSON.stringify(data)}</p>
      <Editor
        canvasBlocks={canvasBlocks}
        setCanvasBlocks={setCanvasBlocks}
        blocksCount={blocksCount}
        setBlocksCount={setBlocksCount}
      />
    </>
  );
}
