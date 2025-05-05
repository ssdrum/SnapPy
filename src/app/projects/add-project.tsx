'use client';

import { useState } from 'react';
import { Modal, Button, TextInput } from '@mantine/core';
import { addProject } from './[id]/utils/actions';

export default function AddProjectModal() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Button onClick={() => setOpened(true)}>New Project</Button>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title='Create New Project'
        centered
      >
        <form
          action={async (formData) => {
            await addProject(formData);
            setOpened(false);
          }}
        >
          <TextInput
            data-autofocus
            name='name'
            placeholder='Enter project name'
            label='Project Name'
            withAsterisk
            required
          />
          <Button type='submit' mt='md' fullWidth>
            Create
          </Button>
        </form>
      </Modal>
    </>
  );
}
