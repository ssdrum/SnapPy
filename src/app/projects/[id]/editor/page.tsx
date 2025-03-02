'use client';

import { useContext, useEffect } from 'react';
import { EditorContext } from './editor-context';
import { DndContext } from '@dnd-kit/core';
import { Box, Button, Group, Title } from '@mantine/core';
import classes from './editor.module.css';
import SaveButton from './save-button';
import Workbench from './workbench';
import Canvas from './canvas';
import CodeEditor from './code-editor';
import useCodeEditor from '@/app/hooks/useCodeEditor';
import LoadingScreen from './loading-screen';
import OutputBox from './output-box';

export default function Page() {
  const { project, handleDragEnd, sensors } = useContext(EditorContext)!;
  const { code, handleCodeChange, isPyodideLoading, output, runPython, error } =
    useCodeEditor();

  // Show a window alert when an error occurs
  // TODO: handle this more gracefully
  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  return (
    <main className={classes.editorPageWrapper}>
      {isPyodideLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Group>
            <Title>{project.name}</Title>
            <SaveButton />
            <Button
              bg={'green'}
              disabled={isPyodideLoading}
              onClick={runPython}
            >
              Run
            </Button>
          </Group>

          <div className={classes.editorWrapper}>
            <DndContext
              id='dnd-context' // Needs a unique id to avoid hydration errors
              onDragEnd={handleDragEnd}
              sensors={sensors}
            >
              <Workbench />
              <Canvas />
            </DndContext>

            <Box className={classes.codeEditorWrapper}>
              <CodeEditor code={code} handleCodeChange={handleCodeChange} />
              <OutputBox output={output} />
            </Box>
          </div>
        </>
      )}
    </main>
  );
}
