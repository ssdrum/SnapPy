import {
  Block,
  BlockState,
  BlockType,
  MathBlock,
  MathOperator,
  NumberBlock,
  VariableBlock,
} from '@/app/projects/[id]/blocks/types';
import { generateCode } from '@/app/projects/[id]/code-generation/code-generation';

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
  const additionBlock: MathBlock = {
    id: 'addition',
    type: BlockType.Math,
    state: BlockState.Idle,
    coords: { x: 0, y: 0 },
    isWorkbenchBlock: false,
    parentId: null,
    prevId: null,
    nextId: null,
    operator: MathOperator.Addition,
    children: {
      left: [],
      right: [],
    },
  };

  test('Generates variable with no expression correctly', () => {
    // expected: x = None
    const blocks: Block[] = [{ ...varBlock }];

    expect(generateCode(blocks)).toBe('x = None');
  });

  test('Generates variable with simplest numeric expression correctly', () => {
    // expected: x = 1
    const blocks: Block[] = [
      {
        ...varBlock,
        children: { expression: [{ ...numBlock }] },
      },
    ];

    expect(generateCode(blocks)).toBe('x = 1');
  });

  test('Generates variable with simple numeric expression correctly', () => {
    // expected: x = 1 + 2
    const blocks: Block[] = [
      {
        ...varBlock,
        children: {
          expression: [
            {
              ...additionBlock,
              children: {
                left: [{ ...numBlock }],
                right: [{ ...numBlock, value: '2' }],
              },
            },
          ],
        },
      },
    ];

    expect(generateCode(blocks)).toBe('x = 1 + 2');
  });

  test('Generates variable with nested complex numeric expression correctly', () => {
    // expected: x = 1 + 2 + 3 + 4
    const leftAddition: MathBlock = {
      ...additionBlock,
      children: {
        left: [{ ...numBlock }],
        right: [{ ...numBlock, value: '2' }],
      },
    };

    const rightAddition: MathBlock = {
      ...additionBlock,
      children: {
        left: [{ ...numBlock, value: '3' }],
        right: [{ ...numBlock, value: '4' }],
      },
    };

    const blocks: Block[] = [
      {
        ...varBlock,
        children: {
          expression: [
            {
              ...additionBlock,
              children: {
                left: [leftAddition],
                right: [rightAddition],
              },
            },
          ],
        },
      },
    ];
    expect(generateCode(blocks)).toBe('x = 1 + 2 + 3 + 4');
  });
});
