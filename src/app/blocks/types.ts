import { Coordinates } from '@dnd-kit/utilities';

export enum BlockTypes {
  VARIABLE = 'variable',
  EMPTY = 'empty',
}

// Main interface for all blocks. Do not export. Must be extended like examples
// below
interface BlockInterface {
  id: number;
  type: BlockTypes;
  coords: Coordinates;
  isWorkbenchBlock: boolean;
}

export interface VariableBlock extends BlockInterface {
  name: string;
  value: string;
}

interface EmptyBlock extends BlockInterface {}

export type Block = VariableBlock | EmptyBlock;
