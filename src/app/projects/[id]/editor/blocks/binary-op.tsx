import InnerDropZone from '../components/inner-drop-zone';
import withBlock from '../components/with-block';
import { Block, ComparisonOperator, MathOperator } from './types';

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
    <>
      <InnerDropZone
        id={`left_${id}`}
        enabled={!isWorkbenchBlock}
        enableSequences={false}
      >
        {children.left}
      </InnerDropZone>

      <span style={{ whiteSpace: 'nowrap' }}>{operator}</span>

      <InnerDropZone
        id={`right_${id}`}
        enabled={!isWorkbenchBlock}
        enableSequences={false}
      >
        {children.right}
      </InnerDropZone>
    </>
  );
}

export default withBlock(BinaryOp);
