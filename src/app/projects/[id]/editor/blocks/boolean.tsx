import withBlock from '../components/with-block';
import { useBlocks } from '../contexts/blocks-context';
import classes from './blocks.module.css';
import { BooleanValue } from './types';

interface BooleanProps {
  id: string;
  value: BooleanValue;
  isWorkbenchBlock: boolean;
}

function Boolean({ id, value, isWorkbenchBlock }: BooleanProps) {
  const { changeBooleanValueAction } = useBlocks();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeBooleanValueAction(
      id,
      e.target.value as BooleanValue,
      isWorkbenchBlock
    );
  };

  return (
    <select value={value} onChange={handleChange} className={classes.select}>
      {/* Display options */}
      <option key={BooleanValue.True} value={BooleanValue.True}>
        {BooleanValue.True}
      </option>
      <option key={BooleanValue.False} value={BooleanValue.False}>
        {BooleanValue.False}
      </option>
    </select>
  );
}

export default withBlock(Boolean);
