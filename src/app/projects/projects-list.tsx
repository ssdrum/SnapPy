'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { ProjectsContext } from './projects-context';
import {
  Button,
  Center,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Title,
} from '@mantine/core';
import { deleteProject } from './[id]/utils/actions';
import { formatDistanceToNow } from 'date-fns';

export default function ProjectsList() {
  const projects = useContext(ProjectsContext);

  // Sort projects by date in descending order (newer to older)
  const sortedProjects = [...(projects?.projects || [])].sort((a, b) => {
    return (
      new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    );
  });

  // Display message if no projects found
  if (sortedProjects.length == 0) {
    return (
      <Center mt={200}>
        <Title order={2}>Nothing to see here yet...</Title>
      </Center>
    );
  }

  // Build table rows
  const rows = sortedProjects?.map((project) => (
    <TableTr key={project.id}>
      <TableTd>
        <Link href={`/projects/${project.id}`}>
          <Title order={4}>{project.name}</Title>
        </Link>
      </TableTd>
      <TableTd>
        {formatDistanceToNow(new Date(project.lastUpdated), {
          addSuffix: true,
        })}
      </TableTd>
      <TableTd style={{ textAlign: 'right' }}>
        <form action={deleteProject}>
          <input type='hidden' name='id' value={project.id} />
          <Button type='submit' color='red'>
            Delete
          </Button>
        </form>
      </TableTd>
    </TableTr>
  ));

  return (
    <Table verticalSpacing={'sm'}>
      <TableThead>
        <TableTr>
          <TableTh>Name</TableTh>
          <TableTh>Last Updated</TableTh>
        </TableTr>
      </TableThead>
      <TableTbody>{rows}</TableTbody>
    </Table>
  );
}
