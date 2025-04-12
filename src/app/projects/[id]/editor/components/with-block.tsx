import React from 'react';
import {
  BlockChildren,
  BlockState,
  BlockType,
  OuterDropzonePosition,
} from '../blocks/types';
import classes from '../blocks/blocks.module.css';
import { useBlocks } from '../contexts/blocks-context';
import OuterDropZone from './outer-drop-zone';
import { useDraggable } from '@dnd-kit/core';

// Base props that for all blocks
export interface WithBlockProps {
  id: string;
  isWorkbenchBlock: boolean;
  hasPrev: boolean;
  blockType: BlockType;
  blockState: BlockState;
  enableSequences: boolean;
  children: BlockChildren | null;
}

export default function withBlock<T extends object>(
  WrappedBlock: React.ComponentType<T>
) {
  const WithBlock = (props: T & WithBlockProps) => {
    const {
      id,
      isWorkbenchBlock,
      hasPrev,
      blockType,
      blockState,
      enableSequences,
      children,
      ...restProps
    } = props;

    const { state, selectBlockAction, deselectBlockAction } = useBlocks();

    const getBGColor = () => {
      switch (blockType) {
        case BlockType.ProgramStart:
          return '#FFD000'; // Yellow
        case BlockType.Variable:
          return '#9966FF'; // Violet
        case BlockType.While:
          return '#FF8C1A'; // Orange
        case BlockType.Number:
        case BlockType.Math:
        case BlockType.Boolean:
          return '#59C059'; // Green
        default:
          return '#4C97FF'; // Blue
      }
    };

    const getBoxShadow = () => {
      if (blockState === BlockState.Selected) {
        return `0 0 0 5px #FFD166, 0 2px 0 rgba(0,0,0,0.2)`;
      }
    };

    const { attributes, listeners, setNodeRef } = useDraggable({
      id: id,
    });

    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={{ position: 'relative' }}
      >
        {!isWorkbenchBlock &&
          !state.draggedGroupBlockIds?.has(id) &&
          !hasPrev &&
          enableSequences && (
            <OuterDropZone blockId={id} position={OuterDropzonePosition.Top} />
          )}

        <div
          className={classes.base}
          style={{
            backgroundColor: getBGColor(),
            boxShadow: getBoxShadow(),
          }}
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
            {...(restProps as T)}
          >
            {children}
          </WrappedBlock>
        </div>

        {!isWorkbenchBlock &&
          !state.draggedGroupBlockIds?.has(id) &&
          enableSequences && (
            <OuterDropZone
              blockId={id}
              position={OuterDropzonePosition.Bottom}
            />
          )}
      </div>
    );
  };

  return WithBlock;
}
