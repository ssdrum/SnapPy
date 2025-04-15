import InnerDropZone from '../components/inner-drop-zone';
import { Block } from './types';
import withBlock from '../components/with-block';

interface IfElseProps {
  id: string;
  isWorkbenchBlock: boolean;
  children: {
    condition: Block[];
    ifBody: Block[];
    elseBody: Block[];
  };
}

function IfElse({ id, isWorkbenchBlock, children }: IfElseProps) {
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

      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '10px',
          alignItems: 'center',
        }}
      >
        <span>then</span>
        {
          <InnerDropZone
            id={`ifBody_${id}`}
            enabled={!isWorkbenchBlock}
            enableSequences={true}
          >
            {children.ifBody}
          </InnerDropZone>
        }
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span>else</span>
        {
          <InnerDropZone
            id={`elseBody_${id}`}
            enabled={!isWorkbenchBlock}
            enableSequences={true}
          >
            {children.elseBody}
          </InnerDropZone>
        }
      </div>
    </div>
  );
}

export default withBlock(IfElse);
