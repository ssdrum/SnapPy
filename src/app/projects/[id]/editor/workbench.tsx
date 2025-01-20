import { Block } from '@/app/blocks/types';
import BlocksRenderer from '@/app/blocks/blocks-renderer';

interface WorkbenchProps {
  blocks: Block[];
}

export default function Workbench({ blocks }: WorkbenchProps) {
  const style: React.CSSProperties = {
    width: '250px',
    background: 'rgba(255, 255, 255, 0.1)', // Semi-transparent background
    backdropFilter: 'blur(5px)', // Blur effect on the background
    zIndex: 1,
    borderRight: '1px solid black',
  };

  return (
    <div style={style}>
      <BlocksRenderer blocks={blocks} setCanvasBlocks={null} />
    </div>
  );
}
