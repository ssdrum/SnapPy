import { Block, BlockType } from '../blocks/types';
import Variable from '../blocks/variable';
import Empty from '../blocks/empty';
import While from '../blocks/while';
import Number from '../blocks/number';
import Math from '../blocks/math';
import ProgramStart from '../blocks/program-start';
import Boolean from '../blocks/boolean';

export default function renderBlock(block: Block, enableSequences: boolean) {
  const { id, prevId, isWorkbenchBlock, state, children } = block;

  switch (block.type) {
    case BlockType.ProgramStart:
      return (
        <ProgramStart
          key={block.id}
          id={id}
          hasPrev={prevId !== null}
          isWorkbenchBlock={isWorkbenchBlock}
          blockType={BlockType.ProgramStart}
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
          selected={block.selected}
          enableSequences={enableSequences}
        >
          {block.children}
        </Variable>
      );
    case BlockType.While:
      return (
        <While
          key={id}
          id={id}
          hasPrev={prevId !== null}
          isWorkbenchBlock={isWorkbenchBlock}
          blockType={BlockType.While}
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
          blockState={state}
          enableSequences={enableSequences}
          value={block.value}
        >
          {children}
        </Number>
      );
    case BlockType.Math:
      return (
        <Math
          key={id}
          id={id}
          hasPrev={prevId !== null}
          isWorkbenchBlock={isWorkbenchBlock}
          blockType={BlockType.Math}
          blockState={state}
          enableSequences={enableSequences}
          operator={block.operator}
        >
          {block.children}
        </Math>
      );
    case BlockType.Boolean:
      return (
        <Boolean
          key={id}
          id={id}
          hasPrev={prevId !== null}
          isWorkbenchBlock={isWorkbenchBlock}
          blockType={BlockType.Boolean}
          blockState={state}
          enableSequences={enableSequences}
          value={block.value}
        >
          {children}
        </Boolean>
      );
    default:
      return (
        <Empty
          key={block.id}
          id={id}
          hasPrev={prevId !== null}
          isWorkbenchBlock={isWorkbenchBlock}
          blockType={BlockType.Empty}
          blockState={state}
          enableSequences={enableSequences}
        >
          {children}
        </Empty>
      );
  }
}
