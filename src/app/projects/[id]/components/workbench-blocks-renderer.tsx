import { useDraggable } from '@dnd-kit/core';
import { Block } from '../blocks/types';
import renderBlock from './render-block';
import { CSS } from '@dnd-kit/utilities';
import { Box, Title } from '@mantine/core';
import { blockCategories } from '../contexts/workbench-blocks';

interface WorkbenchBlocksRendererProps {
  workbench: Block[];
}

export default function WorkbenchBlocksRenderer({
  workbench,
}: WorkbenchBlocksRendererProps) {
  return (
    <>
      {Object.entries(blockCategories).map(([category, indices]) => (
        <div key={category}>
          <Title order={5} mb={'xs'}>
            {category}
          </Title>

          {indices.map((index) => (
            <Box mb={'md'} key={workbench[index].id}>
              <WorkbenchBlock block={workbench[index]} />
            </Box>
          ))}
        </div>
      ))}
    </>
  );
}

interface WorkbenchBlockProps {
  block: Block;
}

function WorkbenchBlock({ block }: WorkbenchBlockProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: block.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      key={block.id}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {renderBlock(block, false)}
    </div>
  );
}
