import InnerDropZone, {
  InnderDropzoneShape,
} from '../components/inner-drop-zone';
import withBlock from '../components/with-block';
import { Block } from './types';
import classes from './blocks.module.css';

interface PrintProps {
  id: string;
  isWorkbenchBlock: boolean;
  children: {
    expression: Block[];
  };
}

function Print({ id, isWorkbenchBlock, children }: PrintProps) {
  return (
    <div className={classes.binaryOpContainer}>
      <span>print</span>
      <InnerDropZone
        id={`expression_${id}`}
        shape={InnderDropzoneShape.Round}
        enabled={!isWorkbenchBlock}
        enableSequences={false}
      >
        {children.expression}
      </InnerDropZone>
    </div>
  );
}

export default withBlock(Print);
