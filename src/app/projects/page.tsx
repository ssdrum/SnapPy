'use client';

import ProjectsList from './projects-list';
import AddProjectModal from './add-project';
import { AppShellMain, Container, Group, Title } from '@mantine/core';

export default function Projects() {
  return (
    <AppShellMain>
      <Container size={800} mt='xl'>
        <Title order={1} mb='md'>
          Projects
        </Title>
        <Group justify='space-between' mb='lg'>
          <Title order={3}>Manage your projects</Title>
          <AddProjectModal />
        </Group>
        <ProjectsList />
      </Container>
    </AppShellMain>
  );
}
