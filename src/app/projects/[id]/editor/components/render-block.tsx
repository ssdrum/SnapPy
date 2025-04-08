import Empty from '../blocks/empty';
import { Block } from '../blocks/types';

export default function renderBlock(block: Block) {
  switch (block.type) {
    default:
      return <Empty key={block.id} />;
  }
}
