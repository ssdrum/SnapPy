import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
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
  blockType: BlockType
) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    top: isWorkbenchBlock ? 0 : top,
    left: isWorkbenchBlock ? 0 : left,
    position: isWorkbenchBlock ? 'static' : 'absolute',
    zIndex: state === BlockState.Dragging ? '10' : isWorkbenchBlock ? '2' : '1',
    cursor: 'grab',
    width: 'fit-content', // Stops it from taking full width of parent container
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    color: 'white',
    fontWeight: 'bold',
    padding: '5px 12px',
    borderRadius: '3px',

    backgroundColor: (() => {
      switch (blockType) {
        case BlockType.Empty:
          return '#4C97FF';
        case BlockType.Variable:
          return '#9966FF';
        default:
          return '#FF8C1A';
      }
    })(),

    // 3D effect
    boxShadow: (() => {
      if (state === BlockState.Selected) {
        // Yellow outline (3px) + regular bottom shadow
        return `0 0 0 3px #FFD166, 0 2px 0 rgba(0,0,0,0.2)`;
        // Regular box shadow
      } else if (state === BlockState.Dragging) {
        return '0 5px 10px rgba(0,0,0,0.2)';
      }
    })(),

    transition: 'box-shadow 0.15s ease',
  };

  return { attributes, listeners, setNodeRef, style };
}
