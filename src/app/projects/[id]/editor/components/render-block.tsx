import { Block, BlockType } from '../blocks/types';
import Variable from '../blocks/variable';
import Empty from '../blocks/empty';

export default function renderBlock(block: Block) {
  switch (block.type) {
    case BlockType.Variable:
      const { id, isWorkbenchBlock, selected, children } = block;
      return (
        <Variable
          key={id}
          id={id}
          isWorkbenchBlock={isWorkbenchBlock}
          selected={selected}
        >
          {children}
        </Variable>
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
