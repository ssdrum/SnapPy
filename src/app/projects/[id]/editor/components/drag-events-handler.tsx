import {
  DragEndEvent,
  //DragOverEvent,
  DragStartEvent,
  useDndMonitor,
} from '@dnd-kit/core';
import { findBlockById } from '../utils/utils';
import { useBlocks } from '../contexts/blocks-context';
//import { StackPosition } from '../blocks/types';

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
    createAndDragBlockAction,
    deleteBlockAction,
    //addChildBlockAction,
    //removeChildBlockAction,
    //stackBlockAction,
    //breakStackAction,
    //highlightDropzoneAction,
    //clearHighlightedDropzoneAction,
    state,
  } = useBlocks();

  const handleDragStart = (e: DragStartEvent) => {
    // First de-select any previously selected block
    deselectBlockAction();

    const id = e.active.id.toString();
    const isWorkbenchBlock = findBlockById(state.workbench, id) !== null;

    // If dragging a block from the workbench, create and drag
    if (isWorkbenchBlock) {
      createAndDragBlockAction(id);
      return; // Exit early for workbench blocks
    }

    // For existing canvas blocks:
    const draggedBlock = findBlockById(state.canvas, id);
    if (!draggedBlock) return;
    //
    //// If dragging a nested block, remove child block from parent
    //if (draggedBlock.parentId) {
    //  removeChildBlockAction(id, draggedBlock.parentId);
    //}
    //
    //// If dragging a block with a prev block, unsnap
    //if (draggedBlock.prevId) {
    //  breakStackAction(id);
    //}
    //
    startDragAction(id);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { over, active, delta } = e;

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

    //  // Handle drop on another block (nesting)
    //  const [prefix, targetBlockId] = overId.split('_');
    //  if (
    //    prefix === 'expression' ||
    //    prefix === 'condition' ||
    //    prefix === 'body'
    //  ) {
    //    // Prevent dropping onto itself
    //    if (activeId === targetBlockId) {
    //      endDragAction();
    //      return;
    //    }
    //
    //    addChildBlockAction(activeId, targetBlockId, prefix);
    //    return;
    //  }
    //
    //  // Handle drop on another block (nesting)
    //  if (overId.startsWith('stack')) {
    //    const [_, position, targetId] = overId.split('_');
    //    stackBlockAction(
    //      activeId,
    //      targetId,
    //      position === 'top' ? StackPosition.Top : StackPosition.Bottom
    //    );
    //    return;
    //  }
    //
    // Default case - delete the block
    deleteBlockAction(activeId);
  };

  //const handleDragOver = (e: DragOverEvent) => {
  //  const { over } = e;
  //  if (!over) return;
  //
  //  // If we're dragging over an element with ID that starts with "drop", highlight the drop zone
  //  const id = over.id.toString();
  //  const [prefix, _] = id.split('_');
  //  if (
  //    prefix === 'expression' ||
  //    prefix === 'condition' ||
  //    prefix === 'body'
  //  ) {
  //    highlightDropzoneAction(id);
  //  }
  //
  //  if (state.highlightedDropZoneId) {
  //    clearHighlightedDropzoneAction();
  //  }
  //};

  useDndMonitor({
    onDragStart(e) {
      handleDragStart(e);
    },
    onDragEnd(e) {
      handleDragEnd(e);
    },
    //onDragOver(e) {
    //  //handleDragOver(e);
    //},
  });

  return <>{children}</>;
}
