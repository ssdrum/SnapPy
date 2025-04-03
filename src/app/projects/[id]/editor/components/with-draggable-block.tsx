import React from 'react';
import useDraggableBlock from '../hooks/useDraggableBlock';
import { Block, BlockState, BlockType, StackOptions } from '../blocks/types';
import { useBlocks } from '../contexts/blocks-context';
import classes from '../blocks/blocks.module.css';
import OuterDropZone from './outer-drop-zone';

// Base props that all draggable blocks will have
export interface DraggableBlockProps {
  id: string;
  top: number;
  left: number;
  blockType: BlockType;
  blockState: BlockState;
  isWorkbenchBlock: boolean;
  stackOptions: StackOptions;
  parentId: string | null;
  children: Block[];
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
      blockState,
      isWorkbenchBlock,
      parentId,
      children,
      ...restProps
    } = props;

    const { selectBlockAction, deselectBlockAction, state } = useBlocks();

    // Add dnd functionality
    const { attributes, listeners, setNodeRef, style } = useDraggableBlock(
      id,
      isWorkbenchBlock,
      top,
      left,
      blockState,
      blockType
    );

    // Split style properties
    const { backgroundColor, boxShadow, ...positionStyle } = style;

    return (
      // dnd-kit setup - outer container with positioning
      <div ref={setNodeRef} style={positionStyle} {...attributes}>
        {/* Wrapper needed for absolute positioning context */}
        <div style={{ position: 'relative' }}>
          {!isWorkbenchBlock && !state.dragGroupBlockIds?.has(id) && (
            <OuterDropZone blockId={id} position='top' />
          )}

          <div
            className={classes.base}
            style={{ backgroundColor, boxShadow }}
            {...listeners}
            onClick={() => {
              deselectBlockAction();
              if (!isWorkbenchBlock) {
                selectBlockAction(id);
              }
            }}
          >
            <WrappedBlock
              id={id}
              isWorkbenchBlock={isWorkbenchBlock}
              parentId={parentId}
              {...(restProps as T)}
            >
              {children}
            </WrappedBlock>
          </div>

          {!isWorkbenchBlock && !state.dragGroupBlockIds?.has(id) && (
            <OuterDropZone blockId={id} position='bottom' />
          )}
        </div>
      </div>
    );
  };

  return WithDraggable;
}
