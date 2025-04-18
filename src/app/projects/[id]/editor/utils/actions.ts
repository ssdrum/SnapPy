'use server';

import { updateProject } from '@/app/lib/data';
import { revalidatePath } from 'next/cache';
import { Block } from '../blocks/types';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/app/lib/prisma';

export async function saveProject(
  projectId: number,
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
export async function generateShareLink(projectId: number) {
  try {
    const shareId = uuidv4();

    await prisma.project.update({
      where: { id: projectId },
      data: { shareId: shareId },
    });

    // Generate and return the full URL
    const shareUrl = `${process.env.APP_URL}/projects/shared/${shareId}`;
    return { success: true, shareUrl };
  } catch (error) {
    console.error('Error generating share link:', error);
    return { success: false, error: 'Failed to create share link' };
  }
}
