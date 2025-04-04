import {
  Block,
  BlockState,
  BlockType,
} from '@/app/projects/[id]/editor/blocks/types';
import {
  findBlockById,
  findRoot,
  getMaxDepth,
  removeBlockById,
  updateBlockById,
} from '@/app/projects/[id]/editor/utils/utils';

const block1: Block = {
  id: 'block1',
  type: BlockType.Empty,
  state: BlockState.Idle,
  coords: { x: 0, y: 0 },
  isWorkbenchBlock: false,
  parentId: null,
  prevBlockId: null,
  nextBlockId: null,
  stackOptions: { top: true, bottom: true },
  children: null,
};

const flatCanvas: Block[] = [
  {
    id: 'block1',
    type: BlockType.Empty,
    state: BlockState.Idle,
    coords: { x: 0, y: 0 },
    isWorkbenchBlock: false,
    parentId: null,
    prevBlockId: null,
    nextBlockId: null,
    stackOptions: { top: true, bottom: true },
    children: null,
  },
  {
    id: 'block2',
    type: BlockType.Empty,
    state: BlockState.Idle,
    coords: { x: 100, y: 0 },
    isWorkbenchBlock: true,
    parentId: null,
    prevBlockId: null,
    nextBlockId: null,
    stackOptions: { top: true, bottom: true },
    children: null,
  },
  {
    id: 'block3',
    type: BlockType.Empty,
    state: BlockState.Idle,
    coords: { x: 200, y: 0 },
    isWorkbenchBlock: false,
    parentId: null,
    prevBlockId: null,
    nextBlockId: null,
    stackOptions: { top: true, bottom: true },
    children: null,
  },
];

const nestedCanvas: Block[] = [
  {
    id: 'block1',
    type: BlockType.While,
    state: BlockState.Idle,
    coords: { x: 0, y: 0 },
    isWorkbenchBlock: false,
    parentId: null,
    prevBlockId: null,
    nextBlockId: null,
    stackOptions: { top: true, bottom: true },
    children: {
      condition: [
        {
          id: 'condition-block',
          type: BlockType.Variable,
          state: BlockState.Idle,
          coords: { x: 10, y: 10 },
          isWorkbenchBlock: false,
          parentId: 'block1',
          prevBlockId: null,
          nextBlockId: null,
          stackOptions: { top: true, bottom: true },
          selected: 'counter',
          children: {
            expression: [
              {
                id: 'condition-expression',
                type: BlockType.Empty,
                state: BlockState.Idle,
                coords: { x: 15, y: 15 },
                isWorkbenchBlock: false,
                stackOptions: { top: true, bottom: true },
                parentId: 'condition-block',
                prevBlockId: null,
                nextBlockId: null,
                children: null,
              },
            ],
          },
        },
      ],
      body: [
        {
          id: 'body-while',
          type: BlockType.While,
          state: BlockState.Idle,
          coords: { x: 20, y: 20 },
          isWorkbenchBlock: false,
          parentId: 'block1',
          prevBlockId: null,
          nextBlockId: null,
          stackOptions: { top: true, bottom: true },
          children: {
            condition: [],
            body: [
              {
                id: 'inner-variable',
                type: BlockType.Variable,
                state: BlockState.Idle,
                coords: { x: 30, y: 30 },
                isWorkbenchBlock: false,
                parentId: 'body-while',
                prevBlockId: null,
                nextBlockId: null,
                stackOptions: { top: true, bottom: true },
                selected: 'innerVar',
                children: {
                  expression: [
                    {
                      id: 'target-block-deep',
                      type: BlockType.Empty,
                      state: BlockState.Idle,
                      coords: { x: 35, y: 35 },
                      isWorkbenchBlock: false,
                      stackOptions: { top: true, bottom: true },
                      parentId: 'inner-variable',
                      prevBlockId: null,
                      nextBlockId: null,
                      children: null,
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'block2',
    type: BlockType.Variable,
    state: BlockState.Idle,
    coords: { x: 100, y: 0 },
    isWorkbenchBlock: true,
    parentId: null,
    prevBlockId: null,
    nextBlockId: null,
    stackOptions: { top: true, bottom: true },
    selected: 'x',
    children: {
      expression: [
        {
          id: 'target-block1',
          type: BlockType.Empty,
          state: BlockState.Idle,
          coords: { x: 120, y: 20 },
          isWorkbenchBlock: false,
          stackOptions: { top: true, bottom: true },
          parentId: 'block2',
          prevBlockId: null,
          nextBlockId: null,
          children: null,
        },
      ],
    },
  },
];

describe('findBlockById', () => {
  test('Returns null for empty forest', () => {
    const emptyForest: Block[] = [];
    expect(findBlockById(emptyForest, 'id')).toBeNull();
  });

  test('Finds non-nested block', () => {
    // Test finding the second block by ID
    const foundBlock = findBlockById(flatCanvas, 'block2');
    expect(foundBlock).not.toBeNull();
    expect(foundBlock).toMatchObject({
      id: 'block2',
    });

    expect(findBlockById(flatCanvas, 'nonexistentId')).toBeNull();
  });

  test('Finds nested blocks', () => {
    // Test finding a deeply nested block in the while block
    const foundDeepBlock = findBlockById(nestedCanvas, 'target-block-deep');
    expect(foundDeepBlock).not.toBeNull();
    expect(foundDeepBlock).toMatchObject({
      id: 'target-block-deep',
    });

    const foundBlock = findBlockById(nestedCanvas, 'target-block1');
    expect(foundBlock).not.toBeNull();
    expect(foundBlock).toMatchObject({
      id: 'target-block1',
    });
  });
});

describe('updateBlockbyId', () => {
  test('Returns unchanged canvas for non-existant block', () => {
    const testCanvas = [...flatCanvas];
    expect(updateBlockById(testCanvas, 'hello', block1)).toEqual(testCanvas);
  });

  test('Updates non-nested block correctly', () => {
    let testCanvas = [...flatCanvas];
    const updatedBlock = { ...block1, state: BlockState.Selected };
    testCanvas = updateBlockById(testCanvas, 'block1', updatedBlock);
    expect(findBlockById(testCanvas, 'block1')!.state).toBe(
      BlockState.Selected
    );
  });

  test('Updates nested block correctly', () => {
    let testCanvas = [...nestedCanvas];
    const updatedBlock = {
      ...block1,
      id: 'target-block-deep',
      state: BlockState.Selected,
    };
    testCanvas = updateBlockById(testCanvas, 'target-block-deep', updatedBlock);
    expect(findBlockById(testCanvas, 'target-block-deep')!.state).toBe(
      BlockState.Selected
    );
  });

  describe('removeBlockById', () => {
    test('Returns unchanged canvas for non-existant block', () => {
      const testCanvas = [...flatCanvas];
      expect(removeBlockById(testCanvas, 'hello')).toEqual(testCanvas);
    });

    test('Removes non-nested block correctly', () => {
      let testCanvas = [...flatCanvas];
      testCanvas = removeBlockById(testCanvas, 'block1');
      expect(findBlockById(testCanvas, 'block1')).toBeNull();
    });

    test('Removes nested block correctly', () => {
      let testCanvas = [...nestedCanvas];
      testCanvas = removeBlockById(testCanvas, 'target-block-deep');
      expect(findBlockById(testCanvas, 'target-block-deep')).toBeNull();
    });
  });

  describe('getMaxDepth', () => {
    test('Returns 0 for block with null children', () => {
      expect(getMaxDepth(block1)).toBe(0);
    });

    test('Returns correct depth', () => {
      const testBlock = findBlockById(nestedCanvas, 'block1')!;
      expect(getMaxDepth(testBlock)).toBe(3);
    });
  });

  describe('findRoot', () => {
    test('Returns self for block with no parent', () => {
      const testBlock = findBlockById(nestedCanvas, 'block1')!;
      expect(findRoot(nestedCanvas, testBlock)).toEqual(testBlock);
    });

    test('Finds parent of deeply nested block correctly', () => {
      const parentBlock = findBlockById(nestedCanvas, 'block1')!;
      const testBlock = findBlockById(nestedCanvas, 'target-block-deep')!;
      expect(findRoot(nestedCanvas, testBlock)).toEqual(parentBlock);
    });
  });
});
