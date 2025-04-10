'use client';

import { useContext, useEffect } from 'react';
import { ProjectContext } from './contexts/project-context';
import { DndContext, pointerWithin } from '@dnd-kit/core';
import { Title, Paper, Group, Button, AppShellMain, Box } from '@mantine/core';
import classes from './editor.module.css';
import Canvas from './components/canvas';
import Workbench from './components/workbench';
import SaveButton from './components/save-button';
import { IconBug, IconPlayerPlay } from '@tabler/icons-react';
import useCodeEditor from './hooks/use-code-editor';
import CodeEditor from './components/code-editor';
import OutputBox from './components/output-box';
import { useCustomSensors } from './utils/sensors';
import DragEventsHandler from './components/drag-events-handler';

export default function EditorPage() {
  const { name, id } = useContext(ProjectContext)!;
  const { code, handleCodeChange, error, output } = useCodeEditor();

  // Show a window alert when an error occurs
  // TODO: handle this more gracefully
  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  // Use custom sensors with select-aware behavior
  const sensors = useCustomSensors({
    activationConstraint: {
      distance: 5,
    },
  });

  return (
    <AppShellMain className={classes.editorPageWrapper}>
      <Group m='md' justify='space-between'>
        <Title order={2}>{name}</Title>

        {/* Buttons on the right-handsight*/}
        <Group>
          <SaveButton projectId={id} />
          <Button bg='green' leftSection={<IconPlayerPlay />} disabled>
            Run
          </Button>
          <Button bg='red' leftSection={<IconBug />} disabled>
            Debug
          </Button>
        </Group>
      </Group>

      {/* Canvas */}
      <Paper className={classes.editorWrapper} withBorder>
        <DndContext
          id='dnd-context'
          sensors={sensors}
          collisionDetection={pointerWithin}
        >
          <DragEventsHandler>
            <Workbench />
            <Canvas />
          </DragEventsHandler>
        </DndContext>

        <Box className={classes.codeEditorWrapper}>
          <CodeEditor code={code} handleCodeChange={handleCodeChange} />
          <OutputBox output={output} />
        </Box>
      </Paper>
    </AppShellMain>
  );
}
