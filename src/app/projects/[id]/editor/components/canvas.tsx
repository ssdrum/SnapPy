import classes from '../editor.module.css';
import { useBlocks } from '../contexts/blocks-context';
import { useDroppable } from '@dnd-kit/core';
import { Box, Text } from '@mantine/core';
import CanvasBlocksRenderer from './canvas-blocks-renderer';

export default function Canvas() {
  const { state, deselectBlockAction } = useBlocks();
  const { setNodeRef } = useDroppable({ id: 'canvas' });

  // Deselect selected block if user clicks on empty space
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      deselectBlockAction();
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={classes.canvas}
      onClick={handleCanvasClick}
    >
      {state.canvas.length === 0 ? (
        <Box ta='center' pt={100} c='dimmed'>
          <Text size='xl' fw={500}>
            Drag blocks here
          </Text>
          <Text size='sm'>
            Drag blocks from the left panel to start building
          </Text>
        </Box>
      ) : (
        <CanvasBlocksRenderer canvas={state.canvas} />
      )}
    </div>
  );
}
