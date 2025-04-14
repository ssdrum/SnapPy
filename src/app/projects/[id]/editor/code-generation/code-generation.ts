import {
  Block,
  BlockType,
  VariableBlock,
  NumberBlock,
  MathBlock,
  BooleanBlock,
  ComparisonBlock,
  LogicalBlock,
  LogicalBlockUnary,
  LogicalBlockBinary,
  IfBlock,
  WhileBlock,
} from '../blocks/types';
import { isLogicalBinaryOperator } from '../utils/utils';

interface Context {
  indent: number;
  output: string[];
}

function getIndent(ctx: Context): string {
  return '    '.repeat(ctx.indent);
}

function addLine(ctx: Context, line: string): void {
  ctx.output.push(getIndent(ctx) + line);
}

export function generateCode(blocks: Block[]): string {
  const ctx: Context = { indent: 0, output: [] };

  for (const block of blocks) {
    visitBlock(ctx, block);
  }

  return ctx.output.join('\n');
}

function visitBlock(ctx: Context, block: Block) {
  switch (block.type) {
    case BlockType.Variable:
      return visitVariable(ctx, block);
    case BlockType.Number:
      return visitNumber(block);
    case BlockType.Math:
      return visitMath(ctx, block);
    case BlockType.Boolean:
      return visitBoolean(block);
    case BlockType.Comparison:
      return visitComparison(ctx, block);
    case BlockType.Logical:
      return visitLogical(ctx, block);
    case BlockType.If:
      return visitIf(ctx, block);
    case BlockType.While:
      return visitWhile(ctx, block);
    default:
      return '';
  }
}

function visitVariable(ctx: Context, block: VariableBlock) {
  let expressionCode = '';

  if (block.children.expression.length > 0) {
    expressionCode = visitExpression(ctx, block.children.expression);
  } else {
    expressionCode = 'None';
  }

  addLine(ctx, `${block.selected} = ${expressionCode}`);

  return '';
}

function visitExpression(ctx: Context, blocks: Block[]) {
  return visitBlock(ctx, blocks[0]);
}

function visitNumber(block: NumberBlock) {
  return block.value;
}

function visitMath(ctx: Context, block: MathBlock) {
  let leftCode = '';
  let rightCode = '';

  if (block.children.left.length > 0) {
    leftCode = visitExpression(ctx, block.children.left);
  }
  if (block.children.right.length > 0) {
    rightCode = visitExpression(ctx, block.children.right);
  }

  return `(${leftCode} ${block.operator} ${rightCode})`;
}

function visitBoolean(block: BooleanBlock) {
  return block.value;
}

function visitComparison(ctx: Context, block: ComparisonBlock) {
  let leftCode = '';
  let rightCode = '';

  if (block.children.left.length > 0) {
    leftCode = visitExpression(ctx, block.children.left);
  }
  if (block.children.right.length > 0) {
    rightCode = visitExpression(ctx, block.children.right);
  }

  return `(${leftCode} ${block.operator} ${rightCode})`;
}

function visitLogical(ctx: Context, block: LogicalBlock) {
  // Binary operators (and, or)
  if (isLogicalBinaryOperator(block.operator)) {
    const binaryOpBlock = block as LogicalBlockBinary;

    let leftCode = '';
    let rightCode = '';

    if (binaryOpBlock.children.left.length > 0) {
      leftCode = visitExpression(ctx, binaryOpBlock.children.left);
    }
    if (binaryOpBlock.children.right.length > 0) {
      rightCode = visitExpression(ctx, binaryOpBlock.children.right);
    }

    return `(${leftCode} ${block.operator} ${rightCode})`;
  }

  // Unary operators (not)
  const unaryOpBlock = block as LogicalBlockUnary;

  let operandCode = '';

  if (unaryOpBlock.children.operand.length > 0) {
    operandCode = visitExpression(ctx, unaryOpBlock.children.operand);
  }

  return `(${unaryOpBlock.operator} ${operandCode})`;
}

function visitIf(ctx: Context, block: IfBlock) {
  let conditionCode = '';
  if (block.children.condition.length > 0) {
    conditionCode = visitExpression(ctx, block.children.condition);
  } else {
    conditionCode = 'True'; // Default condition if none provided
  }

  addLine(ctx, `if ${conditionCode}:`);

  ctx.indent++;

  // If no body blocks, add a pass statement
  if (block.children.body.length === 0) {
    addLine(ctx, 'pass');
  } else {
    for (const bodyBlock of block.children.body) {
      visitBlock(ctx, bodyBlock);
    }
  }

  // Restore the original indentation
  ctx.indent--;

  return '';
}

function visitWhile(ctx: Context, block: WhileBlock) {
  let conditionCode = '';
  if (block.children.condition.length > 0) {
    conditionCode = visitExpression(ctx, block.children.condition);
  } else {
    conditionCode = 'True'; // Default condition if none provided
  }

  addLine(ctx, `while ${conditionCode}:`);

  ctx.indent++;

  // If no body blocks, add a pass statement
  if (block.children.body.length === 0) {
    addLine(ctx, 'pass');
  } else {
    for (const bodyBlock of block.children.body) {
      visitBlock(ctx, bodyBlock);
    }
  }

  // Restore the original indentation
  ctx.indent--;

  return '';
}
