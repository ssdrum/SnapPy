'use server';

import { updateProject } from '@/app/lib/data';
import { revalidatePath } from 'next/cache';
import { Block } from '../blocks/types';

export async function saveProject(
  projectId: string,
  canvasBlocks: Block[],
  variables: string[]
) {
  try {
    await updateProject(projectId, canvasBlocks, variables);
    revalidatePath(`/projects/${projectId}/editor`); // Update UI with the latest data
    return { success: true, message: 'Project saved successfully!' };
  } catch (error) {
    return {
      success: false,
      message: 'An error occurred. Try again later',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Generates a share link for a project and strores it in the database
 */
export async function generateShareLink(projectId: string) {
  // Generate and return the full URL
  const shareUrl = `${process.env.APP_URL}/projects/${projectId}`;
  return { success: true, shareUrl };
}
