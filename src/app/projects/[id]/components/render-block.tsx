import {
  Block,
  BlockType,
  LogicalBlockUnary,
  LogicalOperator,
} from '../blocks/types';
import Variable from '../blocks/variable';
import Empty from '../blocks/empty';
import While from '../blocks/while';
import Number from '../blocks/number';
import ProgramStart from '../blocks/program-start';
import Boolean from '../blocks/boolean';
import BinaryOp from '../blocks/binary-op';
import UnaryOp from '../blocks/unary-op';
import If from '../blocks/if';
import IfElse from '../blocks/if-else';
import For from '../blocks/for';
import VariableValue from '../blocks/variable-value';
import Print from '../blocks/print';
import String from '../blocks/string';
import Elif from '../blocks/elif';
import Else from '../blocks/else';

export default function renderBlock(block: Block, enableSequences: boolean) {
  const { id, prevId, isWorkbenchBlock, state, shape, children } = block;

  switch (block.type) {
    case BlockType.ProgramStart:
      return (
        <ProgramStart
          key={block.id}
          id={id}
          hasPrev={prevId !== null}
          isWorkbenchBlock={isWorkbenchBlock}
          blockType={BlockType.ProgramStart}
          blockShape={shape}
          blockState={state}
          enableSequences={enableSequences}
        >
          {children}
        </ProgramStart>
      );
    case BlockType.Variable:
      return (
        <Variable
          key={id}
          id={id}
          hasPrev={prevId !== null}
          isWorkbenchBlock={isWorkbenchBlock}
          blockType={BlockType.Variable}
          blockState={state}
          blockShape={shape}
          selected={block.selected}
          enableSequences={enableSequences}
        >
          {block.children}
        </Variable>
      );
    case BlockType.VariableValue:
      return (
        <VariableValue
          key={id}
          id={id}
          hasPrev={prevId !== null}
          isWorkbenchBlock={isWorkbenchBlock}
          blockType={BlockType.VariableValue}
          blockState={state}
          blockShape={shape}
          selected={block.selected}
          enableSequences={enableSequences}
        >
          {block.children}
        </VariableValue>
      );
    case BlockType.While:
      return (
        <While
          key={id}
          id={id}
          hasPrev={prevId !== null}
          isWorkbenchBlock={isWorkbenchBlock}
          blockType={BlockType.While}
          blockShape={shape}
          blockState={state}
          enableSequences={enableSequences}
        >
          {block.children}
        </While>
      );
    case BlockType.Number:
      return (
        <Number
          key={id}
          id={id}
          hasPrev={prevId !== null}
          isWorkbenchBlock={isWorkbenchBlock}
          blockType={BlockType.Number}
          blockShape={shape}
          blockState={state}
          enableSequences={enableSequences}
          value={block.value}
        >
          {children}
        </Number>
      );
    case BlockType.String:
      return (
        <String
          key={id}
          id={id}
          hasPrev={prevId !== null}
          isWorkbenchBlock={isWorkbenchBlock}
          blockType={BlockType.Number}
          blockShape={shape}
          blockState={state}
          enableSequences={enableSequences}
          value={block.value}
        >
          {children}
        </String>
      );
    case BlockType.Math:
    case BlockType.Comparison:
      return (
        <BinaryOp
          key={id}
          id={id}
          hasPrev={prevId !== null}
          isWorkbenchBlock={isWorkbenchBlock}
          blockType={block.type}
          blockShape={shape}
          blockState={state}
          enableSequences={enableSequences}
          operator={block.operator}
        >
          {block.children}
        </BinaryOp>
      );
    case BlockType.Boolean:
      return (
        <Boolean
          key={id}
          id={id}
          hasPrev={prevId !== null}
          isWorkbenchBlock={isWorkbenchBlock}
          blockType={BlockType.Boolean}
          blockShape={shape}
          blockState={state}
          enableSequences={enableSequences}
          value={block.value}
        >
          {children}
        </Boolean>
      );
    case BlockType.Logical:
      if (
        block.operator === LogicalOperator.And ||
        block.operator === LogicalOperator.Or
      ) {
        return (
          <BinaryOp
            key={id}
            id={id}
            hasPrev={prevId !== null}
            isWorkbenchBlock={isWorkbenchBlock}
            blockType={block.type}
            blockShape={shape}
            blockState={state}
            enableSequences={enableSequences}
            operator={block.operator}
          >
            {block.children}
          </BinaryOp>
        );
      } else {
        return (
          <UnaryOp
            key={id}
            id={id}
            hasPrev={prevId !== null}
            isWorkbenchBlock={isWorkbenchBlock}
            blockType={block.type}
            blockShape={shape}
            blockState={state}
            enableSequences={enableSequences}
            operator={LogicalOperator.Not}
          >
            {(block as LogicalBlockUnary).children}
          </UnaryOp>
        );
      }
    case BlockType.If: {
      return (
        <If
          key={id}
          id={id}
          hasPrev={prevId !== null}
          isWorkbenchBlock={isWorkbenchBlock}
          blockType={BlockType.If}
          blockShape={shape}
          blockState={state}
          enableSequences={enableSequences}
        >
          {block.children}
        </If>
      );
    }
    case BlockType.Elif: {
      return (
        <Elif
          key={id}
          id={id}
          hasPrev={prevId !== null}
          isWorkbenchBlock={isWorkbenchBlock}
          blockType={BlockType.If}
          blockShape={shape}
          blockState={state}
          enableSequences={enableSequences}
        >
          {block.children}
        </Elif>
      );
    }
    case BlockType.Else: {
      return (
        <Else
          key={id}
          id={id}
          hasPrev={prevId !== null}
          isWorkbenchBlock={isWorkbenchBlock}
          blockType={BlockType.If}
          blockShape={shape}
          blockState={state}
          enableSequences={enableSequences}
        >
          {block.children}
        </Else>
      );
    }
    case BlockType.IfElse: {
      return (
        <IfElse
          key={id}
          id={id}
          hasPrev={prevId !== null}
          isWorkbenchBlock={isWorkbenchBlock}
          blockType={BlockType.IfElse}
          blockShape={shape}
          blockState={state}
          enableSequences={enableSequences}
        >
          {block.children}
        </IfElse>
      );
    }
    case BlockType.For: {
      return (
        <For
          key={id}
          id={id}
          hasPrev={prevId !== null}
          isWorkbenchBlock={isWorkbenchBlock}
          blockType={BlockType.For}
          blockShape={shape}
          blockState={state}
          enableSequences={enableSequences}
        >
          {block.children}
        </For>
      );
    }
    case BlockType.Print: {
      return (
        <Print
          key={id}
          id={id}
          hasPrev={prevId !== null}
          isWorkbenchBlock={isWorkbenchBlock}
          blockType={BlockType.Print}
          blockShape={shape}
          blockState={state}
          enableSequences={enableSequences}
        >
          {block.children}
        </Print>
      );
    }
    default:
      return (
        <Empty
          key={block.id}
          id={id}
          hasPrev={prevId !== null}
          isWorkbenchBlock={isWorkbenchBlock}
          blockType={BlockType.Empty}
          blockShape={shape}
          blockState={state}
          enableSequences={enableSequences}
        >
          {children}
        </Empty>
      );
  }
}
