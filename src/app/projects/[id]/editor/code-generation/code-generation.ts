import { Block, BlockType, VariableBlock, NumberBlock } from '../blocks/types';

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
    case BlockType.Variable: {
      return visitVariable(ctx, block);
    }
    case BlockType.Number: {
      return visitNumber(block);
    }
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
