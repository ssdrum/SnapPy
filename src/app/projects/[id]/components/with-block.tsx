import React from 'react';
import {
  BlockChildren,
  BlockShape,
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
  blockShape: BlockShape;
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
      blockShape,
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
        case BlockType.VariableValue:
          return '4px 10px ';
        case BlockType.ProgramStart:
          return '15px';
        default:
          return undefined;
      }
    };

    const getBGColor = () => {
      switch (blockType) {
        case BlockType.ProgramStart:
          return '#FFD966'; // Yellow
        case BlockType.While:
        case BlockType.For:
        case BlockType.If:
        case BlockType.IfElse:
          return '#4697E5'; // Blue
        case BlockType.Variable:
        case BlockType.VariableValue:
          return '#EE4D83'; //  Pink
        case BlockType.Number:
        case BlockType.Boolean:
          return '#6DC071'; //  Green
        case BlockType.Math:
          return '#FF8409'; //  Orange
        case BlockType.Comparison:
        case BlockType.Logical:
          return '#A374E4'; // Purple
        case BlockType.Print:
          return '#2CAEA2'; // Teal
        case BlockType.Empty:
        default:
          return '#EE4D83'; // Pink
      }
    };

    const getBoxShadow = () => {
      if (blockState === BlockState.Selected) {
        return `0 0 0 5px #FFD166, 0 2px 0 rgba(0,0,0,0.2)`;
      }
    };

    const getBorderRadius = () => {
      if (blockShape === BlockShape.Round) {
        return '100px';
      }
      if (blockType === BlockType.ProgramStart) {
        return '20px 20px 2px 2px ';
      }
      return '5px';
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
          enableSequences &&
          blockShape === BlockShape.Square && (
            <OuterDropZone blockId={id} position={OuterDropzonePosition.Top} />
          )}

        <div
          className={classes.base}
          style={{
            backgroundColor: getBGColor(),
            boxShadow: getBoxShadow(),
            padding: getPadding(),
            borderRadius: getBorderRadius(),
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
          enableSequences &&
          blockShape === BlockShape.Square && (
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
