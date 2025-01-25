import React, { Dispatch, SetStateAction, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Block } from './types';

interface VariableProps {
  id: number;
  top: number;
  left: number;
  isWorkbenchBlock: boolean;
  setCanvasBlocks: Dispatch<SetStateAction<Block[]>> | null;
}

export default function Variable({
  id,
  top,
  left,
  isWorkbenchBlock,
  setCanvasBlocks,
}: VariableProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  // State of input boxes
  const [name, setName] = useState('');
  const [value, setValue] = useState('');

  // Updates the name of the variable both in its state and in the editor'state
  const handleChangeName = (id: number, name: string) => {
    setName(name);

    // TODO: check for invalid names. (maybe with regex?)

    if (setCanvasBlocks) {
      setCanvasBlocks((prevBlocks) =>
        prevBlocks.map((block) =>
          block.id === id
            ? {
                ...block,
                name: name,
              }
            : block
        )
      );
    }
  };

  // Updates the value of the variable both in its state and in the editor'state
  const handleChangeValue = (id: number, value: string) => {
    setValue(value);

    // TODO: check for invalid values. (maybe with regex?)

    if (setCanvasBlocks) {
      setCanvasBlocks((prevBlocks) =>
        prevBlocks.map((block) =>
          block.id === id
            ? {
                ...block,
                value: value,
              }
            : block
        )
      );
    }
  };

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    top: isWorkbenchBlock ? 0 : top,
    left: isWorkbenchBlock ? 0 : left,
    position: isWorkbenchBlock ? 'static' : 'absolute', // Blocks in canvas must be positioned absolutely
    zIndex: isWorkbenchBlock ? '2' : '0',
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
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
            value={name}
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
            value={value}
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
    </div>
  );
}
