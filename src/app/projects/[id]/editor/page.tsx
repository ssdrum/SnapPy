'use client';

import { useContext, useEffect } from 'react';
import classes from './editor.module.css';
import { ProjectContext } from './contexts/project-context';
import { Title, Paper, Group, Button, AppShellMain, Box } from '@mantine/core';
import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { useBlocks } from './contexts/blocks-context';
import Canvas from './components/canvas';
import Workbench from './components/workbench';
import SaveButton from './components/save-button';
import { Block } from './blocks/types';
import { IconBug, IconPlayerPlay } from '@tabler/icons-react';
import useCodeEditor from './hooks/use-code-editor';
import CodeEditor from './components/code-editor';
import OutputBox from './components/output-box';

export default function EditorPage() {
  const { name, id } = useContext(ProjectContext)!;
  const {
    startDragAction,
    endDragAction,
    deselectBlockAction,
    createBlockAction,
    deleteBlockAction,
    state,
  } = useBlocks();

  const { code, handleCodeChange, error, output } = useCodeEditor();

  // Show a window alert when an error occurs
  // TODO: handle this more gracefully
  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  // Without this, all inputs in the blocks won't be clickable
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (e: DragStartEvent) => {
    // First de-select any previously selected block
    deselectBlockAction();

    const id = e.active.id as string;
    if (isWorkbenchBlock(state.workbenchBlocks, id)) {
      createBlockAction(id);
    }
    // If user started dragging a workbench block, create a new block
    startDragAction(id);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { over, delta, active } = e;
    console.log(over);

    // Only trigger action if block was dropped onto canvas
    if (!over || over.id !== 'canvas') {
      deleteBlockAction(active.id as string);
      return;
    }

    endDragAction(delta);
  };

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
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <Workbench />
          <Canvas />
        </DndContext>

        <Box className={classes.codeEditorWrapper}>
          <CodeEditor code={code} handleCodeChange={handleCodeChange} />
          <OutputBox output={output} />
        </Box>
      </Paper>
    </AppShellMain>
  );
}

const isWorkbenchBlock = (blocks: Block[], id: string) => {
  return blocks.some((block) => block.id === id);
};
