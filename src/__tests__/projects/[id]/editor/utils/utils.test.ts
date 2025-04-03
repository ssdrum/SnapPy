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
        children: [],
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
        children: [],
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
        children: [],
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

  test('Finds deeply nested block', () => {
    // Create a forest with nested blocks
    const nestedForest: Block[] = [
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
        children: [
          {
            id: 'block1-1',
            type: BlockType.Empty,
            state: BlockState.Idle,
            coords: { x: 10, y: 10 },
            isWorkbenchBlock: false,
            parentId: 'block1',
            prevBlockId: null,
            nextBlockId: null,
            stackOptions: { top: true, bottom: true },
            children: [
              {
                id: 'block1-1-1',
                type: BlockType.Empty,
                state: BlockState.Idle,
                coords: { x: 15, y: 15 },
                isWorkbenchBlock: false,
                parentId: 'block1-1',
                prevBlockId: null,
                nextBlockId: null,
                stackOptions: { top: true, bottom: true },
                children: [],
              },
            ],
          },
        ],
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
        children: [
          {
            id: 'target-block',
            type: BlockType.Empty,
            state: BlockState.Selected,
            coords: { x: 120, y: 20 },
            isWorkbenchBlock: false,
            prevBlockId: null,
            parentId: 'block2',
            nextBlockId: null,
            stackOptions: { top: true, bottom: true },
            children: [],
          },
        ],
      },
    ];

    // Test finding a nested block by ID
    const foundBlock = findBlockById(nestedForest, 'target-block');

    // Expectations
    expect(foundBlock).not.toBeNull();
    expect(foundBlock).toMatchObject({
      id: 'target-block',
      type: BlockType.Empty,
      state: BlockState.Selected,
      isWorkbenchBlock: false,
      parentId: 'block2',
      children: [],
    });

    // Test finding a deeply nested block
    const deeplyNestedBlock = findBlockById(nestedForest, 'block1-1-1');
    expect(deeplyNestedBlock).toMatchObject({
      id: 'block1-1-1',
      parentId: 'block1-1',
    });
  });
});
