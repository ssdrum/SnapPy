/* This HOC wraps all blocks to provide draggable functionallity */

import useDraggableBlock from '../hooks/useDraggableBlock';
import { Block, BlockState, BlockType } from '../blocks/types';
import { useBlocks } from '../contexts/blocks-context';
import classes from '../blocks/blocks.module.css';

// Base props that all draggable blocks will have
export interface DraggableBlockProps {
  id: string;
  top: number;
  left: number;
  blockType: BlockType;
  state: BlockState;
  isWorkbenchBlock: boolean;
  parentId?: string;
  children?: Block[];
}

export default function withDraggableBlock<T extends object>(
  WrappedBlock: React.ComponentType<T>
) {
  const WithDraggable = (props: T & DraggableBlockProps) => {
    const {
      id,
      top,
      left,
      blockType,
      state,
      isWorkbenchBlock,
      parentId,
      children,
      ...restProps
    } = props;
    const { selectBlockAction, deselectBlockAction } = useBlocks();

    // Add dnd functionality
    const { attributes, listeners, setNodeRef, style } = useDraggableBlock(
      id,
      isWorkbenchBlock,
      top,
      left,
      state,
      blockType
    );

    return (
      // dnd-kit setup
      <div
        ref={setNodeRef}
        className={classes.base} // Static CSS
        style={style} // Dynamic CSS (bg color etc)
        {...listeners}
        {...attributes}
        onClick={() => {
          deselectBlockAction(); // Deselect previous selection before making new selection
          if (!isWorkbenchBlock) {
            selectBlockAction(id);
          }
        }}
      >
        <WrappedBlock
          id={id}
          isWorkbenchBlock={isWorkbenchBlock}
          parentId={parentId}
          children={children}
          {...(restProps as T)}
        />
      </div>
    );
  };

  return WithDraggable;
}
