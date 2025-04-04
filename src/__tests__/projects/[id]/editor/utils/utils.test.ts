import {
  Block,
  BlockState,
  BlockType,
} from '@/app/projects/[id]/editor/blocks/types';
import { findBlockById } from '@/app/projects/[id]/editor/utils/utils';

describe('findBlockById', () => {
  test('Returns null for empty forest', () => {
    const emptyForest: Block[] = [];
    expect(findBlockById(emptyForest, 'id')).toBeNull();
  });

  test('Finds non-nested block', () => {
    // Create a forest with multiple non-nested blocks
    const nonNestedForest: Block[] = [
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

    // Test finding the second block by ID
    const foundBlock = findBlockById(nonNestedForest, 'block2');

    // Expectations
    expect(foundBlock).not.toBeNull();
    expect(foundBlock).toMatchObject({
      id: 'block2',
    });

    // Test finding a block that doesn't exist
    expect(findBlockById(nonNestedForest, 'nonexistentId')).toBeNull();
  });

  test('Finds nested blocks', () => {
    // Create a forest with deeply nested blocks in a while block
    const nestedForest: Block[] = [
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

    // Test finding a deeply nested block in the while block
    const foundDeepBlock = findBlockById(nestedForest, 'target-block-deep');
    console.log(foundDeepBlock);
    expect(foundDeepBlock).not.toBeNull();
    expect(foundDeepBlock).toMatchObject({
      id: 'target-block-deep',
      parentId: 'inner-variable',
    });

    // Test that the original test still works
    const foundBlock = findBlockById(nestedForest, 'target-block1');
    console.log(foundBlock);
    expect(foundBlock).not.toBeNull();
    expect(foundBlock).toMatchObject({
      id: 'target-block1',
    });
  });
});
