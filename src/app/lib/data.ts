import { getUserSession } from '@/app/lib/session';
import { prisma } from './prisma';
import { Project } from '@prisma/client';
import { Prisma } from '@prisma/client';

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
      data: Prisma.JsonNull, // Set data to null as default
    },
  });

  return project;
}

// Update an existing project and add it to db
export async function updateProject(projectId: number, data: string): Promise<Project> {
  console.log("hello")
  const user = await getUserSession();
  // TODO: Handle unauthorised user

  const project = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      data: data
    }
  }
  )
  return project;
}