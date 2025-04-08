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

    const parent = findBlockById(newCanvas.canvas, 'block3')! as VariableBlock;
    const child = findBlockById(newCanvas.canvas, 'block1')! as EmptyBlock;
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
});
