import InnerDropZone, {
  InnderDropzoneShape,
} from '../components/inner-drop-zone';
import { Block } from './types';
import withBlock from '../components/with-block';

interface ElseProps {
  id: string;
  isWorkbenchBlock: boolean;
  children: {
    body: Block[];
  };
}

function Else({ id, isWorkbenchBlock, children }: ElseProps) {
  return (
    <div style={{ minWidth: '100px' }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span>else</span>
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

export default withBlock(Else);
