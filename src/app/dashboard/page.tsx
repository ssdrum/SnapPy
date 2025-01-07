'use client';

import { useContext } from 'react';
import { DashboardContext } from '@/app/dashboard/dashboard-context';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const projects = useContext(DashboardContext)!; // Fetch projects from context

  return (
    <ul>
      {/* Display list of projects */}
      {projects.projects.map((p, index) => (
        <button
          key={index}
          type='button'
          onClick={() => router.push('/projects/' + p.id + '/editor')}
        >
          <li>
            {p.id} {JSON.stringify(p.data)}
          </li>
        </button>
      ))}

      {/* Form to add projects */}
    </ul>
  );
}
