'use client';

import { useContext, useEffect } from 'react';
import classes from './editor.module.css';
import { ProjectContext } from './contexts/project-context';
import { Title, Paper, Group, Button, AppShellMain, Box } from '@mantine/core';
import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useBlocks } from './contexts/blocks-context';
import Canvas from './components/canvas';
import Workbench from './components/workbench';
import SaveButton from './components/save-button';
import { IconBug, IconPlayerPlay } from '@tabler/icons-react';
import useCodeEditor from './hooks/use-code-editor';
import CodeEditor from './components/code-editor';
import OutputBox from './components/output-box';
import { useCustomSensors } from './utils/sensors';
import { findParentId, isBlockInArray } from './utils/utils';

export default function EditorPage() {
  const { name, id } = useContext(ProjectContext)!;
  const {
    startDragAction,
    endDragAction,
    deselectBlockAction,
    createBlockAction,
    deleteBlockAction,
    addChildBlockAction,
    removeChildBlockAction,
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

  // Use custom sensors with select-aware behavior
  const sensors = useCustomSensors({
    activationConstraint: {
      distance: 5,
    },
  });

  const handleDragStart = (e: DragStartEvent) => {
    // First de-select any previously selected block
    deselectBlockAction();

    // If dragging a block from the workbench, create new canvas block
    const id = e.active.id.toString();
    if (isBlockInArray(state.workbenchBlocks, id)) {
      createBlockAction(id);
    }

    const parentId = findParentId(state.canvasBlocks, id);
    if (parentId) {
      removeChildBlockAction(id, parentId);
    }

    // If user started dragging a workbench block, create a new block
    startDragAction(id);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { over, delta, active } = e;

    // Exit early if not dropped on a valid target
    if (!over) return;

    const overId = over.id.toString();
    const activeId = active.id.toString();

    // Handle drop on canvas
    if (overId === 'canvas') {
      endDragAction(delta);
      return;
    }

    // Handle drop on another block (nesting)
    if (overId.startsWith('drop')) {
      const targetBlock = overId.substring(5);

      // Prevent dropping onto itself
      if (activeId === targetBlock) {
        endDragAction(delta);
        return;
      }

      addChildBlockAction(activeId, targetBlock);
      return;
    }

    // Default case - delete the block
    deleteBlockAction(activeId);
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
