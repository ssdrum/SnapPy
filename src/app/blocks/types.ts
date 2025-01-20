import { Coordinates } from '@dnd-kit/utilities';

export enum BlockTypes {
  VARIABLE = 'variable',
  OTHER = 'other',
}

interface BlockInterface {
  id: number;
  type: BlockTypes;
  coords: Coordinates;
  isWorkbenchBlock: boolean;
}

interface VariableBlock extends BlockInterface {
  name: string;
  value: string;
}

interface TestBlock extends BlockInterface {}

export type Block = VariableBlock | TestBlock;
