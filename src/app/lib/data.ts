import { getUserSession } from '@/app/lib/session';
import { prisma } from './prisma';
import { Project } from '@prisma/client';
import { Prisma } from '@prisma/client';
import {
  Block,
  BlockState,
  BlockType,
} from '@/app/projects/[id]/editor/blocks/types';
import { JsonValue } from '@prisma/client/runtime/library';

// Fetch projects by user
export const fetchProjectsByUser = async (
  userId: number
): Promise<Project[]> => {
  const projects = await prisma.project.findMany({
    where: {
      userId: userId,
    },
  });
  return projects;
};

export const fetchProjectById = async (id: number): Promise<Project | null> => {
  const project = await prisma.project.findUnique({
    where: {
      id: id,
    },
  });
  return project;
};

// Create a new project and add it to db
export async function createProject(name: string): Promise<Project> {
  const user = await getUserSession();
  // TODO: Handle unauthorised user

  const project = await prisma.project.create({
    data: {
      name: name,
      userId: user.id,
      canvas: [
        {
          id: 'start',
          type: BlockType.ProgramStart,
          coords: { x: 400, y: 200 },
          isWorkbenchBlock: false,
          state: BlockState.Idle,
          parentId: null,
          prevId: null,
          nextId: null,
          children: null,
        },
      ],
      variables: ['x'],
    },
  });

  return project;
}

/**
 * Updates an existing project on the db
 */
export async function updateProject(
  projectId: number,
  canvas: Block[],
  variables: string[]
): Promise<Project> {
  const canvasJson: Prisma.InputJsonValue = JSON.parse(JSON.stringify(canvas));
  const variablesJson: Prisma.InputJsonValue = JSON.parse(
    JSON.stringify(variables)
  );

  const project = await prisma.project.update({
    where: { id: projectId },
    data: {
      canvas: canvasJson,
      variables: variablesJson,
    },
  });

  return project;
}

// Parses canvas blocks
export function parseBlocksFromDB(canvas: JsonValue): Block[] {
  if (!canvas) {
    return [];
  }

  try {
    return JSON.parse(JSON.stringify(canvas)) as Block[]; // Parse project data retreived from DB into blocks array
  } catch (error) {
    console.error('Error parsing canvas from db:', error);
    return [];
  }
}

// Parses variables
export function parseVariablesFromDB(variables: JsonValue): string[] {
  if (!variables) {
    return [];
  }

  try {
    return JSON.parse(JSON.stringify(variables)) as string[];
  } catch (error) {
    console.error('Error parsing variables from db:', error);
    return [];
  }
}
