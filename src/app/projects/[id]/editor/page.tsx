'use client';

import { useContext, useEffect } from 'react';
import { ProjectContext } from './contexts/project-context';
import { DndContext, pointerWithin } from '@dnd-kit/core';
import { Title, Group, Button, AppShellMain, Box } from '@mantine/core';
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
import { useBlocks } from './contexts/blocks-context';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

export default function EditorPage() {
  const { name, id } = useContext(ProjectContext)!;
  const { state } = useBlocks();
  const { code, handleCodeChange, error, output } = useCodeEditor(
    state.canvas,
    state.entrypointBlockId
  );

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
      <Box className={classes.editorWrapper}>
        <PanelGroup direction='horizontal'>
          <DndContext
            id='dnd-context'
            sensors={sensors}
            collisionDetection={pointerWithin}
          >
            <DragEventsHandler>
              <Workbench />

              <Panel defaultSize={70}>
                <Canvas />
              </Panel>
            </DragEventsHandler>

            <PanelResizeHandle className={classes.resizeHandleVertical} />

            <Panel defaultSize={30}>
              <Box className={classes.codeEditorWrapper}>
                <PanelGroup direction='vertical'>
                  <Panel defaultSize={60}>
                    <CodeEditor
                      code={code}
                      handleCodeChange={handleCodeChange}
                    />
                  </Panel>

                  <PanelResizeHandle
                    className={classes.resizeHandleHorizontal}
                  />

                  <Panel defaultSize={40}>
                    <OutputBox output={output} />
                  </Panel>
                </PanelGroup>
              </Box>
            </Panel>
          </DndContext>
        </PanelGroup>
      </Box>
    </AppShellMain>
  );
}
