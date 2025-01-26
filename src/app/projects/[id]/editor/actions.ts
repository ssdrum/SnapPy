'use server';

import { updateProject } from '@/app/lib/data';
import { revalidatePath } from 'next/cache';

export async function saveProject(projectId: number, jsonData: string) {
  try {
    await updateProject(projectId, jsonData); // Save JSON to the project
    revalidatePath(`/projects/${projectId}/editor`); // Update UI with the latest data
    console.log('Project saved successfully!');
  } catch (error) {
    console.error('Failed to save project:', error);
    console.log('Failed to save project');
  }
}
