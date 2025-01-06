import { prisma } from "./prisma"
import { Project } from "@prisma/client"

// Fetch projects by user
export const fetchProjectsByUser = async (userId: number): Promise<Project[]> => {
    const projects = await prisma.project.findMany({
        where: {
            userId: userId,
        }
    });
    return projects
}

export const fetchProjectById = async (id: number): Promise<Project | null> => {
    const project = await prisma.project.findUnique({
        where: {
            id: id
        }
    })
    return project
}