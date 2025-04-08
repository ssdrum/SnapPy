import { Block, BlockType } from '../blocks/types';
import Variable from '../blocks/variable';
import Empty from '../blocks/empty';
import While from '../blocks/while';

export default function renderBlock(block: Block) {
  const { id, isWorkbenchBlock, state, children } = block;

  switch (block.type) {
    case BlockType.Variable:
      return (
        <Variable
          key={id}
          id={id}
          isWorkbenchBlock={isWorkbenchBlock}
          blockType={BlockType.Variable}
          blockState={state}
          selected={block.selected}
        >
          {block.children}
        </Variable>
      );
    case BlockType.While:
      return (
        <While
          key={id}
          id={id}
          isWorkbenchBlock={isWorkbenchBlock}
          blockType={BlockType.While}
          blockState={state}
        >
          {block.children}
        </While>
      );
    default:
      return (
        <Empty
          key={block.id}
          id={id}
          isWorkbenchBlock={isWorkbenchBlock}
          blockType={BlockType.Empty}
          blockState={state}
        >
          {children}
        </Empty>
      );
  }
}
