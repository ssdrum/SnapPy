import {
  CanvasAction,
  CanvasEvent,
} from '@/app/projects/[id]/blocks/canvas-api';
import {
  BlockState,
  CanvasState,
  BlockType,
  Block,
  VariableBlock,
  EmptyBlock,
  WhileBlock,
  OuterDropzonePosition,
  BlockShape,
} from '@/app/projects/[id]/blocks/types';
import BlocksReducer from '@/app/projects/[id]/reducers/blocks-reducer';
import { findBlockById } from '@/app/projects/[id]/utils/utils';

describe('BlocksReducer', () => {
  const block1: Block = {
    id: 'block1',
    type: BlockType.Empty,
    shape: BlockShape.Square,
    state: BlockState.Idle,
    coords: { x: 100, y: 100 },
    isWorkbenchBlock: false,
    parentId: null,
    prevId: null,
    nextId: null,
    children: null,
  };
  const block2: Block = {
    id: 'block2',
    type: BlockType.Empty,
    shape: BlockShape.Square,
    state: BlockState.Idle,
    coords: { x: 200, y: 200 },
    isWorkbenchBlock: false,
    parentId: null,
    prevId: null,
    nextId: null,
    children: null,
  };
  const block3: Block = {
    id: 'block3',
    type: BlockType.Variable,
    shape: BlockShape.Square,
    state: BlockState.Idle,
    coords: { x: 300, y: 300 },
    isWorkbenchBlock: false,
    parentId: null,
    prevId: null,
    nextId: null,
    selected: 'x',
    children: {
      expression: [],
    },
  };
  const block4: WhileBlock = {
    id: 'block4',
    type: BlockType.While,
    shape: BlockShape.Square,
    state: BlockState.Idle,
    coords: { x: 400, y: 400 },
    isWorkbenchBlock: false,
    parentId: null,
    prevId: null,
    nextId: null,
    children: {
      condition: [],
      body: [],
    },
  };
  const workbench1: Block = {
    id: 'workbench1',
    type: BlockType.Empty,
    shape: BlockShape.Square,
    state: BlockState.Idle,
    coords: { x: 50, y: 50 },
    isWorkbenchBlock: true,
    parentId: null,
    prevId: null,
    nextId: null,
    children: null,
  };
  const workbenchVar: Block = {
    id: 'workbenchVar',
    type: BlockType.Variable,
    shape: BlockShape.Square,
    state: BlockState.Idle,
    coords: { x: 150, y: 50 },
    isWorkbenchBlock: true,
    parentId: null,
    prevId: null,
    nextId: null,
    selected: '',
    children: {
      expression: [],
    },
  };
  const initialCanvas: CanvasState = {
    canvas: [block1, block2, block3],
    workbench: [workbench1, workbenchVar],
    variables: ['x', 'y'],
    selectedBlockId: null,
    draggedBlockId: null,
    draggedGroupBlockIds: null,
    highlightedDropZoneId: null,
    entrypointBlockId: null,
  };

  // --------------- Add tests here ------------------
  test('SELECT_BLOCK should mark a block as selected and update selectedBlockId', () => {
    const action: CanvasAction = {
      type: CanvasEvent.SELECT_BLOCK,
      payload: { id: 'block1' },
    };

    const newCanvas = BlocksReducer(initialCanvas, action);

    expect(newCanvas.selectedBlockId).toBe('block1');
    expect(newCanvas.canvas.find((b) => b.id === 'block1')!.state).toBe(
      BlockState.Selected
    );
  });

  test('DESELECT_BLOCK should mark a block as idle and set selectedBlockId to null', () => {
    // Set up a state with a selected block
    const stateWithSelectedBlock = {
      ...initialCanvas,
      selectedBlockId: 'block1',
      canvas: initialCanvas.canvas.map((block) =>
        block.id === 'block1' ? { ...block, state: BlockState.Selected } : block
      ),
    };

    // Dispatch DESELECT_BLOCK action
    const action: CanvasAction = {
      type: CanvasEvent.DESELECT_BLOCK,
    };

    // Apply the reducer
    const newCanvas = BlocksReducer(stateWithSelectedBlock, action);

    // Check that the block state is now Idle
    const newBlock = newCanvas.canvas.find((block) => block.id === 'block1')!;

    // Assert the expected changes
    expect(newBlock.state).toBe(BlockState.Idle);
    expect(newCanvas.selectedBlockId).toBeNull();
  });

  test('Adds single child correctly', () => {
    const testCanvas: CanvasState = {
      ...initialCanvas,
    };

    let newCanvas = BlocksReducer(testCanvas, {
      type: CanvasEvent.ADD_CHILD_BLOCK,
      payload: {
        id: 'block1',
        targetId: 'block3',
        prefix: 'expression',
      },
    });

    const parent = findBlockById('block3', newCanvas.canvas)! as VariableBlock;
    const child = findBlockById('block1', newCanvas.canvas)! as EmptyBlock;
    const expectedChild = {
      ...block1,
      state: BlockState.Nested,
      parentId: 'block3',
    };
    expect(parent.children.expression).toEqual([{ ...expectedChild }]);
    expect(child).toEqual({ ...expectedChild });
  });

  test('Nests sequence of blocks with nested blocks correctly', () => {
    const sequenceBlock1: EmptyBlock = { ...block1, nextId: 'block2' };
    const sequenceBlock2: EmptyBlock = {
      ...block1,
      id: 'block2',
      prevId: 'block1',
      nextId: 'block3',
    };
    const sequenceBlock3: VariableBlock = {
      ...block3,
      id: 'block3',
      prevId: 'block2',
      children: {
        expression: [
          {
            ...block1,
            id: 'block5',
            state: BlockState.Nested,
            parentId: 'block3',
          },
        ],
      },
    };
    const parent = { ...block4 };

    const testCanvas: CanvasState = {
      ...initialCanvas,
      canvas: [sequenceBlock1, sequenceBlock2, sequenceBlock3, parent],
    };

    let newCanvas = BlocksReducer(testCanvas, {
      type: CanvasEvent.ADD_CHILD_BLOCK,
      payload: {
        id: 'block1',
        targetId: 'block4',
        prefix: 'body',
      },
    });

    expect(newCanvas.canvas).toEqual([
      {
        ...block4,
        children: {
          condition: [],
          body: [
            { ...sequenceBlock1, state: BlockState.Nested, parentId: 'block4' },
            { ...sequenceBlock2, state: BlockState.Nested, parentId: 'block4' },
            { ...sequenceBlock3, state: BlockState.Nested, parentId: 'block4' },
          ],
        },
      },
    ]);
  });

  test('Unnests sequence of blocks with nested blocks correctly', () => {
    // Create parent first
    const parent: WhileBlock = {
      ...block4,
      children: {
        condition: [],
        body: [],
      },
    };

    // Setup blocks with proper state for nesting
    const sequenceBlock1: EmptyBlock = {
      ...block1,
      nextId: 'block2',
      state: BlockState.Nested,
      parentId: 'block4',
    };

    const sequenceBlock2: EmptyBlock = {
      ...block1,
      id: 'block2',
      prevId: 'block1',
      nextId: 'block3',
      state: BlockState.Nested,
      parentId: 'block4',
    };

    const sequenceBlock3: VariableBlock = {
      ...block3,
      id: 'block3',
      prevId: 'block2',
      state: BlockState.Nested,
      parentId: 'block4',
      children: {
        expression: [
          {
            ...block1,
            id: 'block5',
            state: BlockState.Nested,
            parentId: 'block3',
          },
        ],
      },
    };

    // Add children to parent
    parent.children.body = [
      { ...sequenceBlock1 },
      { ...sequenceBlock2 },
      { ...sequenceBlock3 },
    ];

    // Initial canvas state
    const testCanvas: CanvasState = {
      ...initialCanvas,
      canvas: [parent],
    };

    // Apply the reducer
    let newCanvas = BlocksReducer(testCanvas, {
      type: CanvasEvent.REMOVE_CHILD_BLOCK,
      payload: {
        id: 'block1',
        parentId: 'block4',
      },
    });

    // Expected unnested blocks
    const expectedBlock1 = {
      ...sequenceBlock1,
      state: BlockState.Idle,
      parentId: null,
    };

    const expectedBlock2 = {
      ...sequenceBlock2,
      state: BlockState.Idle,
      parentId: null,
    };

    const expectedBlock3 = {
      ...sequenceBlock3,
      state: BlockState.Idle,
      parentId: null,
    };

    // Expected parent after unnesting
    const expectedParent = {
      ...parent,
      children: {
        condition: [],
        body: [],
      },
    };

    // Verify results
    expect(newCanvas.canvas).toHaveLength(4);
    expect(newCanvas.canvas).toContainEqual(expectedBlock1);
    expect(newCanvas.canvas).toContainEqual(expectedBlock2);
    expect(newCanvas.canvas).toContainEqual(expectedBlock3);
    expect(newCanvas.canvas).toContainEqual(expectedParent);
  });

  test('Snaps single block above single block correctly', () => {
    const action: CanvasAction = {
      type: CanvasEvent.SNAP_BLOCK,
      payload: {
        id: 'block1',
        targetId: 'block2',
        position: OuterDropzonePosition.Top,
      },
    };

    const testCanvas = { ...initialCanvas };
    const newCanvas = BlocksReducer(testCanvas, action);
    const newBlock1 = findBlockById('block1', newCanvas.canvas)!;
    const newBlock2 = findBlockById('block2', newCanvas.canvas)!;

    const expectedBlock1 = {
      ...block1,
      nextId: 'block2',
      coords: { x: 200, y: 200 },
    };
    const expectedBlock2 = {
      ...block2,
      prevId: 'block1',
    };

    expect(newBlock1).toEqual(expectedBlock1);
    expect(newBlock2).toEqual(expectedBlock2);
  });

  test('Snaps single block below single block correctly', () => {
    const action: CanvasAction = {
      type: CanvasEvent.SNAP_BLOCK,
      payload: {
        id: 'block1',
        targetId: 'block2',
        position: OuterDropzonePosition.Bottom,
      },
    };

    const testCanvas = { ...initialCanvas };
    const newCanvas = BlocksReducer(testCanvas, action);
    const newBlock1 = findBlockById('block1', newCanvas.canvas)!;
    const newBlock2 = findBlockById('block2', newCanvas.canvas)!;

    const expectedBlock1 = {
      ...block1,
      prevId: 'block2',
    };
    const expectedBlock2 = {
      ...block2,
      nextId: 'block1',
    };

    expect(newBlock1).toEqual(expectedBlock1);
    expect(newBlock2).toEqual(expectedBlock2);
  });

  test('Snaps single block above sequence of blocks correctly', () => {
    const action: CanvasAction = {
      type: CanvasEvent.SNAP_BLOCK,
      payload: {
        id: 'block to snap',
        targetId: 'block1',
        position: OuterDropzonePosition.Top,
      },
    };

    const sequenceBlock1: Block = { ...block1, nextId: 'block2' };
    const sequenceBlock2: Block = {
      ...block2,
      prevId: 'block1',
      nextId: 'block3',
    };
    const sequenceBlock3: Block = { ...block3, prevId: 'block2' };
    const blockToSnap: Block = { ...block4, id: 'block to snap' };
    const testCanvas = {
      ...initialCanvas,
      canvas: [sequenceBlock1, sequenceBlock2, sequenceBlock3, blockToSnap],
    };

    const expectedBlockToSnap: Block = {
      ...blockToSnap,
      nextId: 'block1',
      coords: { ...sequenceBlock1.coords },
    };

    const expectedSequenceBlock1: Block = {
      ...sequenceBlock1,
      prevId: 'block to snap',
      nextId: 'block2',
    };
    const expectedSequenceBlock2: Block = {
      ...sequenceBlock2,
      prevId: 'block1',
      nextId: 'block3',
    };
    const expectedSequenceBlock3: Block = {
      ...sequenceBlock3,
      prevId: 'block2',
    };

    const newCanvas = BlocksReducer(testCanvas, action);
    const newSequenceBlock1 = findBlockById('block1', newCanvas.canvas)!;
    const newSequenceBlock2 = findBlockById('block2', newCanvas.canvas)!;
    const newSequenceBlock3 = findBlockById('block3', newCanvas.canvas)!;
    const newBlockToSnap = findBlockById('block to snap', newCanvas.canvas)!;

    expect(newBlockToSnap).toEqual(expectedBlockToSnap);
    expect(newSequenceBlock1).toEqual(expectedSequenceBlock1);
    expect(newSequenceBlock2).toEqual(expectedSequenceBlock2);
    expect(newSequenceBlock3).toEqual(expectedSequenceBlock3);
  });

  test('Snaps single block below sequence of blocks correctly', () => {
    const action: CanvasAction = {
      type: CanvasEvent.SNAP_BLOCK,
      payload: {
        id: 'block to snap',
        targetId: 'block3',
        position: OuterDropzonePosition.Bottom,
      },
    };

    const sequenceBlock1: Block = { ...block1, nextId: 'block2' };
    const sequenceBlock2: Block = {
      ...block2,
      prevId: 'block1',
      nextId: 'block3',
    };
    const sequenceBlock3: Block = { ...block3, prevId: 'block2' };
    const blockToSnap: Block = { ...block4, id: 'block to snap' };
    const testCanvas = {
      ...initialCanvas,
      canvas: [sequenceBlock1, sequenceBlock2, sequenceBlock3, blockToSnap],
    };

    const expectedBlockToSnap: Block = {
      ...blockToSnap,
      prevId: 'block3',
    };

    const expectedSequenceBlock1: Block = {
      ...sequenceBlock1,
      nextId: 'block2',
    };
    const expectedSequenceBlock2: Block = {
      ...sequenceBlock2,
      prevId: 'block1',
      nextId: 'block3',
    };
    const expectedSequenceBlock3: Block = {
      ...sequenceBlock3,
      prevId: 'block2',
      nextId: 'block to snap',
    };

    const newCanvas = BlocksReducer(testCanvas, action);
    const newSequenceBlock1 = findBlockById('block1', newCanvas.canvas)!;
    const newSequenceBlock2 = findBlockById('block2', newCanvas.canvas)!;
    const newSequenceBlock3 = findBlockById('block3', newCanvas.canvas)!;
    const newBlockToSnap = findBlockById('block to snap', newCanvas.canvas)!;

    expect(newBlockToSnap).toEqual(expectedBlockToSnap);
    expect(newSequenceBlock1).toEqual(expectedSequenceBlock1);
    expect(newSequenceBlock2).toEqual(expectedSequenceBlock2);
    expect(newSequenceBlock3).toEqual(expectedSequenceBlock3);
  });

  test('Snaps sequence of blocks above sequence of blocks correctly', () => {
    // Setup:
    // Initial: block1 -> block2 -> block3
    //          blockToSnap -> block5 -> block6
    // Expected: blockToSnap -> block5 -> block6 -> block1 -> block2 -> block3

    // Define the action to test
    const action: CanvasAction = {
      type: CanvasEvent.SNAP_BLOCK,
      payload: {
        id: 'block to snap',
        targetId: 'block1',
        position: OuterDropzonePosition.Top,
      },
    };

    const sequenceBlock1: Block = { ...block1, nextId: 'block2' };
    const sequenceBlock2: Block = {
      ...block2,
      prevId: 'block1',
      nextId: 'block3',
    };
    const sequenceBlock3: Block = { ...block3, prevId: 'block2' };

    const blockToSnap: Block = {
      ...block1,
      id: 'block to snap',
      nextId: 'block5',
      coords: { x: 400, y: 400 },
    };

    const sequenceBlock5: Block = {
      ...block2,
      id: 'block5',
      prevId: 'block to snap',
      nextId: 'block6',
    };

    const sequenceBlock6: Block = {
      ...block1,
      id: 'block6',
      prevId: 'block5',
    };

    // Create the test canvas with the initial blocks
    const testCanvas = {
      ...initialCanvas,
      canvas: [
        sequenceBlock1,
        sequenceBlock2,
        sequenceBlock3,
        blockToSnap,
        sequenceBlock5,
        sequenceBlock6,
      ],
    };

    // Define expected blocks after the action
    const expectedBlockToSnap: Block = {
      ...blockToSnap,
      coords: { ...sequenceBlock1.coords },
    };
    const expectedSequenceBlock6: Block = {
      ...sequenceBlock6,
      nextId: 'block1',
    };
    const expectedSequenceBlock1: Block = {
      ...sequenceBlock1,
      prevId: 'block6',
    };

    // Execute the action
    const newCanvas = BlocksReducer(testCanvas, action);

    // Add assertions
    expect(findBlockById('block to snap', newCanvas.canvas)!).toEqual(
      expectedBlockToSnap
    );
    expect(findBlockById('block6', newCanvas.canvas)!).toEqual(
      expectedSequenceBlock6
    );
    expect(findBlockById('block1', newCanvas.canvas)!).toEqual(
      expectedSequenceBlock1
    );
  });

  test('Snaps sequence of blocks below sequence of blocks correctly', () => {
    // Setup:
    // Initial: block1 -> block2 -> block3
    //          blockToSnap -> block5 -> block6
    // Expected: block1 -> block2 -> block3 -> blockToSnap -> block5 -> block6

    // Define the action to test
    const action: CanvasAction = {
      type: CanvasEvent.SNAP_BLOCK,
      payload: {
        id: 'block to snap',
        targetId: 'block3',
        position: OuterDropzonePosition.Bottom,
      },
    };

    const sequenceBlock1: Block = { ...block1, nextId: 'block2' };
    const sequenceBlock2: Block = {
      ...block2,
      prevId: 'block1',
      nextId: 'block3',
    };
    const sequenceBlock3: Block = { ...block3, prevId: 'block2' };

    const blockToSnap: Block = {
      ...block1,
      id: 'block to snap',
      nextId: 'block5',
      coords: { x: 400, y: 400 },
    };

    const sequenceBlock5: Block = {
      ...block2,
      id: 'block5',
      prevId: 'block to snap',
      nextId: 'block6',
    };

    const sequenceBlock6: Block = {
      ...block1,
      id: 'block6',
      prevId: 'block5',
    };

    // Create the test canvas with the initial blocks
    const testCanvas = {
      ...initialCanvas,
      canvas: [
        sequenceBlock1,
        sequenceBlock2,
        sequenceBlock3,
        blockToSnap,
        sequenceBlock5,
        sequenceBlock6,
      ],
    };

    // Define expected blocks after the action
    const expectedSequenceBlock3: Block = {
      ...sequenceBlock3,
      nextId: 'block to snap',
    };
    const expectedBlockToSnap: Block = {
      ...blockToSnap,
      prevId: 'block3',
    };

    // Execute the action
    const newCanvas = BlocksReducer(testCanvas, action);

    // Add assertions
    expect(findBlockById('block3', newCanvas.canvas)!).toEqual(
      expectedSequenceBlock3
    );
    expect(findBlockById('block to snap', newCanvas.canvas)!).toEqual(
      expectedBlockToSnap
    );
  });

  test('Snaps sequence of blocks in the middle of a sequence of blocks correctly', () => {
    // Setup:
    // Initial: block1 -> block2 -> block3
    //          blockToSnap -> block5 -> block6
    // Expected: block1 -> block2 -> blockToSnap -> block5 -> block6 -> block3

    // Define the action to test
    const action: CanvasAction = {
      type: CanvasEvent.SNAP_BLOCK,
      payload: {
        id: 'block to snap',
        targetId: 'block2',
        position: OuterDropzonePosition.Bottom,
      },
    };

    const sequenceBlock1: Block = { ...block1, nextId: 'block2' };
    const sequenceBlock2: Block = {
      ...block2,
      prevId: 'block1',
      nextId: 'block3',
    };
    const sequenceBlock3: Block = { ...block3, prevId: 'block2' };

    const blockToSnap: Block = {
      ...block1,
      id: 'block to snap',
      nextId: 'block5',
      coords: { x: 400, y: 400 },
    };

    const sequenceBlock5: Block = {
      ...block2,
      id: 'block5',
      prevId: 'block to snap',
      nextId: 'block6',
    };

    const sequenceBlock6: Block = {
      ...block1,
      id: 'block6',
      prevId: 'block5',
    };

    // Create the test canvas with the initial blocks
    const testCanvas = {
      ...initialCanvas,
      canvas: [
        sequenceBlock1,
        sequenceBlock2,
        sequenceBlock3,
        blockToSnap,
        sequenceBlock5,
        sequenceBlock6,
      ],
    };

    // Define expected blocks after the action
    const expectedSequenceBlock2: Block = {
      ...sequenceBlock2,
      nextId: 'block to snap',
    };
    const expectedBlockToSnap: Block = {
      ...blockToSnap,
      prevId: 'block2',
    };
    const expectedSequenceBlock6: Block = {
      ...sequenceBlock6,
      nextId: 'block3',
    };
    const expectedSequenceBlock3: Block = {
      ...sequenceBlock3,
      prevId: 'block6',
    };

    // Execute the action
    const newCanvas = BlocksReducer(testCanvas, action);

    // Add assertions
    expect(findBlockById('block2', newCanvas.canvas)!).toEqual(
      expectedSequenceBlock2
    );
    expect(findBlockById('block to snap', newCanvas.canvas)!).toEqual(
      expectedBlockToSnap
    );
    expect(findBlockById('block6', newCanvas.canvas)!).toEqual(
      expectedSequenceBlock6
    );
    expect(findBlockById('block3', newCanvas.canvas)!).toEqual(
      expectedSequenceBlock3
    );
  });

  describe('Snaps to nested block(s)', () => {
    // Setup:
    // 1. An empty while block
    // 2. Sequence a -> b -> c
    // 3. Sequence d -> e -> f
    // 4. A single block 'single'
    const parent: WhileBlock = {
      id: 'parent',
      type: BlockType.While,
      shape: BlockShape.Square,
      state: BlockState.Idle,
      coords: { x: 0, y: 0 },
      isWorkbenchBlock: false,
      parentId: null,
      prevId: null,
      nextId: null,
      children: {
        condition: [],
        body: [],
      },
    };

    const blockA: EmptyBlock = {
      id: 'a',
      type: BlockType.Empty,
      shape: BlockShape.Square,
      state: BlockState.Idle,
      coords: { x: 0, y: 0 },
      isWorkbenchBlock: false,
      parentId: null,
      prevId: null,
      nextId: 'b',
      children: null,
    };
    const blockB: EmptyBlock = {
      id: 'b',
      type: BlockType.Empty,
      shape: BlockShape.Square,
      state: BlockState.Idle,
      coords: { x: 0, y: 0 },
      isWorkbenchBlock: false,
      parentId: null,
      prevId: 'a',
      nextId: 'c',
      children: null,
    };
    const blockC: EmptyBlock = {
      id: 'c',
      type: BlockType.Empty,
      shape: BlockShape.Square,
      state: BlockState.Idle,
      coords: { x: 0, y: 0 },
      isWorkbenchBlock: false,
      parentId: null,
      prevId: 'b',
      nextId: null,
      children: null,
    };

    const blockD: EmptyBlock = {
      id: 'd',
      type: BlockType.Empty,
      shape: BlockShape.Square,
      state: BlockState.Idle,
      coords: { x: 0, y: 0 },
      isWorkbenchBlock: false,
      parentId: null,
      prevId: null,
      nextId: 'e',
      children: null,
    };
    const blockE: EmptyBlock = {
      id: 'e',
      type: BlockType.Empty,
      shape: BlockShape.Square,
      state: BlockState.Idle,
      coords: { x: 0, y: 0 },
      isWorkbenchBlock: false,
      parentId: null,
      prevId: 'd',
      nextId: 'f',
      children: null,
    };
    const blockF: EmptyBlock = {
      id: 'f',
      type: BlockType.Empty,
      shape: BlockShape.Square,
      state: BlockState.Idle,
      coords: { x: 0, y: 0 },
      isWorkbenchBlock: false,
      parentId: null,
      prevId: 'e',
      nextId: null,
      children: null,
    };

    const singleBlock: EmptyBlock = {
      id: 'single',
      type: BlockType.Empty,
      shape: BlockShape.Square,
      state: BlockState.Idle,
      coords: { x: 0, y: 0 },
      isWorkbenchBlock: false,
      parentId: null,
      prevId: null,
      nextId: null,
      children: null,
    };

    test('Snaps single block above nested single or nested sequence of blocks correctly', () => {
      // Setup canvas
      const testTarget: EmptyBlock = {
        ...singleBlock,
        id: 'target',
        parentId: 'parent',
      };
      const testBlockToSnap: EmptyBlock = {
        ...singleBlock,
        id: 'block to snap',
      };
      const testParent: WhileBlock = {
        ...parent,
        children: {
          condition: [],
          body: [{ ...testTarget }],
        },
      };

      const testCanvas: CanvasState = {
        ...initialCanvas,
        canvas: [testParent, testBlockToSnap],
      };

      // Setup action
      const action: CanvasAction = {
        type: CanvasEvent.SNAP_BLOCK,
        payload: {
          id: 'block to snap',
          targetId: 'target',
          position: OuterDropzonePosition.Top,
        },
      };

      // Apply reducer
      const newCanvas = BlocksReducer(testCanvas, action);

      // Assertions
      const expectedTarget: EmptyBlock = {
        ...testTarget,
        prevId: 'block to snap',
      };
      const expectedBlockToSnap: EmptyBlock = {
        ...testBlockToSnap,
        parentId: 'parent',
        nextId: 'target',
      };
      const expectedParent: WhileBlock = {
        ...testParent,
        children: {
          condition: [],
          body: [{ ...expectedTarget }, { ...expectedBlockToSnap }],
        },
      };

      expect(findBlockById('parent', newCanvas.canvas)).toEqual(expectedParent);
      expect(findBlockById('target', newCanvas.canvas)).toEqual(expectedTarget);
      expect(findBlockById('block to snap', newCanvas.canvas)).toEqual(
        expectedBlockToSnap
      );
    });

    test('Snaps single block below nested single block or nested sequence of blocks correctly', () => {
      // Setup canvas
      const testTarget: EmptyBlock = {
        ...singleBlock,
        id: 'target',
        parentId: 'parent',
      };
      const testBlockToSnap: EmptyBlock = {
        ...singleBlock,
        id: 'block to snap',
      };
      const testParent: WhileBlock = {
        ...parent,
        children: {
          condition: [],
          body: [{ ...testTarget }],
        },
      };

      const testCanvas: CanvasState = {
        ...initialCanvas,
        canvas: [testParent, testBlockToSnap],
      };

      // Setup action
      const action: CanvasAction = {
        type: CanvasEvent.SNAP_BLOCK,
        payload: {
          id: 'block to snap',
          targetId: 'target',
          position: OuterDropzonePosition.Bottom,
        },
      };

      // Apply reducer
      const newCanvas = BlocksReducer(testCanvas, action);

      // Assertions
      const expectedTarget: EmptyBlock = {
        ...testTarget,
        nextId: 'block to snap',
      };
      const expectedBlockToSnap: EmptyBlock = {
        ...testBlockToSnap,
        parentId: 'parent',
        prevId: 'target',
      };
      const expectedParent: WhileBlock = {
        ...testParent,
        children: {
          condition: [],
          body: [{ ...expectedTarget }, { ...expectedBlockToSnap }],
        },
      };

      expect(findBlockById('parent', newCanvas.canvas)).toEqual(expectedParent);
      expect(findBlockById('target', newCanvas.canvas)).toEqual(expectedTarget);
      expect(findBlockById('block to snap', newCanvas.canvas)).toEqual(
        expectedBlockToSnap
      );
    });

    test('Snaps sequence of blocks above nested sequence of blocks correctly', () => {
      // Setup:
      //      While block with nested sequence A -> B -> C
      //      Sequence D -> E -> F
      //      Objective: Snap D above A
      // Expected result:
      //      While block with nested sequence D -> E -> F -> A -> B -> C

      // Setup canvas
      const testBlockA: EmptyBlock = {
        ...blockA,
        parentId: 'parent',
      };
      const testBlockB: EmptyBlock = {
        ...blockB,
        parentId: 'parent',
      };
      const testBlockC: EmptyBlock = {
        ...blockC,
        parentId: 'parent',
      };
      const testParent: WhileBlock = {
        ...parent,
        children: {
          condition: [],
          body: [{ ...testBlockA }, { ...testBlockB }, { ...testBlockC }],
        },
      };

      const testBlockD = { ...blockD };
      const testBlockE = { ...blockE };
      const testBlockF = { ...blockF };

      const testCanvas: CanvasState = {
        ...initialCanvas,
        canvas: [testParent, testBlockD, testBlockE, testBlockF],
      };

      // Setup action
      const action: CanvasAction = {
        type: CanvasEvent.SNAP_BLOCK,
        payload: {
          id: 'd',
          targetId: 'a',
          position: OuterDropzonePosition.Top,
        },
      };

      // Apply reducer
      const newCanvas = BlocksReducer(testCanvas, action);

      // Setup expected result
      const expectedA: EmptyBlock = { ...testBlockA, prevId: 'f' };
      const expectedB: EmptyBlock = { ...testBlockB };
      const expectedC: EmptyBlock = { ...testBlockC };
      const expectedD: EmptyBlock = { ...testBlockD, parentId: 'parent' };
      const expectedE: EmptyBlock = { ...testBlockE, parentId: 'parent' };
      const expectedF: EmptyBlock = {
        ...testBlockF,
        parentId: 'parent',
        nextId: 'a',
      };

      // Assertions
      expect(findBlockById('a', newCanvas.canvas)).toEqual(expectedA);
      expect(findBlockById('b', newCanvas.canvas)).toEqual(expectedB);
      expect(findBlockById('c', newCanvas.canvas)).toEqual(expectedC);
      expect(findBlockById('d', newCanvas.canvas)).toEqual(expectedD);
      expect(findBlockById('e', newCanvas.canvas)).toEqual(expectedE);
      expect(findBlockById('f', newCanvas.canvas)).toEqual(expectedF);
      expect(newCanvas.canvas.length).toBe(1); // Should only have a single while block in the canvas with the full sequence in it
      expect((newCanvas.canvas[0] as WhileBlock).children.body.length).toBe(6);
    });

    test('Snaps sequence of blocks below nested sequence of blocks correctly', () => {
      // Setup:
      //      While block with nested sequence A -> B -> C
      //      Sequence D -> E -> F
      //      Objective: Snap D above A
      // Expected result:
      //      While block with nested sequence A -> B -> C -> D -> E -> F

      // Setup canvas
      const testBlockA: EmptyBlock = {
        ...blockA,
        parentId: 'parent',
      };
      const testBlockB: EmptyBlock = {
        ...blockB,
        parentId: 'parent',
      };
      const testBlockC: EmptyBlock = {
        ...blockC,
        parentId: 'parent',
      };
      const testParent: WhileBlock = {
        ...parent,
        children: {
          condition: [],
          body: [{ ...testBlockA }, { ...testBlockB }, { ...testBlockC }],
        },
      };

      const testBlockD = { ...blockD };
      const testBlockE = { ...blockE };
      const testBlockF = { ...blockF };

      const testCanvas: CanvasState = {
        ...initialCanvas,
        canvas: [testParent, testBlockD, testBlockE, testBlockF],
      };

      // Setup action
      const action: CanvasAction = {
        type: CanvasEvent.SNAP_BLOCK,
        payload: {
          id: 'd',
          position: OuterDropzonePosition.Bottom,
          targetId: 'c',
        },
      };

      // Apply reducer
      const newCanvas = BlocksReducer(testCanvas, action);

      // Setup expected result
      const expectedA: EmptyBlock = { ...testBlockA };
      const expectedB: EmptyBlock = { ...testBlockB };
      const expectedC: EmptyBlock = { ...testBlockC, nextId: 'd' };
      const expectedD: EmptyBlock = {
        ...testBlockD,
        parentId: 'parent',
        prevId: 'c',
      };
      const expectedE: EmptyBlock = { ...testBlockE, parentId: 'parent' };
      const expectedF: EmptyBlock = { ...testBlockF, parentId: 'parent' };

      // Assertions
      expect(findBlockById('a', newCanvas.canvas)).toEqual(expectedA);
      expect(findBlockById('b', newCanvas.canvas)).toEqual(expectedB);
      expect(findBlockById('c', newCanvas.canvas)).toEqual(expectedC);
      expect(findBlockById('d', newCanvas.canvas)).toEqual(expectedD);
      expect(findBlockById('e', newCanvas.canvas)).toEqual(expectedE);
      expect(findBlockById('f', newCanvas.canvas)).toEqual(expectedF);
      // Should only have a single while block in the canvas with the full sequence in it
      expect(newCanvas.canvas.length).toBe(1);
      expect((newCanvas.canvas[0] as WhileBlock).children.body.length).toBe(6);
    });

    test('Snaps sequence of blocks between nested sequence of blocks correctly', () => {
      // Setup:
      //      While block with nested sequence A -> B -> C
      //      Sequence D -> E -> F
      //      Objective: Snap D below A
      // Expected result:
      //      While block with nested sequence A -> D -> E -> F -> B -> C

      // Setup canvas
      const testBlockA: EmptyBlock = {
        ...blockA,
        parentId: 'parent',
      };
      const testBlockB: EmptyBlock = {
        ...blockB,
        parentId: 'parent',
      };
      const testBlockC: EmptyBlock = {
        ...blockC,
        parentId: 'parent',
      };
      const testParent: WhileBlock = {
        ...parent,
        children: {
          condition: [],
          body: [{ ...testBlockA }, { ...testBlockB }, { ...testBlockC }],
        },
      };

      const testBlockD = { ...blockD };
      const testBlockE = { ...blockE };
      const testBlockF = { ...blockF };

      const testCanvas: CanvasState = {
        ...initialCanvas,
        canvas: [testParent, testBlockD, testBlockE, testBlockF],
      };

      // Setup action
      const action: CanvasAction = {
        type: CanvasEvent.SNAP_BLOCK,
        payload: {
          id: 'd',
          position: OuterDropzonePosition.Bottom,
          targetId: 'a',
        },
      };

      // Apply reducer
      const newCanvas = BlocksReducer(testCanvas, action);

      // Setup expected result
      const expectedA: EmptyBlock = { ...testBlockA, nextId: 'd' };
      const expectedD: EmptyBlock = {
        ...testBlockD,
        parentId: 'parent',
        prevId: 'a',
      };
      const expectedE: EmptyBlock = { ...testBlockE, parentId: 'parent' };
      const expectedF: EmptyBlock = {
        ...testBlockF,
        parentId: 'parent',
        nextId: 'b',
      };
      const expectedB: EmptyBlock = { ...testBlockB, prevId: 'f' };
      const expectedC: EmptyBlock = { ...testBlockC };

      // Assertions
      expect(findBlockById('a', newCanvas.canvas)).toEqual(expectedA);
      expect(findBlockById('b', newCanvas.canvas)).toEqual(expectedB);
      expect(findBlockById('c', newCanvas.canvas)).toEqual(expectedC);
      expect(findBlockById('d', newCanvas.canvas)).toEqual(expectedD);
      expect(findBlockById('e', newCanvas.canvas)).toEqual(expectedE);
      expect(findBlockById('f', newCanvas.canvas)).toEqual(expectedF);
      // Should only have a single while block in the canvas with the full sequence in it
      expect(newCanvas.canvas.length).toBe(1);
      expect((newCanvas.canvas[0] as WhileBlock).children.body.length).toBe(6);
    });
  });
});
