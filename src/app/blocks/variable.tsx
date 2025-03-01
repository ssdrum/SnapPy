import React, { useState, useContext } from 'react';
import { VariableBlock } from './types';
import { EditorContext } from '@/app/projects/[id]/editor/editor-context';
import withDraggableBlock from './with-draggable-block';

interface VariableProps {
  id: number;
  isWorkbenchBlock: boolean;
  name: string | null;
  value: string | null;
}

function Variable({ id, isWorkbenchBlock, name, value }: VariableProps) {
  const { updateCanvasBlockFieldById } = useContext(EditorContext)!;

  // State of input boxes
  const [variableName, setVariableName] = useState(name ?? '');
  const [variableValue, setVariableValue] = useState(value ?? '');

  // TODO: check for invalid names. (maybe with regex?)
  const handleChangeName = (id: number, newName: string) => {
    setVariableName(newName);
    updateCanvasBlockFieldById<VariableBlock>(id, { name: newName });
  };

  const handleChangeValue = (id: number, newValue: string) => {
    setVariableValue(newValue);
    updateCanvasBlockFieldById<VariableBlock>(id, { value: newValue });
  };

  return (
    <svg width='250' height='60' xmlns='http://www.w3.org/2000/svg'>
      {/* Main block shape */}
      <rect
        x='0'
        y='0'
        width='250'
        height='50'
        rx='10'
        ry='10'
        fill='lightblue'
        stroke='grey'
        strokeWidth='1'
      />

      <text x='20' y='35' fontSize='20' fill='black'>
        Set
      </text>

      {/* Input field for variable name */}
      <foreignObject x='50' y='10' width='50' height='30' data-no-dnd='true'>
        <input
          disabled={isWorkbenchBlock}
          type='text'
          placeholder='a'
          value={variableName}
          onChange={(e) => handleChangeName(id, e.target.value)}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '4px',
            border: '1px solid gray',
            padding: '4px',
          }}
        />
      </foreignObject>

      <text x='120' y='35' fontSize='20' fill='black'>
        to
      </text>

      {/* Input field for variable value */}
      <foreignObject x='150' y='10' width='50' height='30'>
        <input
          disabled={isWorkbenchBlock}
          type='text'
          placeholder='0'
          value={variableValue}
          onChange={(e) => handleChangeValue(id, e.target.value)}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '4px',
            border: '1px solid gray',
            padding: '4px',
          }}
        />
      </foreignObject>
    </svg>
  );
}

export default withDraggableBlock(Variable);
