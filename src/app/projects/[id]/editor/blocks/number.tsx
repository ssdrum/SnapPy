import withBlock from '../components/with-block';
import { useBlocks } from '../contexts/blocks-context';
import classes from './blocks.module.css';

interface NumberProps {
  id: string;
  isWorkbenchBlock: boolean;
  value: string;
}

function Number({ id, isWorkbenchBlock, value }: NumberProps) {
  const { changeInputTextAction } = useBlocks();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only digits with no leading zeros (unless it's just "0")
    const isValid = /^(0|[1-9]\d*)$/.test(value);

    if (isValid || value === '') {
      changeInputTextAction(id, e.target.value, isWorkbenchBlock);
    }
  };

  return (
    <input
      type='text'
      className={classes.inputText}
      onChange={handleChange}
      placeholder='0'
      value={value}
    />
  );
}

export default withBlock(Number);
