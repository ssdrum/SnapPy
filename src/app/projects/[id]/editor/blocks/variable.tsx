import React, { useRef, useEffect } from 'react';
import withDraggableBlock from '../components/with-draggable-block';
import { useBlocks } from '../contexts/blocks-context';
import { DataType, VariableValue } from './types';
import { resizeSelect } from '../utils/utils';

interface VariableProps {
  id: string;
  isWorkbenchBlock: boolean;
  variables: string[];
  selected: string;
  dataType: DataType;
  value: VariableValue; // Might move this to its own block
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

  const selectStyle: React.CSSProperties = {
    background: '#7A4DD6', // Slightly darker than the block background
    color: 'white',
    border: 'none',
    borderRadius: '2px',
    padding: '2px 4px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '14px',
    outline: 'none',
  };

  return (
    <>
      Set
      <select
        ref={selectRef}
        value={selected}
        onChange={handleChange}
        style={selectStyle}
      >
        {variables.map((variable) => (
          <option key={variable} value={variable}>
            {variable}
          </option>
        ))}
      </select>
      to
    </>
  );
}

export default withDraggableBlock(Variable);
