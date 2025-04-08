import InnerDropZone from '../components/inner-drop-zone';
import { Block } from './types';
import classes from './blocks.module.css';

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
    <div
      className={classes.base}
      style={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: '100px',
        backgroundColor: '#FF8C1A',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '10px',
          alignItems: 'center',
        }}
      >
        <span>While</span>
        <InnerDropZone
          id={`condition_${id}`}
          enabled={!isWorkbenchBlock}
          enableStacking={false}
        >
          {children.condition}
        </InnerDropZone>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span>do</span>
        <InnerDropZone
          id={`body_${id}`}
          enabled={!isWorkbenchBlock}
          enableStacking={true}
        >
          {children.body}
        </InnerDropZone>
      </div>
    </div>
  );
}

export default While;
