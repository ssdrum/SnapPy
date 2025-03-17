import withDraggableBlock from '../components/with-draggable-block';
import { DataType, VariableValue } from './types';

interface VariableProps {
  name: string;
  dataType: DataType;
  value: VariableValue;
}

function Variable({ name }: VariableProps) {
  return <div>Set {name} to</div>;
}

export default withDraggableBlock(Variable);
