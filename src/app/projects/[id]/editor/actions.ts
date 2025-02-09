'use server';

import { Block } from '@/app/blocks/types';
import { updateProject } from '@/app/lib/data';
import { revalidatePath } from 'next/cache';

export async function saveProject(projectId: number, data: Block[]) {
  try {
    await updateProject(projectId, data); // Save JSON to the project
    revalidatePath(`/projects/${projectId}/editor`); // Update UI with the latest data
    console.log('Project saved successfully!');
  } catch (error) {
    console.error('Failed to save project:', error);
    console.log('Failed to save project');
  }
}
