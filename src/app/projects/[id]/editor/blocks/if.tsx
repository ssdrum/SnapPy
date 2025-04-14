import InnerDropZone from '../components/inner-drop-zone';
import { Block } from './types';
import withBlock from '../components/with-block';

interface IfProps {
  id: string;
  isWorkbenchBlock: boolean;
  children: {
    condition: Block[];
    body: Block[];
  };
}

function If({ id, isWorkbenchBlock, children }: IfProps) {
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
        <span>if</span>
        {
          <InnerDropZone
            id={`condition_${id}`}
            enabled={!isWorkbenchBlock}
            enableSequences={false}
          >
            {children.condition}
          </InnerDropZone>
        }
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

export default withBlock(If);
