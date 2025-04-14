import InnerDropZone from '../components/inner-drop-zone';
import withBlock from '../components/with-block';
import { Block, ComparisonOperator, MathOperator } from './types';
import { OperatorIcon } from './operator-icon';
import classes from './blocks.module.css';

interface BinaryOpProps {
  id: string;
  isWorkbenchBlock: boolean;
  operator: MathOperator | ComparisonOperator;
  children: {
    left: Block[];
    right: Block[];
  };
}

function BinaryOp({ id, isWorkbenchBlock, operator, children }: BinaryOpProps) {
  return (
    <div className={classes.binaryOpContainer}>
      <InnerDropZone
        id={`left_${id}`}
        enabled={!isWorkbenchBlock}
        enableSequences={false}
      >
        {children.left}
      </InnerDropZone>
      <OperatorIcon operator={operator} />
      <InnerDropZone
        id={`right_${id}`}
        enabled={!isWorkbenchBlock}
        enableSequences={false}
      >
        {children.right}
      </InnerDropZone>
    </div>
  );
}

export default withBlock(BinaryOp);
