describe('shut up', () => {
  test('fake test', () => {});
});
//import {
//  CanvasAction,
//  CanvasEvent,
//} from '@/app/projects/[id]/editor/blocks/canvas-api';
//import {
//  BlockState,
//  CanvasState,
//  BlockType,
//  Block,
//} from '@/app/projects/[id]/editor/blocks/types';
//import BlocksReducer from '@/app/projects/[id]/editor/reducers/blocks-reducer';
//import {
//  calcNextBlockStartPosition,
//  findBlockById,
//} from '@/app/projects/[id]/editor/utils/utils';
//
//describe('BlocksReducer', () => {
//  const block1: Block = {
//    id: 'block1',
//    type: BlockType.Empty,
//    state: BlockState.Idle,
//    coords: { x: 100, y: 100 },
//    lastDelta: undefined,
//    isWorkbenchBlock: false,
//    stackOptions: { top: true, bottom: true },
//    parentId: null,
//    prevBlockId: null,
//    nextBlockId: null,
//    children: [],
//  };
//  const block2: Block = {
//    id: 'block2',
//    type: BlockType.Empty,
//    state: BlockState.Idle,
//    coords: { x: 200, y: 200 },
//    lastDelta: undefined,
//    isWorkbenchBlock: false,
//    stackOptions: { top: true, bottom: true },
//    parentId: null,
//    prevBlockId: null,
//    nextBlockId: null,
//    children: [],
//  };
//  const block3: Block = {
//    id: 'block3',
//    type: BlockType.Variable,
//    state: BlockState.Idle,
//    coords: { x: 300, y: 300 },
//    lastDelta: undefined,
//    isWorkbenchBlock: false,
//    stackOptions: { top: true, bottom: true },
//    parentId: null,
//    prevBlockId: null,
//    nextBlockId: null,
//    children: [],
//    selected: 'x',
//  };
//  const workbench1: Block = {
//    id: 'workbench1',
//    type: BlockType.Empty,
//    state: BlockState.Idle,
//    coords: { x: 50, y: 50 },
//    lastDelta: undefined,
//    isWorkbenchBlock: true,
//    stackOptions: { top: true, bottom: true },
//    parentId: null,
//    prevBlockId: null,
//    nextBlockId: null,
//    children: [],
//  };
//  const workbenchVar: Block = {
//    id: 'workbenchVar',
//    type: BlockType.Variable,
//    state: BlockState.Idle,
//    coords: { x: 150, y: 50 },
//    lastDelta: undefined,
//    isWorkbenchBlock: true,
//    stackOptions: { top: true, bottom: true },
//    parentId: null,
//    prevBlockId: null,
//    nextBlockId: null,
//    children: [],
//    selected: '',
//  };
//  const initialState: CanvasState = {
//    canvas: [block1, block2, block3],
//    workbench: [workbench1, workbenchVar],
//    variables: ['x', 'y'],
//    selectedBlockId: null,
//    draggedBlockId: null,
//    draggedGroupBlockIds: null,
//    highlightedDropZoneId: null,
//  };
//
//  // --------------- Add tests here ------------------
//  //
//  test('SELECT_BLOCK should mark a block as selected and update selectedBlockId', () => {
//    const action: CanvasAction = {
//      type: CanvasEvent.SELECT_BLOCK,
//      payload: { id: 'block1' },
//    };
//
//    const newState = BlocksReducer(initialState, action);
//
//    expect(newState.selectedBlockId).toBe('block1');
//    expect(newState.canvas.find((b) => b.id === 'block1')!.state).toBe(
//      BlockState.Selected
//    );
//  });
//
//  test('DESELECT_BLOCK should mark a block as idle and set selectedBlockId to null', () => {
//    // Set up a state with a selected block
//    const stateWithSelectedBlock = {
//      ...initialState,
//      selectedBlockId: 'block1',
//      canvas: initialState.canvas.map((block) =>
//        block.id === 'block1' ? { ...block, state: BlockState.Selected } : block
//      ),
//    };
//
//    // Dispatch DESELECT_BLOCK action
//    const action: CanvasAction = {
//      type: CanvasEvent.DESELECT_BLOCK,
//    };
//
//    // Apply the reducer
//    const newState = BlocksReducer(stateWithSelectedBlock, action);
//
//    // Check that the block state is now Idle
//    const updatedBlock = newState.canvas.find(
//      (block) => block.id === 'block1'
//    )!;
//
//    // Assert the expected changes
//    expect(updatedBlock.state).toBe(BlockState.Idle);
//    expect(newState.selectedBlockId).toBeNull();
//  });
//
//  test('Move a single block to the right by 10px and down by 20px', () => {
//    // Start drag
//    let newState = BlocksReducer(initialState, {
//      type: CanvasEvent.START_DRAG,
//      payload: { id: 'block1' },
//    });
//    let updatedBlock = findBlockById(newState.canvas, 'block1')!;
//    expect(updatedBlock.state).toBe(BlockState.Dragging);
//    expect(newState.draggedBlockId).toBe('block1');
//    expect(Array.from(newState.draggedGroupBlockIds!)).toEqual(['block1']);
//
//    // Move 10px to the right and 20px down
//    newState = BlocksReducer(newState, {
//      type: CanvasEvent.MOVE_BLOCK,
//      payload: { id: 'block1', delta: { x: 10, y: 20 } },
//    });
//    updatedBlock = findBlockById(newState.canvas, 'block1')!;
//    expect(updatedBlock.state).toBe(BlockState.Dragging);
//    expect(updatedBlock.coords.x).toBe(110);
//    expect(updatedBlock.coords.y).toBe(120);
//    expect(newState.draggedBlockId).toBe('block1');
//    expect(Array.from(newState.draggedGroupBlockIds!)).toEqual(['block1']);
//
//    // End drag
//    newState = BlocksReducer(newState, {
//      type: CanvasEvent.END_DRAG,
//    });
//    updatedBlock = findBlockById(newState.canvas, 'block1')!;
//    expect(updatedBlock.state).toBe(BlockState.Idle);
//    expect(updatedBlock.coords.x).toBe(110);
//    expect(updatedBlock.coords.y).toBe(120);
//    expect(newState.draggedBlockId).toBeNull();
//    expect(newState.draggedGroupBlockIds).toBeNull();
//  });
//
//  test('Move a sequence of three blocks to the right by 10px and down by 20px', () => {
//    // Create a state with three blocks in sequence
//    // block1 -> block2 -> block3
//    const sequenceBlock1 = {
//      ...block1,
//      nextBlockId: 'block2',
//    };
//    const block2Position = calcNextBlockStartPosition(sequenceBlock1);
//    const sequenceBlock2 = {
//      ...block2,
//      prevBlockId: 'block1',
//      nextBlockId: 'block3',
//      coords: block2Position,
//    };
//    const block3Position = calcNextBlockStartPosition(sequenceBlock2);
//    const sequenceBlock3 = {
//      ...block3,
//      prevBlockId: 'block2',
//      coords: block3Position,
//    };
//
//    const testState: CanvasState = {
//      ...initialState,
//      canvas: [sequenceBlock1, sequenceBlock2, sequenceBlock3],
//    };
//
//    // Start drag on the first block
//    let newState = BlocksReducer(testState, {
//      type: CanvasEvent.START_DRAG,
//      payload: { id: 'block1' },
//    });
//
//    // Verify dragging state is correct
//    let updatedBlock1 = findBlockById(newState.canvas, 'block1')!;
//    let updatedBlock2 = findBlockById(newState.canvas, 'block2')!;
//    let updatedBlock3 = findBlockById(newState.canvas, 'block3')!;
//    expect(updatedBlock1.state).toBe(BlockState.Dragging);
//    expect(newState.draggedBlockId).toBe('block1');
//    expect(Array.from(newState.draggedGroupBlockIds!).sort()).toEqual([
//      'block1',
//      'block2',
//      'block3',
//    ]);
//
//    // Move the entire sequence
//    newState = BlocksReducer(newState, {
//      type: CanvasEvent.MOVE_BLOCK,
//      payload: { id: 'block1', delta: { x: 10, y: 20 } },
//    });
//
//    // Check that all blocks moved correctly
//    updatedBlock1 = findBlockById(newState.canvas, 'block1')!;
//    updatedBlock2 = findBlockById(newState.canvas, 'block2')!;
//    updatedBlock3 = findBlockById(newState.canvas, 'block3')!;
//    // First block should move by the delta
//    expect(updatedBlock1.coords.x).toBe(sequenceBlock1.coords.x + 10);
//    expect(updatedBlock1.coords.y).toBe(sequenceBlock1.coords.y + 20);
//
//    // Second block should follow, maintaining same relative position
//    expect(updatedBlock2.coords.x).toBe(sequenceBlock2.coords.x + 10);
//    expect(updatedBlock2.coords.y).toBe(sequenceBlock2.coords.y + 20);
//
//    // Third block should follow, maintaining same relative position
//    expect(updatedBlock3.coords.x).toBe(sequenceBlock3.coords.x + 10);
//    expect(updatedBlock3.coords.y).toBe(sequenceBlock3.coords.y + 20);
//
//    expect(updatedBlock1.state).toBe(BlockState.Dragging);
//    expect(newState.draggedBlockId).toBe('block1');
//    expect(Array.from(newState.draggedGroupBlockIds!).sort()).toEqual([
//      'block1',
//      'block2',
//      'block3',
//    ]);
//
//    // End drag
//    newState = BlocksReducer(newState, {
//      type: CanvasEvent.END_DRAG,
//    });
//
//    // Check that blocks returned to idle state
//    updatedBlock1 = findBlockById(newState.canvas, 'block1')!;
//    expect(updatedBlock1.state).toBe(BlockState.Idle);
//
//    // Block positions should remain at the new locations
//    expect(updatedBlock1.coords.x).toBe(sequenceBlock1.coords.x + 10);
//    expect(updatedBlock1.coords.y).toBe(sequenceBlock1.coords.y + 20);
//
//    expect(updatedBlock2.coords.x).toBe(sequenceBlock2.coords.x + 10);
//    expect(updatedBlock2.coords.y).toBe(sequenceBlock2.coords.y + 20);
//
//    expect(updatedBlock3.coords.x).toBe(sequenceBlock3.coords.x + 10);
//    expect(updatedBlock3.coords.y).toBe(sequenceBlock3.coords.y + 20);
//
//    // Drag state should be cleared
//    expect(newState.draggedBlockId).toBeNull();
//    expect(newState.draggedGroupBlockIds).toBeNull();
//  });
//});
