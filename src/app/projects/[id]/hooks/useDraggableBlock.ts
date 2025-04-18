import { useDraggable } from '@dnd-kit/core';
import { BlockState, BlockType } from '../blocks/types';

/**
 * Custom hook that provides drag functionality using dnd-kit
 */
export default function useDraggableBlock(
  id: string,
  isWorkbenchBlock: boolean,
  top: number,
  left: number,
  state: BlockState,
  draggedGroupBlockIds: Set<string> | null,
  blockType: BlockType
) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: id,
  });

  const getPosition = () => {
    if (isWorkbenchBlock || state === BlockState.Nested) return 'static';
    return 'absolute';
  };

  const getZIndex = () => {
    if (draggedGroupBlockIds?.has(id)) return 100; // Keep dragged blocks always at the front
    return 0;
  };

  const getOpacity = () => {
    if (!isWorkbenchBlock && top === 0 && left === 0) return 0;
    return 1;
  };

  const getBackgroundColor = () => {
    switch (blockType) {
      case BlockType.Empty:
        return '#4C97FF';
      case BlockType.Variable:
        return '#9966FF';
      default:
        return '#FF8C1A';
    }
  };

  const getBoxShadow = () => {
    if (state === BlockState.Selected) {
      return `0 0 0 3px #FFD166, 0 2px 0 rgba(0,0,0,0.2)`;
    }
  };

  const style: React.CSSProperties = {
    top: isWorkbenchBlock ? 0 : top,
    left: isWorkbenchBlock ? 0 : left,
    position: getPosition(),
    zIndex: getZIndex(),
    opacity: getOpacity(),
    backgroundColor: getBackgroundColor(),
    boxShadow: getBoxShadow(),
  };

  return { attributes, listeners, setNodeRef, style };
}
