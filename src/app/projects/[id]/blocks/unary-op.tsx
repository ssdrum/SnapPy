import InnerDropZone from '../components/inner-drop-zone';
import withBlock from '../components/with-block';
import { Block, LogicalOperator } from './types';
import classes from './blocks.module.css';

interface UnaryOpProps {
  id: string;
  isWorkbenchBlock: boolean;
  operator: LogicalOperator.Not;
  children: {
    operand: Block[];
  };
}

function UnaryOp({ id, isWorkbenchBlock, operator, children }: UnaryOpProps) {
  return (
    <div className={classes.binaryOpContainer}>
      {operator}
      <InnerDropZone
        id={`operand_${id}`}
        enabled={!isWorkbenchBlock}
        enableSequences={false}
      >
        {children.operand}
      </InnerDropZone>
    </div>
  );
}

export default withBlock(UnaryOp);
