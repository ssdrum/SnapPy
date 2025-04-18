import { useState } from 'react';
import { Button } from '@mantine/core';
import { useBlocks } from '../contexts/blocks-context';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { Notifications, notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { saveProject } from '../utils/actions';

// TODO: save variables
interface SaveButtonProps {
  projectId: number;
}

export default function SaveButton({ projectId }: SaveButtonProps) {
  const { state } = useBlocks();
  const [isSaving, setIsSaving] = useState(false);

  // Disables the button while saving
  const handleSave = async () => {
    setIsSaving(true);

    const { success, message, error } = await saveProject(
      projectId,
      state.canvas,
      state.variables
    );

    // Show notification
    if (success) {
      notifications.show({
        color: 'green',
        title: 'Success!',
        message: message,
      });
    } else {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: message,
      });
      console.error(error);
    }

    setIsSaving(false);
  };

  return (
    <>
      {/* Need this component anywhere within Mantine's provider to show notification*/}
      <Notifications />

      <form action={handleSave}>
        <Button
          type='submit'
          leftSection={<IconDeviceFloppy />}
          loading={isSaving}
          disabled={isSaving}
        >
          Save
        </Button>
      </form>
    </>
  );
}
