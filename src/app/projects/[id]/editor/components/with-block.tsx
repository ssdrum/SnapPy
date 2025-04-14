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

    const getPadding = () => {
      switch (blockType) {
        case BlockType.Number:
        case BlockType.Boolean:
        case BlockType.Math:
        case BlockType.Comparison:
        case BlockType.Logical:
          return '4px';
        default:
          return undefined;
      }
    };

    const getBGColor = () => {
      switch (blockType) {
        case BlockType.ProgramStart:
          return '#FFD000'; // Yellow

        // Control flow blocks
        case BlockType.While:
          // case BlockType.For:
          // case BlockType.If:
          // case BlockType.IfElse:
          return '#FF8C1A'; // Orange

        // Variable-related blocks
        case BlockType.Variable:
          // case BlockType.VariableValue:
          return '#9966FF'; // Violet

        // Value blocks
        case BlockType.Number:
        case BlockType.Boolean:
          return '#59C059'; // Green

        // Math operations
        case BlockType.Math:
          return '#4C97FF'; // Blue

        // Logical operations
        case BlockType.Comparison:
        case BlockType.Logical:
          return '#FF6680'; // Pink/Red

        // Output blocks
        // case BlockType.Print:
        //   return '#40BF4A'; // Brighter green

        // Default/other blocks
        case BlockType.Empty:
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
            padding: getPadding(),
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
