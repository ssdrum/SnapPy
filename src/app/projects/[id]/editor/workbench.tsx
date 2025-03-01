import React, { useContext } from 'react';
import { EditorContext } from './editor-context';
import BlocksRenderer from '@/app/blocks/blocks-renderer';
import Bin from './bin.tsx';
import classes from './editor.module.css';

export default function Workbench() {
  const { workbenchBlocks } = useContext(EditorContext)!;

  return (
    <div className={classes.workbench}>
      <Bin />
      <BlocksRenderer blocks={workbenchBlocks} />
    </div>
  );
}
