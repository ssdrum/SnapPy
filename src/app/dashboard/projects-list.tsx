'use client';

import { useContext } from 'react';
import { DashboardContext } from '@/app/dashboard/dashboard-context';
import Link from 'next/link';

export default function ProjectsList() {
  const projects = useContext(DashboardContext)!; // Fetch projects from context

  return (
    <>
      <h2>Projects List</h2>
      <ul>
        {/* Display list of projects */}
        {projects.projects.map((p, index) => (
          <li key={index}>
            <Link href={`/projects/${p.id}/editor`}>
              {p.id} {p.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
