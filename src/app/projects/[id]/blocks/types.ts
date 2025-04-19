import { Coordinates } from '@dnd-kit/utilities';

export enum BlockType {
  ProgramStart = 'program start',
  Variable = 'variable',
  VariableValue = 'variable value',
  While = 'while',
  Number = 'number',
  String = 'string',
  Math = 'math',
  Boolean = 'boolean',
  Comparison = 'comparison',
  Logical = 'logical',
  If = 'if',
  IfElse = 'if else',
  For = 'for',
  Print = 'print',
  Empty = 'empty', // Only used for testing
}

export enum BlockState {
  Idle = 'idle',
  Selected = 'selected',
  Dragging = 'dragging',
  Nested = 'nested',
}

export enum BlockShape {
  Round = 'round',
  Square = 'square',
}

export interface BlockChildren {
  [key: string]: Block[];
}

export enum OuterDropzonePosition {
  Top = 'top',
  Bottom = 'bottom',
}

export enum MathOperator {
  Addition = '+',
  Subtraction = '-',
  Multiplication = '*',
  Division = '/',
  Modulo = '%',
}

export enum ComparisonOperator {
  Equal = '==',
  NotEqual = '!=',
  GreaterThan = '>',
  LessThan = '<',
  GreaterThanOrEqual = '>=',
  LessThanOrEqual = '<=',
}

export enum LogicalOperator {
  And = 'and',
  Or = 'or',
  Not = 'not',
}

export enum BooleanValue {
  True = 'True',
  False = 'False',
}

export interface CanvasState {
  workbench: Block[];
  canvas: Block[];
  variables: string[];
  selectedBlockId: string | null;
  draggedBlockId: string | null;
  draggedGroupBlockIds: Set<string> | null;
  highlightedDropZoneId: string | null;
  entrypointBlockId: string | null;
}

/**
 * Main interface for all blocks
 */
interface BaseBlock {
  id: string;
  type: BlockType;
  shape: BlockShape;
  state: BlockState;
  coords: Coordinates;
  isWorkbenchBlock: boolean;
  parentId: string | null;
  prevId: string | null;
  nextId: string | null;
}

export interface ProgramStartBlock extends BaseBlock {
  type: BlockType.ProgramStart;
  shape: BlockShape.Square;
  children: null;
}

export interface EmptyBlock extends BaseBlock {
  type: BlockType.Empty;
  shape: BlockShape.Square;
  children: null;
}

export interface VariableBlock extends BaseBlock {
  type: BlockType.Variable;
  shape: BlockShape.Square;
  selected: string;
  children: {
    expression: Block[];
  };
}

export interface VariableValueBlock extends BaseBlock {
  type: BlockType.VariableValue;
  shape: BlockShape.Round;
  selected: string;
  children: null;
}

export interface WhileBlock extends BaseBlock {
  type: BlockType.While;
  shape: BlockShape.Square;
  children: {
    condition: Block[];
    body: Block[];
  };
}

export interface NumberBlock extends BaseBlock {
  type: BlockType.Number;
  shape: BlockShape.Round;
  value: string;
  children: null;
}

export interface StringBlock extends BaseBlock {
  type: BlockType.String;
  shape: BlockShape.Round;
  value: string;
  children: null;
}

export interface MathBlock extends BaseBlock {
  type: BlockType.Math;
  shape: BlockShape.Round;
  operator: MathOperator;
  children: {
    left: Block[];
    right: Block[];
  };
}

export interface BooleanBlock extends BaseBlock {
  type: BlockType.Boolean;
  shape: BlockShape.Round;
  value: BooleanValue;
  children: null;
}

export interface ComparisonBlock extends BaseBlock {
  type: BlockType.Comparison;
  shape: BlockShape.Round;
  operator: ComparisonOperator;
  children: {
    left: Block[];
    right: Block[];
  };
}

export interface LogicalBlockBase extends BaseBlock {
  type: BlockType.Logical;
  shape: BlockShape.Round;
}

export interface LogicalBlockBinary extends LogicalBlockBase {
  operator: LogicalOperator.And | LogicalOperator.Or;
  children: {
    left: Block[];
    right: Block[];
  };
}

export interface LogicalBlockUnary extends LogicalBlockBase {
  operator: LogicalOperator.Not;
  children: {
    operand: Block[];
  };
}

export type LogicalBlock = LogicalBlockBinary | LogicalBlockUnary;

export interface IfBlock extends BaseBlock {
  type: BlockType.If;
  shape: BlockShape.Square;
  children: {
    condition: Block[];
    body: Block[];
  };
}

export interface IfElseBlock extends BaseBlock {
  type: BlockType.IfElse;
  shape: BlockShape.Square;
  children: {
    condition: Block[];
    ifBody: Block[];
    elseBody: Block[];
  };
}

export interface ForBlock extends BaseBlock {
  type: BlockType.For;
  shape: BlockShape.Square;
  children: {
    expression: Block[];
    body: Block[];
  };
}

export interface PrintBlock extends BaseBlock {
  type: BlockType.Print;
  shape: BlockShape.Square;
  children: {
    expression: Block[];
  };
}

/**
 * Union of all blocks
 */
export type Block =
  | ProgramStartBlock
  | VariableBlock
  | VariableValueBlock
  | WhileBlock
  | NumberBlock
  | StringBlock
  | MathBlock
  | EmptyBlock
  | BooleanBlock
  | ComparisonBlock
  | LogicalBlock
  | IfBlock
  | IfElseBlock
  | ForBlock
  | PrintBlock;
