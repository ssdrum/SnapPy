import {
  Block,
  BlockState,
  BlockType,
  EmptyBlock,
  VariableBlock,
  WhileBlock,
} from '@/app/projects/[id]/editor/blocks/types';
import {
  findBlockById,
  findRoot,
  getConnectedBlockIds,
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
  prevId: null,
  nextId: null,
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
    prevId: null,
    nextId: null,
    children: null,
  },
  {
    id: 'block2',
    type: BlockType.Empty,
    state: BlockState.Idle,
    coords: { x: 100, y: 0 },
    isWorkbenchBlock: true,
    parentId: null,
    prevId: null,
    nextId: null,
    children: null,
  },
  {
    id: 'block3',
    type: BlockType.Empty,
    state: BlockState.Idle,
    coords: { x: 200, y: 0 },
    isWorkbenchBlock: false,
    parentId: null,
    prevId: null,
    nextId: null,
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
    prevId: null,
    nextId: null,
    children: {
      condition: [
        {
          id: 'condition-block',
          type: BlockType.Variable,
          state: BlockState.Idle,
          coords: { x: 10, y: 10 },
          isWorkbenchBlock: false,
          parentId: 'block1',
          prevId: null,
          nextId: null,
          selected: 'counter',
          children: {
            expression: [
              {
                id: 'condition-expression',
                type: BlockType.Empty,
                state: BlockState.Idle,
                coords: { x: 15, y: 15 },
                isWorkbenchBlock: false,
                parentId: 'condition-block',
                prevId: null,
                nextId: null,
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
          prevId: null,
          nextId: null,
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
                prevId: null,
                nextId: null,
                selected: 'innerVar',
                children: {
                  expression: [
                    {
                      id: 'target-block-deep',
                      type: BlockType.Empty,
                      state: BlockState.Idle,
                      coords: { x: 35, y: 35 },
                      isWorkbenchBlock: false,
                      parentId: 'inner-variable',
                      prevId: null,
                      nextId: null,
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
    prevId: null,
    nextId: null,
    selected: 'x',
    children: {
      expression: [
        {
          id: 'target-block1',
          type: BlockType.Empty,
          state: BlockState.Idle,
          coords: { x: 120, y: 20 },
          isWorkbenchBlock: false,
          parentId: 'block2',
          prevId: null,
          nextId: null,
          children: null,
        },
      ],
    },
  },
];

describe('findBlockById', () => {
  test('Returns null for empty canvas', () => {
    const emptyCanvas: Block[] = [];
    expect(findBlockById('id', emptyCanvas)).toBeNull();
  });

  test('Finds non-nested block', () => {
    // Test finding the second block by ID
    const foundBlock = findBlockById('block2', flatCanvas);
    expect(foundBlock).not.toBeNull();
    expect(foundBlock).toMatchObject({
      id: 'block2',
    });

    expect(findBlockById('nonexistentId', flatCanvas)).toBeNull();
  });

  test('Finds nested blocks', () => {
    // Test finding a deeply nested block in the while block
    const foundDeepBlock = findBlockById('target-block-deep', nestedCanvas);
    expect(foundDeepBlock).not.toBeNull();
    expect(foundDeepBlock).toMatchObject({
      id: 'target-block-deep',
    });

    const foundBlock = findBlockById('target-block1', nestedCanvas);
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
    expect(findBlockById('block1', testCanvas)!.state).toBe(
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
    expect(findBlockById('target-block-deep', testCanvas)!.state).toBe(
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
      expect(findBlockById('block1', testCanvas)).toBeNull();
    });

    test('Removes nested block correctly', () => {
      let testCanvas = [...nestedCanvas];
      testCanvas = removeBlockById(testCanvas, 'target-block-deep');
      expect(findBlockById('target-block-deep', testCanvas)).toBeNull();
    });
  });

  describe('findRoot', () => {
    test('Returns self for block with no parent', () => {
      const testBlock = findBlockById('block1', nestedCanvas)!;
      expect(findRoot(nestedCanvas, testBlock)).toEqual(testBlock);
    });

    test('Finds parent of deeply nested block correctly', () => {
      const parentBlock = findBlockById('block1', nestedCanvas)!;
      const testBlock = findBlockById('target-block-deep', nestedCanvas)!;
      expect(findRoot(nestedCanvas, testBlock)).toEqual(parentBlock);
    });
  });

  describe('getConnectedBlockIds', () => {
    test('Returns id of single block correctly', () => {
      expect(Array.from(getConnectedBlockIds(flatCanvas, 'block1'))).toEqual([
        'block1',
      ]);
    });

    test('Returns correct ids for group of connected blocks made of sequences and nested blocks', () => {
      const testBlock1: EmptyBlock = {
        ...block1,
        nextId: 'block2',
      };
      const testBlock3: EmptyBlock = {
        ...block1,
        id: 'block3',
        prevId: 'block2',
      };
      const testBlock5: EmptyBlock = {
        ...block1,
        id: 'block5',
        parentId: 'block2',
      };

      // Block 4
      const testBlock4: WhileBlock = {
        ...block1,
        id: 'block4',
        type: BlockType.While,
        parentId: 'block2',
        children: {
          condition: [],
          body: [testBlock5],
        },
      };
      // Block 2
      const testBlock2: VariableBlock = {
        ...block1,
        id: 'block2',
        prevId: 'block1',
        nextId: 'block3',
        type: BlockType.Variable,
        selected: 'x',
        children: {
          expression: [testBlock4],
        },
      };

      // The canvas and expected result
      const testCanvas = [testBlock1, testBlock2, testBlock3];
      const expectedRes = ['block1', 'block2', 'block3', 'block4', 'block5'];
      expect(
        Array.from(getConnectedBlockIds(testCanvas, 'block1')).sort()
      ).toEqual(expectedRes);
    });
  });
});
