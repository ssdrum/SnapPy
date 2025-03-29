import { Block, BlockType, VariableBlock } from '../blocks/types';
import Empty from '../blocks/empty';
import Variable from '../blocks/variable';

interface BlocksRendererProps {
  blocks: Block[];
}

export default function BlocksRenderer({ blocks }: BlocksRendererProps) {
  return (
    <>
      {blocks.map((block) => {
        const {
          id,
          type,
          coords,
          isWorkbenchBlock,
          state,
          parentId,
          children,
        } = block;

        switch (type) {
          case BlockType.Empty:
            return (
              <Empty
                key={id}
                id={id}
                top={coords.y}
                left={coords.x}
                blockType={type}
                isWorkbenchBlock={isWorkbenchBlock}
                state={state}
                parentId={parentId}
              />
            );

          case BlockType.Variable:
            const variableBlock = block as VariableBlock;
            const { selected } = variableBlock;

            return (
              <Variable
                key={id}
                id={id}
                top={coords.y}
                left={coords.x}
                blockType={type}
                isWorkbenchBlock={isWorkbenchBlock}
                state={state}
                parentId={parentId}
                selected={selected}
              >
                {children}
              </Variable>
            );

          default:
            console.error(`invalid block type in BlockRenderer: ${type}`);
            return null;
        }
      })}
    </>
  );
}
