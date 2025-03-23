import { Button, Modal, Group, TextInput } from '@mantine/core';
import { useBlocks } from '../contexts/blocks-context';
import { useState } from 'react';

interface CreateVariableModalProps {
  opened: boolean;
  close: () => void;
}

export default function CreateVariableModal({
  opened,
  close,
}: CreateVariableModalProps) {
  const { createVariableAction, changeVariableSelectedOptionAction } =
    useBlocks();
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // TODO: test modal logic on jest
  const handleCreateVariable = () => {
    // Clear any previous errors
    setError(null);

    // Validate input
    if (!name.trim()) {
      setError('Variable name cannot be empty');
      return;
    }

    // Attempt to create the variable
    const success = createVariableAction(name);
    if (!success) {
      setError('Variable name already exists');
      return;
    }

    // Update selected variable in workbench variable block
    changeVariableSelectedOptionAction(name);
    handleClose();
  };

  const handleClose = () => {
    close();
    setError(null);
    setName('');
  };

  // Clear error when user starts typing
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError(null);
    }

    setName(e.currentTarget.value);
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title='New variable name:'
      centered
    >
      <TextInput
        placeholder='Enter variable name'
        mb={'md'}
        value={name}
        onChange={handleNameChange}
        error={error}
      />
      <Group justify='flex-end'>
        <Button bg={'green'} onClick={handleCreateVariable}>
          Create
        </Button>
      </Group>
    </Modal>
  );
}
