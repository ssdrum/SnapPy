import InnerDropZone from '../components/inner-drop-zone';
import withBlock from '../components/with-block';
import { Block, ComparisonOperator } from './types';

interface ComparisonProps {
  id: string;
  isWorkbenchBlock: boolean;
  operator: ComparisonOperator;
  children: {
    left: Block[];
    right: Block[];
  };
}

function Comparison({
  id,
  isWorkbenchBlock,
  operator,
  children,
}: ComparisonProps) {
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

export default withBlock(Comparison);
