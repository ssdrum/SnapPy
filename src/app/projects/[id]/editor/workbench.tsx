import Variable from '@/app/blocks/variable';
import { VariableBlock } from './editor';

export default function Workbench({ blocks }: { blocks: VariableBlock[] }) {
  const style: React.CSSProperties = {
    width: '250px',
    background: 'rgba(255, 255, 255, 0.1)', // Semi-transparent background
    backdropFilter: 'blur(5px)', // Blur effect on the background
    zIndex: 1,
    borderRight: '1px solid black',
  };

  return (
    <div style={style}>
      {blocks.map((block) => (
        <Variable
          key={block.id}
          id={block.id}
          top={0}
          left={0}
          zIndex={2}
          setCanvasBlocks={null}
        />
      ))}
    </div>
  );
}
