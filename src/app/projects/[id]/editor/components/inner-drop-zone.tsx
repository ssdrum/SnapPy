import { Block } from '../blocks/types';
import { useDroppable } from '@dnd-kit/core';
import classes from '../blocks/blocks.module.css';
import CanvasBlocksRenderer from './canvas-blocks-renderer';
import { useBlocks } from '../contexts/blocks-context';

interface InnerDropZoneProps {
  id: string;
  enabled: boolean;
  enableSequences: boolean;
  children: Block[];
}

export default function InnerDropZone({
  id,
  enabled,
  enableSequences,
  children,
}: InnerDropZoneProps) {
  const { state } = useBlocks();
  const highlighted = state.highlightedDropZoneId === id;

  const { setNodeRef } = useDroppable({ id });

  if (children.length > 0) {
    return (
      <CanvasBlocksRenderer
        canvas={children}
        enableSequences={enableSequences}
      />
    );
  }

  return (
    <div
      ref={enabled ? setNodeRef : undefined}
      className={classes.innerDropzone}
      style={{ backgroundColor: highlighted ? '#FFD54F' : undefined }}
    />
  );
}
