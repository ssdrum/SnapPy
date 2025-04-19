import InnerDropZone, {
  InnderDropzoneShape,
} from '../components/inner-drop-zone';
import { Block } from './types';
import withBlock from '../components/with-block';

interface WhileProps {
  id: string;
  isWorkbenchBlock: boolean;
  children: {
    condition: Block[];
    body: Block[];
  };
}

function While({ id, isWorkbenchBlock, children }: WhileProps) {
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
        <span>while</span>
        {
          <InnerDropZone
            id={`condition_${id}`}
            shape={InnderDropzoneShape.Round}
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
            shape={InnderDropzoneShape.Square}
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

export default withBlock(While);
