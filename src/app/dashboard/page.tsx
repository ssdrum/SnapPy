"use client"

import { useContext } from "react"
import { DashboardContext } from "@/app/dashboard/dashboard-context"

export default function Dashboard() {
  const projects = useContext(DashboardContext)!; // Fetch projects from context

  return (
    <ul>
      {projects.projects.map((p, index) => (
        <li key={index}>{p.id} {JSON.stringify(p.data)}</li>
      ))}
    </ul>
  )
}