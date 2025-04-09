import { DragEndEvent, DragStartEvent, useDndMonitor } from '@dnd-kit/core';
import { findBlockById } from '../utils/utils';
import { useBlocks } from '../contexts/blocks-context';
import { OuterDropzonePosition } from '../blocks/types';

interface DragEventsHandlerProps {
  children: React.ReactNode;
}

export default function DragEventsHandler({
  children,
}: DragEventsHandlerProps) {
  const {
    startDragAction,
    endDragAction,
    deselectBlockAction,
    createBlockAction,
    deleteBlockAction,
    addChildBlockAction,
    removeChildBlockAction,
    snapBlockAction,
    unsnapBlockAction,
    state,
  } = useBlocks();

  const handleDragStart = (e: DragStartEvent) => {
    // First de-select any previously selected block
    deselectBlockAction();

    const id = e.active.id.toString();
    const isWorkbenchBlock = findBlockById(id, state.workbench) !== null;

    // If dragging a block from the workbench, create and drag
    if (isWorkbenchBlock) {
      createBlockAction(id);
      return; // Exit early for workbench blocks
    }

    // For existing canvas blocks:
    const draggedBlock = findBlockById(id, state.canvas);
    if (!draggedBlock) return;

    // If dragging a nested block, remove child block from parent
    if (draggedBlock.parentId) {
      removeChildBlockAction(id, draggedBlock.parentId);
    }

    // If dragging a block with a prev block, unsnap
    if (draggedBlock.prevId) {
      unsnapBlockAction(id);
    }

    startDragAction(id);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { over, active, delta } = e;

    // Exit early if not dropped on a valid target
    if (!over) {
      return;
    }

    const overId = over.id.toString();
    const tokens = overId.split('_');
    const activeId = active.id.toString();

    // Handle drop on canvas
    if (overId === 'canvas') {
      endDragAction(delta);
      return;
    }

    // Handle drop on another block (nesting)
    const [prefix, targetBlockId] = overId.split('_');
    if (
      prefix === 'expression' ||
      prefix === 'condition' ||
      prefix === 'body'
    ) {
      // Prevent dropping onto itself
      if (activeId === targetBlockId) {
        return;
      }

      addChildBlockAction(activeId, targetBlockId, prefix);
      return;
    }

    // Handle block snaps
    if (tokens[0] === 'snap') {
      const [_, position, targetId] = tokens;
      snapBlockAction(
        activeId,
        targetId,
        position === 'top'
          ? OuterDropzonePosition.Top
          : OuterDropzonePosition.Bottom
      );
      return;
    }

    // Default case - delete the block
    deleteBlockAction(activeId);
  };

  useDndMonitor({
    onDragStart(e) {
      handleDragStart(e);
    },
    onDragEnd(e) {
      handleDragEnd(e);
    },
  });

  return <>{children}</>;
}
