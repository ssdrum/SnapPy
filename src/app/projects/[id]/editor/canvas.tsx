import React, { useContext } from 'react';
import { EditorContext } from './editor-context';
import BlocksRenderer from '@/app/blocks/blocks-renderer';
import { useDroppable } from '@dnd-kit/core';
import classes from './editor.module.css';

export default function Canvas() {
  const { canvasBlocks } = useContext(EditorContext)!;
  const { setNodeRef } = useDroppable({ id: 'canvas' });

  return (
    <div ref={setNodeRef} className={classes.canvas}>
      <div className={classes.scrollableContent}>
        <BlocksRenderer blocks={canvasBlocks} />
      </div>
    </div>
  );
}
