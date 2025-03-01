'use client';

import { useContext } from 'react';
import { EditorContext } from './editor-context';
import Editor from './editor';
import { Group, Title } from '@mantine/core';
import classes from './editor.module.css';
import SaveButton from './save-button';

export default function Page() {
  const { project } = useContext(EditorContext)!;

  return (
    <main className={classes.editorPageWrapper}>
      <Group>
        <SaveButton />
        <Title>{project.name}</Title>
      </Group>

      <Editor />
    </main>
  );
}
