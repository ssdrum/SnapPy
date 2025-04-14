import { useEffect, useRef } from 'react';
import withBlock from '../components/with-block';
import { useBlocks } from '../contexts/blocks-context';
import classes from './blocks.module.css';
import { resizeInput } from '../utils/utils';
import { IconQuote } from '@tabler/icons-react';

interface StringProps {
  id: string;
  isWorkbenchBlock: boolean;
  value: string;
}

function String({ id, isWorkbenchBlock, value }: StringProps) {
  const { changeInputTextAction } = useBlocks();

  const inputRef = useRef<HTMLInputElement>(null);
  const hiddenRef = useRef<HTMLSpanElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeInputTextAction(id, e.target.value, isWorkbenchBlock);
    resizeInput(inputRef, hiddenRef);
  };

  useEffect(() => {
    resizeInput(inputRef, hiddenRef);
  }, []);

  return (
    <>
      <span>
        <IconQuote size={15} color={'white'} stroke={2.5} />
      </span>
      <input
        ref={inputRef}
        type='text'
        className={classes.inputText}
        onChange={handleChange}
        placeholder=''
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
        {value || ''}
      </span>
      <span>
        <IconQuote size={15} color={'white'} stroke={2.5} />
      </span>
    </>
  );
}

export default withBlock(String);
