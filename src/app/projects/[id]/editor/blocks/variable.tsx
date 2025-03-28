import React, { useRef, useEffect } from 'react';
import withDraggableBlock from '../components/with-draggable-block';
import { useBlocks } from '../contexts/blocks-context';
import { resizeSelect } from '../utils/utils';
import classes from './blocks.module.css';
import { useDroppable } from '@dnd-kit/core';
import { Block } from './types';
import BlocksRenderer from '../components/blocks-renderer';

interface VariableProps {
  id: string;
  isWorkbenchBlock: boolean;
  selected: string;
  children: Block[];
}

function Variable({ id, isWorkbenchBlock, selected, children }: VariableProps) {
  console.log(children);
  const { changeVariableSelectedOptionAction, state } = useBlocks();

  // Set up the drop zone
  const { setNodeRef } = useDroppable({
    id: `drop-${id}`,
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (isWorkbenchBlock) {
      changeVariableSelectedOptionAction(e.target.value);
    } else {
      changeVariableSelectedOptionAction(e.target.value, id);
    }
  };

  // Resize select when component mounts or selected option changes
  const selectRef = useRef<HTMLSelectElement>(null); // This ref targets the select box
  useEffect(() => {
    resizeSelect(selectRef);
  }, [selected, state.variables]);

  return (
    <>
      Set
      <select
        ref={selectRef}
        value={selected}
        onChange={handleChange}
        className={classes.select}
        style={{ background: '#7A4DD6' }}
      >
        {/* Display options */}
        {state.variables.map((variable) => (
          <option key={variable} value={variable}>
            {variable}
          </option>
        ))}
      </select>
      to
      {/* Only display children if this block has any. Display dropzone by default */}
      <div
        ref={children.length == 0 ? setNodeRef : undefined} // Only add droppable area if there's no children
        className={classes.snapTarget}
      >
        {children && <BlocksRenderer blocks={children} />}
      </div>
    </>
  );
}

export default withDraggableBlock(Variable);
