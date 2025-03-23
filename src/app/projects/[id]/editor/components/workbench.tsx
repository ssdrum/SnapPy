import { useDisclosure } from '@mantine/hooks';
import { useBlocks } from '../contexts/blocks-context';
import classes from '../editor.module.css';
import BlocksRenderer from './blocks-renderer';
import { Divider, Stack, Button } from '@mantine/core';
import CreateVariableModal from './create-variable-modal';
import { useDroppable } from '@dnd-kit/core';

export default function Workbench() {
  const { state } = useBlocks();
  const { setNodeRef } = useDroppable({ id: 'workbench' });
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div className={classes.workbench} ref={setNodeRef}>
      <CreateVariableModal opened={opened} close={close} />

      <Stack gap='md'>
        <Button onClick={open}>Create Variable</Button>
        <Divider />
        <BlocksRenderer
          blocks={state.workbenchBlocks}
          variables={state.variables}
        />
      </Stack>
    </div>
  );
}
