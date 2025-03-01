import { saveProject } from './actions';
import { Button } from '@mantine/core';
import { useContext } from 'react';
import { EditorContext } from './editor-context';

export default function SaveButton() {
  const { project, canvasBlocks } = useContext(EditorContext)!; // Fetch projects from context

  const handleSave = () => {
    saveProject(project.id, canvasBlocks);
  };

  return (
    <form action={handleSave}>
      <Button type='submit'>Save</Button>
    </form>
  );
}
