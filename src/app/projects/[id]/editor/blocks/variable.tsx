import React, { useRef, useEffect } from 'react';
import withDraggableBlock from '../components/with-draggable-block';
import { useBlocks } from '../contexts/blocks-context';
import { resizeSelect } from '../utils/utils';
import classes from './blocks.module.css';
import { Block } from './types';
import InnerDropZone from '../components/inner-drop-zone';

interface VariableProps {
  id: string;
  isWorkbenchBlock: boolean;
  selected: string;
  children: Block[];
}

function Variable({ id, isWorkbenchBlock, selected, children }: VariableProps) {
  const { changeVariableSelectedOptionAction, state } = useBlocks();

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
      <span>Set</span>
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
      <span>to</span>

      <InnerDropZone id={`expression_${id}`} enabled={!isWorkbenchBlock}>
        {children}
      </InnerDropZone>
    </>
  );
}

export default withDraggableBlock(Variable);
