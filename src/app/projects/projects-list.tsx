'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { ProjectsContext } from './projects-context';

export default function ProjectsList() {
  const projects = useContext(ProjectsContext)!; // Fetch projects from context

  return (
    <>
      <h2>Projects List</h2>
      <ul>
        {/* Display list of projects */}
        {projects.projects.map((p, index) => (
          <li key={index}>
            <Link href={`/projects/${p.id}`}>
              {p.id} {p.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
