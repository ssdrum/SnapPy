'use server';

import { createProject, updateProject } from '@/app/lib/data';
import { revalidatePath } from 'next/cache';
import { Block } from '../blocks/types';
import { prisma } from '@/app/lib/prisma';

export async function saveProject(
  projectId: string,
  canvasBlocks: Block[],
  variables: string[]
) {
  try {
    await updateProject(projectId, canvasBlocks, variables);
    revalidatePath(`/projects/${projectId}`); // Update UI with the latest data
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

// Server actions to create and delete projects
export async function addProject(formData: FormData) {
  const name = formData.get('name') as string;
  await createProject(name);
  revalidatePath('/dashboard');
}

export async function deleteProject(formData: FormData) {
  const id = formData.get('id') as string;
  await prisma.project.delete({ where: { id } });
  revalidatePath('/dashboard');
}
