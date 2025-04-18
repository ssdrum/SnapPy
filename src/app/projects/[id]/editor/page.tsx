'use client';

import { useContext } from 'react';
import { ProjectContext } from './contexts/project-context';
import { DndContext, pointerWithin } from '@dnd-kit/core';
import {
  Title,
  Group,
  Button,
  AppShellMain,
  Box,
  Loader,
  Center,
  Stack,
  Text,
} from '@mantine/core';
import classes from './editor.module.css';
import Canvas from './components/canvas';
import Workbench from './components/workbench';
import SaveButton from './components/save-button';
import { IconBug, IconPlayerPlay, IconShare } from '@tabler/icons-react';
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
  const {
    code,
    handleCodeChange,
    output,
    isPyodideLoading,
    runPython,
    isRunning,
  } = useCodeEditor(state.canvas, state.entrypointBlockId);

  // Use custom sensors with select-aware behavior
  const sensors = useCustomSensors({
    activationConstraint: {
      distance: 5,
    },
  });

  if (isPyodideLoading) {
    return (
      <AppShellMain className={classes.editorPageWrapper}>
        <Center style={{ height: '100%' }}>
          <Stack align='center'>
            <Loader color='blue' size='xl' />
            <Text size='lg' fw={500}>
              Loading environment...
            </Text>
          </Stack>
        </Center>
      </AppShellMain>
    );
  }

  return (
    <AppShellMain className={classes.editorPageWrapper}>
      <Group m='md' justify='space-between'>
        <Title order={2}>{name}</Title>

        {/* Buttons on the right-handsight*/}
        <Group>
          <SaveButton projectId={id} />
          <Button
            bg='green'
            leftSection={<IconPlayerPlay />}
            onClick={runPython}
          >
            Run
          </Button>
          <Button bg='violet' leftSection={<IconShare />}>
            Collaborate
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
                    <OutputBox output={output} isRunning={isRunning} />
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
