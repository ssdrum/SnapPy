import React from "react";
import { Session } from "@/app/lib/types";
import { getUserSession } from "@/app/lib/session";
import { redirect } from "next/navigation"; // Use this redirect function for server components
import { fetchProjectById } from "@/app/lib/data";
import EditorProvider from "@/app/projects/[id]/editor/editor-context";

export default async function EditorLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  // Check if user is authenticated
  const session: Session = await getUserSession();
  if (session === undefined) {
    redirect("/");
  }

  // Fetch project info from db
  const { id } = await params;
  const project = await fetchProjectById(Number(id));
  if (!project) {
    redirect("/projects/not-found"); // Redirect to a "not found" page or handle error
  }

  // User is trying to access someone else's project
  if (project.userId !== session.id) {
    redirect("/projects/not-found");
  }

  return (
    <EditorProvider project={project}>
      <main>{children}</main>
    </EditorProvider>
  );
}

