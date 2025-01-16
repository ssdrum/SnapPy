import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

// Draggable boxes
interface VariableProps {
  id: number;
  top: number;
  left: number;
  zIndex: number;
}

const Variable: React.FC<VariableProps> = ({ id, top, left, zIndex }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  /* Just taking strings for simplicity at the moment */
  const [name, setName] = useState('');
  const [value, setValue] = useState('');

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    top: top,
    left: left,
    position: 'absolute',
    cursor: 'grab',
    zIndex: zIndex.toString(),
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <svg width='250' height='60' xmlns='http://www.w3.org/2000/svg'>
        {/* Little piece at the bottom */}
        <rect
          x='25'
          y='40'
          width='20'
          height='20'
          rx='5'
          ry='5'
          fill='lightblue'
        />

        {/* Main block shape */}
        <rect
          x='0'
          y='0'
          width='250'
          height='50'
          rx='10'
          ry='10'
          fill='lightblue'
        />

        <text x='20' y='35' fontSize='20' fill='black'>
          Set
        </text>

        {/* Input field for variable name */}
        <foreignObject x='50' y='10' width='50' height='30' data-no-dnd='true'>
          <input
            type='text'
            placeholder='a'
            value={name}
            onChange={(e) => setName(e.target.value)}
            onClick={(e) => console.log(e)}
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
            type='text'
            placeholder='0'
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '4px',
              border: '1px solid gray',
              padding: '4px',
            }}
          />
        </foreignObject>

        {/* Little piece at the top */}
        <rect
          x='25'
          y='-10'
          width='20'
          height='20'
          rx='5'
          ry='5'
          fill='white'
        />
      </svg>
    </div>
  );
};

export default Variable;
