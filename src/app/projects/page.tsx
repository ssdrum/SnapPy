import ProjectsList from './projects-list';
import AddProject from './add-project';
import { AppShellMain } from '@mantine/core';

export default function Projects() {
  return (
    // AppShellMain takes care of padding
    <AppShellMain>
      <ProjectsList />
      <AddProject />
    </AppShellMain>
  );
}
