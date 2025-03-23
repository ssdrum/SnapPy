'use server';

import { updateProject } from '@/app/lib/data';
import { revalidatePath } from 'next/cache';
import { Block } from './types';

interface Result {
  success: boolean;
  message: string;
  error?: string;
}

export async function saveProject(
  projectId: number,
  canvasBlocks: Block[],
  variables: string[]
): Promise<Result> {
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
