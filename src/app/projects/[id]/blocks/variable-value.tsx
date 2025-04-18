import React, { useRef, useEffect } from 'react';
import { useBlocks } from '../contexts/blocks-context';
import { resizeSelect } from '../utils/utils';
import classes from './blocks.module.css';
import withBlock from '../components/with-block';

interface VariableValueProps {
  id: string;
  isWorkbenchBlock: boolean;
  selected: string;
}

function VariableValue({ id, isWorkbenchBlock, selected }: VariableValueProps) {
  const { changeVariableValueSelectedOptionAction, state } = useBlocks();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeVariableValueSelectedOptionAction(
      id,
      e.target.value,
      isWorkbenchBlock
    );
  };

  // Resize select when component mounts or selected option changes
  const selectRef = useRef<HTMLSelectElement>(null); // This ref targets the select box
  useEffect(() => {
    resizeSelect(selectRef);
  }, [selected, state.variables]);

  return (
    <select
      ref={selectRef}
      value={selected}
      onChange={handleChange}
      className={classes.select}
    >
      {/* Display options */}
      {state.variables.map((variable) => (
        <option key={variable} value={variable}>
          {variable}
        </option>
      ))}
    </select>
  );
}

export default withBlock(VariableValue);
