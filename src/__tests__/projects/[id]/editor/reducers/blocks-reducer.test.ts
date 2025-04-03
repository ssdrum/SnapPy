import {
  CanvasAction,
  CanvasEvent,
} from '@/app/projects/[id]/editor/blocks/canvas-api';
import {
  BlockState,
  CanvasState,
  BlockType,
} from '@/app/projects/[id]/editor/blocks/types';
import BlocksReducer from '@/app/projects/[id]/editor/reducers/blocks-reducer';

describe('BlocksReducer', () => {
  // Common test fixtures
  const initialState: CanvasState = {
    canvas: [
      {
        id: 'block1',
        type: BlockType.Empty,
        state: BlockState.Idle,
        coords: { x: 100, y: 100 },
        lastDelta: undefined,
        isWorkbenchBlock: false,
        stackOptions: { top: true, bottom: true },
        parentId: null,
        prevBlockId: null,
        nextBlockId: null,
        children: [],
      },
      {
        id: 'block2',
        type: BlockType.Empty,
        state: BlockState.Idle,
        coords: { x: 200, y: 200 },
        lastDelta: undefined,
        isWorkbenchBlock: false,
        stackOptions: { top: true, bottom: true },
        parentId: null,
        prevBlockId: null,
        nextBlockId: null,
        children: [],
      },
      {
        id: 'varBlock',
        type: BlockType.Variable,
        state: BlockState.Idle,
        coords: { x: 300, y: 300 },
        lastDelta: undefined,
        isWorkbenchBlock: false,
        stackOptions: { top: true, bottom: true },
        parentId: null,
        prevBlockId: null,
        nextBlockId: null,
        children: [],
        selected: 'x',
      },
    ],
    workbench: [
      {
        id: 'workbench1',
        type: BlockType.Empty,
        state: BlockState.Idle,
        coords: { x: 50, y: 50 },
        lastDelta: undefined,
        isWorkbenchBlock: true,
        stackOptions: { top: true, bottom: true },
        parentId: null,
        prevBlockId: null,
        nextBlockId: null,
        children: [],
      },
      {
        id: 'workbenchVar',
        type: BlockType.Variable,
        state: BlockState.Idle,
        coords: { x: 150, y: 50 },
        lastDelta: undefined,
        isWorkbenchBlock: true,
        stackOptions: { top: true, bottom: true },
        parentId: null,
        prevBlockId: null,
        nextBlockId: null,
        children: [],
        selected: '',
      },
    ],
    variables: ['x', 'y'],
    selectedBlockId: null,
    draggedBlockId: null,
    draggedGroupBlockIds: null,
    highlightedDropZoneId: null,
  };

  // --------------- Add tests here ------------------
  //
  test('SELECT_BLOCK should mark a block as selected and update selectedBlockId', () => {
    const action: CanvasAction = {
      type: CanvasEvent.SELECT_BLOCK,
      payload: { id: 'block1' },
    };

    const newState = BlocksReducer(initialState, action);

    expect(newState.selectedBlockId).toBe('block1');
    expect(newState.canvas.find((b) => b.id === 'block1')!.state).toBe(
      BlockState.Selected
    );
  });

  test('DESELECT_BLOCK should mark a block as idle and set selectedBlockId to null', () => {
    // Set up a state with a selected block
    const stateWithSelectedBlock = {
      ...initialState,
      selectedBlockId: 'block1',
      canvas: initialState.canvas.map((block) =>
        block.id === 'block1' ? { ...block, state: BlockState.Selected } : block
      ),
    };

    // Dispatch DESELECT_BLOCK action
    const action: CanvasAction = {
      type: CanvasEvent.DESELECT_BLOCK,
    };

    // Apply the reducer
    const newState = BlocksReducer(stateWithSelectedBlock, action);

    // Check that the block state is now Idle
    const updatedBlock = newState.canvas.find(
      (block) => block.id === 'block1'
    )!;

    // Assert the expected changes
    expect(updatedBlock.state).toBe(BlockState.Idle);
    expect(newState.selectedBlockId).toBeNull();
  });
});
