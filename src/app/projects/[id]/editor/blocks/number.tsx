import { useEffect, useRef } from 'react';
import withBlock from '../components/with-block';
import { useBlocks } from '../contexts/blocks-context';
import classes from './blocks.module.css';
import { resizeInput } from '../utils/utils';

interface NumberProps {
  id: string;
  isWorkbenchBlock: boolean;
  value: string;
}

function Number({ id, isWorkbenchBlock, value }: NumberProps) {
  const { changeInputTextAction } = useBlocks();

  const inputRef = useRef<HTMLInputElement>(null);
  const hiddenRef = useRef<HTMLSpanElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only digits with no leading zeros (unless it's just "0")
    const isValid = /^(0|[1-9]\d*)$/.test(value);

    if (isValid || value === '') {
      changeInputTextAction(id, e.target.value, isWorkbenchBlock);
      resizeInput(inputRef, hiddenRef);
    }
  };

  useEffect(() => {
    resizeInput(inputRef, hiddenRef);
  }, []);

  return (
    <>
      <input
        ref={inputRef}
        type='text'
        className={classes.inputText}
        onChange={handleChange}
        placeholder='0'
        value={value}
      />
      <span // Reference: https://stackoverflow.com/questions/8100770/auto-scaling-inputtype-text-to-width-of-value
        ref={hiddenRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          whiteSpace: 'pre',
          font: 'inherit',
          padding: '0',
          border: '0',
        }}
      >
        {value || '0'}
      </span>
    </>
  );
}

export default withBlock(Number);
