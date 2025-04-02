import {
  DragEndEvent,
  DragMoveEvent,
  DragStartEvent,
  useDndMonitor,
} from '@dnd-kit/core';
import { findBlockById } from '../utils/utils';
import { useBlocks } from '../contexts/blocks-context';
import { StackPosition } from '../blocks/types';

export default function DragEventsHandler({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    startDragAction,
    moveBlockAction,
    endDragAction,
    deselectBlockAction,
    createAndDragBlockAction,
    deleteBlockAction,
    addChildBlockAction,
    removeChildBlockAction,
    stackBlockAction,
    breakStackAction,
    state,
  } = useBlocks();

  const handleDragStart = (e: DragStartEvent) => {
    // First de-select any previously selected block
    deselectBlockAction();

    const id = e.active.id.toString();
    const isWorkbenchBlock = findBlockById(state.workbenchBlocks, id) !== null;

    // If dragging a block from the workbench, create and drag
    if (isWorkbenchBlock) {
      createAndDragBlockAction(id);
      return; // Exit early for workbench blocks
    }

    // For existing canvas blocks:
    const draggedBlock = findBlockById(state.canvasBlocks, id);
    if (!draggedBlock) {
      return;
    }

    // If dragging a nested block, remove child block from parent
    if (draggedBlock.parentId) {
      removeChildBlockAction(id, draggedBlock.parentId);
    }

    // If dragging a block with a prev block, unsnap
    if (draggedBlock.prevBlockId) {
      breakStackAction(id);
    }

    startDragAction(id);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { over, delta, active } = e;

    // Exit early if not dropped on a valid target
    if (!over) {
      return;
    }

    const overId = over.id.toString();
    const activeId = active.id.toString();

    // Handle drop on canvas
    if (overId === 'canvas') {
      endDragAction(delta);
      return;
    }

    // Handle drop on another block (nesting)
    if (overId.startsWith('drop')) {
      const targetBlock = overId.substring(5);

      // Prevent dropping onto itself
      if (activeId === targetBlock) {
        endDragAction(delta);
        return;
      }

      addChildBlockAction(activeId, targetBlock);
      return;
    }

    // Handle drop on another block (nesting)
    if (overId.startsWith('stack')) {
      const [_, position, targetId] = overId.split('_');

      stackBlockAction(
        activeId,
        targetId,
        position === 'top' ? StackPosition.Top : StackPosition.Bottom
      );
      return;
    }

    // Default case - delete the block
    deleteBlockAction(activeId);
  };

  const handleDragMove = (e: DragMoveEvent) => {
    const { delta, active } = e;
    const activeId = active.id.toString();
    moveBlockAction(activeId, delta);
  };

  useDndMonitor({
    onDragStart(e) {
      handleDragStart(e);
    },
    onDragMove(e) {
      handleDragMove(e);
    },
    onDragEnd(e) {
      handleDragEnd(e);
    },
  });

  return <>{children}</>;
}
