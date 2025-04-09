import {
  CanvasAction,
  CanvasEvent,
} from '@/app/projects/[id]/editor/blocks/canvas-api';
import {
  BlockState,
  CanvasState,
  BlockType,
  Block,
  VariableBlock,
  EmptyBlock,
  WhileBlock,
  OuterDropzonePosition,
} from '@/app/projects/[id]/editor/blocks/types';
import BlocksReducer from '@/app/projects/[id]/editor/reducers/blocks-reducer';
import { findBlockById } from '@/app/projects/[id]/editor/utils/utils';

describe('BlocksReducer', () => {
  const block1: Block = {
    id: 'block1',
    type: BlockType.Empty,
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

  test('Snaps sequence of blocks in the middle of a sequence of blocks correctly (top snap)', () => {
    // Setup:
    // Initial: block1 -> block2 -> block3
    //          blockToSnap -> block5 -> block6
    // Expected: block1 -> block2 -> blockToSnap -> block5 -> block6 -> block3

    // Define the action to test
    const action: CanvasAction = {
      type: CanvasEvent.SNAP_BLOCK,
      payload: {
        id: 'block to snap',
        targetId: 'block3',
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

  test('Snaps sequence of blocks in the middle of a sequence of blocks correctly (bottom snap)', () => {
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

  //test('Snaps block below nested block correctly', () => {
  //  const action: CanvasAction = {
  //    type: CanvasEvent.SNAP_BLOCK,
  //    payload: {
  //      id: 'block to snap',
  //      targetId: 'block2',
  //      position: OuterDropzonePosition.Bottom,
  //    },
  //  };
  //
  //  const nested: Block = { ...block1, id: 'nested', parentId: 'parent' };
  //  const parent: WhileBlock = {
  //    ...block4,
  //    id: 'parent',
  //    children: { condition: [], body: [nested] },
  //  };
  //  const toNest: Block = { ...block1, id: 'to nest' };
  //
  //  const testCanvas = { ...initialCanvas, canvas: [parent, toNest] };
  //
  //  const expectedNested: EmptyBlock = { ...nested, nextId: 'to nest' };
  //  const expectedToNest: EmptyBlock = {
  //    ...toNest,
  //    parentId: 'parent',
  //    prevId: 'nested',
  //  };
  //  const expectedParent: WhileBlock = {
  //    ...parent,
  //    children: { condition: [], body: [expectedNested, expectedToNest] },
  //  };
  //
  //  const newCanvas = BlocksReducer(testCanvas, action);
  //  //console.log(newCanvas.canvas);
  //
  //  // Add assertions
  //  expect(findBlockById(newCanvas.canvas, 'parent')!).toEqual(expectedParent);
  //  expect(findBlockById(newCanvas.canvas, 'nested')!).toEqual(expectedNested);
  //  expect(findBlockById(newCanvas.canvas, 'to nest')!).toEqual(expectedToNest);
  //});
});
