import InnerDropZone from '../components/inner-drop-zone';
import withBlock from '../components/with-block';
import { Block, MathOperator } from './types';

interface MathProps {
  id: string;
  isWorkbenchBlock: boolean;
  operator: MathOperator;
  children: {
    left: Block[];
    right: Block[];
  };
}

function Math({ id, isWorkbenchBlock, operator, children }: MathProps) {
  return (
    <>
      <InnerDropZone
        id={`left_${id}`}
        enabled={!isWorkbenchBlock}
        enableSequences={false}
      >
        {children.left}
      </InnerDropZone>

      <span>{operator}</span>

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

export default withBlock(Math);
