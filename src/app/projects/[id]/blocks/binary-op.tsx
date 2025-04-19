import InnerDropZone, {
  InnderDropzoneShape,
} from '../components/inner-drop-zone';
import withBlock from '../components/with-block';
import {
  Block,
  ComparisonOperator,
  LogicalOperator,
  MathOperator,
} from './types';
import { OperatorIcon } from './operator-icon';
import classes from './blocks.module.css';

interface BinaryOpProps {
  id: string;
  isWorkbenchBlock: boolean;
  operator:
    | MathOperator
    | ComparisonOperator
    | LogicalOperator.And
    | LogicalOperator.Or;
  children: {
    left: Block[];
    right: Block[];
  };
}

function BinaryOp({ id, isWorkbenchBlock, operator, children }: BinaryOpProps) {
  const isMathOrComparisonOp =
    Object.values(MathOperator).includes(operator as MathOperator) ||
    Object.values(ComparisonOperator).includes(operator as ComparisonOperator);

  return (
    <div className={classes.binaryOpContainer}>
      <InnerDropZone
        id={`left_${id}`}
        shape={InnderDropzoneShape.Round}
        enabled={!isWorkbenchBlock}
        enableSequences={false}
      >
        {children.left}
      </InnerDropZone>
      {isMathOrComparisonOp ? <OperatorIcon operator={operator} /> : operator}
      <InnerDropZone
        id={`right_${id}`}
        shape={InnderDropzoneShape.Round}
        enabled={!isWorkbenchBlock}
        enableSequences={false}
      >
        {children.right}
      </InnerDropZone>
    </div>
  );
}

export default withBlock(BinaryOp);
