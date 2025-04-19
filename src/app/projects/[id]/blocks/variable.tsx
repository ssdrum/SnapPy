import React, { useRef, useEffect } from 'react';
import { Block } from './types';
import { useBlocks } from '../contexts/blocks-context';
import { resizeSelect } from '../utils/utils';
import classes from './blocks.module.css';
import InnerDropZone, {
  InnderDropzoneShape,
} from '../components/inner-drop-zone';
import withBlock from '../components/with-block';

interface VariableProps {
  id: string;
  isWorkbenchBlock: boolean;
  selected: string;
  children: { expression: Block[] };
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
      <span>set</span>
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
      <span>to</span>

      {
        <InnerDropZone
          id={`expression_${id}`}
          shape={InnderDropzoneShape.Round}
          enabled={!isWorkbenchBlock}
          enableSequences={false}
        >
          {children.expression}
        </InnerDropZone>
      }
    </>
  );
}

export default withBlock(Variable);
