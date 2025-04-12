import {
  Block,
  BlockState,
  BlockType,
  NumberBlock,
  VariableBlock,
} from '@/app/projects/[id]/editor/blocks/types';
import { generateCode } from '@/app/projects/[id]/editor/code-generation/code-generation';

describe('Code generation', () => {
  const varBlock: VariableBlock = {
    id: 'var-x',
    type: BlockType.Variable,
    state: BlockState.Idle,
    coords: { x: 0, y: 0 },
    isWorkbenchBlock: false,
    parentId: null,
    prevId: null,
    nextId: null,
    selected: 'x',
    children: {
      expression: [],
    },
  };
  const numBlock: NumberBlock = {
    id: 'num-1',
    type: BlockType.Number,
    state: BlockState.Idle,
    coords: { x: 0, y: 0 },
    isWorkbenchBlock: false,
    parentId: null,
    prevId: null,
    nextId: null,
    value: '1',
    children: null,
  };

  test('Generates variable with no expression correctly', () => {
    const blocks: Block[] = [{ ...varBlock }];

    const generated = generateCode(blocks);

    expect(generated).toBe('x = None');
  });

  test('Generates variable with simplest numeric expression correctly', () => {
    const blocks: Block[] = [
      {
        ...varBlock,
        children: { expression: [{ ...numBlock }] },
      },
    ];

    const generated = generateCode(blocks);

    expect(generated).toBe('x = 1');
  });
});
