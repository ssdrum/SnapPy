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
        const { id, type, coords, isWorkbenchBlock, state } = block;

        switch (type) {
          case BlockType.Empty:
            return (
              <Empty
                key={id}
                id={id}
                top={coords.y}
                left={coords.x}
                isWorkbenchBlock={isWorkbenchBlock}
                state={state}
                blockType={type}
              />
            );

          case BlockType.Variable:
            const variableBlock = block as VariableBlock;
            const { name, dataType, value } = variableBlock;

            return (
              <Variable
                key={id}
                id={id}
                top={coords.y}
                left={coords.x}
                isWorkbenchBlock={isWorkbenchBlock}
                state={state}
                name={name}
                blockType={type}
                dataType={dataType}
                value={value}
              />
            );

          default:
            console.error(`invalid block type in BlockRenderer: ${type}`);
            return null;
        }
      })}
    </>
  );
}
