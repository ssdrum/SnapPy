import React from 'react';
import { BlockChildren, BlockState, BlockType } from '../blocks/types';
import classes from '../blocks/blocks.module.css';
import { useBlocks } from '../contexts/blocks-context';

// Base props that for all blocks
export interface WithBlockProps {
  id: string;
  isWorkbenchBlock: boolean;
  blockType: BlockType;
  blockState: BlockState;
  children: BlockChildren | null;
}

export default function withBlock<T extends object>(
  WrappedBlock: React.ComponentType<T>
) {
  const WithBlock = (props: T & WithBlockProps) => {
    const {
      id,
      isWorkbenchBlock,
      blockType,
      blockState,
      children,
      ...restProps
    } = props;

    const { selectBlockAction, deselectBlockAction } = useBlocks();

    const getBGColor = () => {
      switch (blockType) {
        case BlockType.Variable:
          return '#9966FF'; // Violet
        case BlockType.While:
          return '#FF8C1A'; // Orange
        default:
          return '#4C97FF'; // Blue
      }
    };

    const getBoxShadow = () => {
      if (blockState === BlockState.Selected) {
        return `0 0 0 5px #FFD166, 0 2px 0 rgba(0,0,0,0.2)`;
      }
    };

    return (
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
    );
  };

  return WithBlock;
}
