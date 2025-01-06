"use client"

import { useContext } from "react"
import { EditorContext } from "./editor-context";

export default function Editor() {
  const project = useContext(EditorContext)!; // Fetch projects from context
  const {id, data} = project.project;

  return (
    <>
      <h1>Project ID: {id}</h1>
      <p>{JSON.stringify(data)}</p>
    </>
  )
}