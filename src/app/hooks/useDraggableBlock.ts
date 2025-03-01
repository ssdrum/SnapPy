import { useEffect, useContext } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { EditorContext } from '@/app/projects/[id]/editor/editor-context';

/**
 * Custom hook that provides drag functionality using dnd-kit
 */
export default function useDraggableBlock(
  id: number,
  isWorkbenchBlock: boolean,
  top: number,
  left: number
) {
  const { updateWorkbenchBlockFieldById } = useContext(EditorContext)!;
  const { attributes, listeners, setNodeRef, transform, node } = useDraggable({
    id: id,
  });

  // We need to calculate the workbench blocks position at render-time
  useEffect(() => {
    if (isWorkbenchBlock) {
      const offset = node.current?.getBoundingClientRect();
      updateWorkbenchBlockFieldById(id, { coords: offset });
    }
  }, []);

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    top: isWorkbenchBlock ? 0 : top,
    left: isWorkbenchBlock ? 0 : left,
    position: isWorkbenchBlock ? 'static' : 'absolute',
    zIndex: isWorkbenchBlock ? '2' : '0',
    cursor: 'grab',
  };

  return { attributes, listeners, setNodeRef, style };
}
