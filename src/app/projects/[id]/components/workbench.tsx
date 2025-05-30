import { useDisclosure } from '@mantine/hooks';
import { useBlocks } from '../contexts/blocks-context';
import { useDroppable } from '@dnd-kit/core';
import classes from '../editor.module.css';
import { Stack, Button } from '@mantine/core';
import CreateVariableModal from './create-variable-modal';
import WorkbenchBlocksRenderer from './workbench-blocks-renderer';

export default function Workbench() {
  const { state } = useBlocks();
  const { setNodeRef } = useDroppable({ id: 'workbench' });
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div className={classes.workbench} ref={setNodeRef}>
      <CreateVariableModal opened={opened} close={close} />
      <Button onClick={open} mb={'lg'}>
        Create Variable
      </Button>

      <Stack gap='md'>
        <WorkbenchBlocksRenderer workbench={state.workbench} />
      </Stack>
    </div>
  );
}
