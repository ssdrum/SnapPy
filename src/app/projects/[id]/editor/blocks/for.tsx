import InnerDropZone from '../components/inner-drop-zone';
import { Block } from './types';
import withBlock from '../components/with-block';

interface ForProps {
  id: string;
  isWorkbenchBlock: boolean;
  children: {
    expression: Block[];
    body: Block[];
  };
}

function For({ id, isWorkbenchBlock, children }: ForProps) {
  return (
    <div style={{ minWidth: '100px' }}>
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '10px',
          alignItems: 'center',
        }}
      >
        <span>repeat</span>
        {
          <InnerDropZone
            id={`expression_${id}`}
            enabled={!isWorkbenchBlock}
            enableSequences={false}
          >
            {children.expression}
          </InnerDropZone>
        }
        <span>times</span>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span>do</span>
        {
          <InnerDropZone
            id={`body_${id}`}
            enabled={!isWorkbenchBlock}
            enableSequences={true}
          >
            {children.body}
          </InnerDropZone>
        }
      </div>
    </div>
  );
}

export default withBlock(For);
