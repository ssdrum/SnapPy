import { Block, BlockType } from '../blocks/types';
import Variable from '../blocks/variable';
import Empty from '../blocks/empty';
import While from '../blocks/while';

export default function renderBlock(block: Block) {
  const { id, isWorkbenchBlock } = block;

  switch (block.type) {
    case BlockType.Variable:
      return (
        <Variable
          key={id}
          id={id}
          isWorkbenchBlock={isWorkbenchBlock}
          selected={block.selected}
        >
          {block.children}
        </Variable>
      );
    case BlockType.While:
      return (
        <While key={id} id={id} isWorkbenchBlock={isWorkbenchBlock}>
          {block.children}
        </While>
      );
    default:
      return <Empty key={block.id} />;
  }
}

//switch (type) {
//  case BlockType.Empty:
//    return (
//      <Empty
//        key={id}
//        id={id}
//        top={coords.y}
//        left={coords.x}
//        blockType={type}
//        isWorkbenchBlock={isWorkbenchBlock}
//        stackOptions={stackOptions}
//        blockState={state}
//        parentId={parentId}
//      >
//        {children}
//      </Empty>
//    );
//  case BlockType.Variable:
//    const { selected } = block;
//    return (
//      <Variable
//        key={id}
//        id={id}
//        top={coords.y}
//        left={coords.x}
//        blockType={type}
//        isWorkbenchBlock={isWorkbenchBlock}
//        stackOptions={stackOptions}
//        blockState={state}
//        parentId={parentId}
//        selected={selected}
//      >
//        {children}
//      </Variable>
//    );
//  case BlockType.While: {
//    return (
//      <While
//        key={id}
//        id={id}
//        top={coords.y}
//        left={coords.x}
//        blockType={type}
//        isWorkbenchBlock={isWorkbenchBlock}
//        stackOptions={stackOptions}
//        blockState={state}
//        parentId={parentId}
//      >
//        {children}
//      </While>
//    );
//  }
//  default:
//    console.error(`Invalid block type in BlockRenderer: ${type}`);
//    return null;
//}
