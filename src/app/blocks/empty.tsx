import React from 'react';
import withDraggableBlock from '@/app/blocks/with-draggable-block';

// Create the base component without draggable functionality
function Empty() {
  return (
    <svg width='250' height='60' xmlns='http://www.w3.org/2000/svg'>
      <rect
        x='0'
        y='0'
        width='250'
        height='50'
        rx='10'
        ry='10'
        fill='grey'
        stroke='black'
        strokeWidth='1'
      />
    </svg>
  );
}

export default withDraggableBlock(Empty);
