import React, { useRef, useEffect } from 'react';
import withDraggableBlock from '../components/with-draggable-block';
import { useBlocks } from '../contexts/blocks-context';
import { resizeSelect } from '../utils/utils';
import classes from './blocks.module.css';

interface VariableProps {
  id: string;
  isWorkbenchBlock: boolean;
  variables: string[];
  selected: string;
}

function Variable({
  id,
  isWorkbenchBlock,
  variables,
  selected,
}: VariableProps) {
  const { changeVariableSelectedOptionAction } = useBlocks();
  const selectRef = useRef<HTMLSelectElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (isWorkbenchBlock) {
      changeVariableSelectedOptionAction(e.target.value);
    } else {
      changeVariableSelectedOptionAction(e.target.value, id);
    }
  };

  // Resize select when component mounts or selected option changes
  useEffect(() => {
    resizeSelect(selectRef);
  }, [selected, variables]);

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
        {variables.map((variable) => (
          <option key={variable} value={variable}>
            {variable}
          </option>
        ))}
      </select>
      to
      <div className={classes.snapTarget}></div>
    </>
  );
}

export default withDraggableBlock(Variable);
