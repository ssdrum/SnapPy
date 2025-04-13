import {
  IconPlus,
  IconMinus,
  IconX,
  IconDivide,
  IconEqual,
  IconEqualNot,
  IconMathGreater,
  IconMathLower,
  IconMathEqualGreater,
  IconMathEqualLower,
} from '@tabler/icons-react';
import { MathOperator, ComparisonOperator } from './types';

interface OperatorIconProps {
  operator: MathOperator | ComparisonOperator;
}

export function OperatorIcon({ operator }: OperatorIconProps) {
  // Larger icon size, but still fits in 40px container
  const size = 30;
  const color = 'white';
  const stroke = 2.5; // Increased stroke for better visibility

  // Map operators to their corresponding icons
  switch (operator) {
    // Math operators
    case MathOperator.Addition:
      return <IconPlus size={size} color={color} stroke={stroke} />;
    case MathOperator.Subtraction:
      return <IconMinus size={size} color={color} stroke={stroke} />;
    case MathOperator.Multiplication:
      return <IconX size={size} color={color} stroke={stroke} />;
    case MathOperator.Division:
      return <IconDivide size={size} color={color} stroke={stroke} />;

    // Comparison operators
    case ComparisonOperator.Equal:
      return <IconEqual size={size} color={color} stroke={stroke} />;
    case ComparisonOperator.NotEqual:
      return <IconEqualNot size={size} color={color} stroke={stroke} />;
    case ComparisonOperator.GreaterThan:
      return <IconMathGreater size={size} color={color} stroke={stroke} />;
    case ComparisonOperator.LessThan:
      return <IconMathLower size={size} color={color} stroke={stroke} />;
    case ComparisonOperator.GreaterThanOrEqual:
      return <IconMathEqualGreater size={size} color={color} stroke={stroke} />;
    case ComparisonOperator.LessThanOrEqual:
      return <IconMathEqualLower size={size} color={color} stroke={stroke} />;

    // Fallback for unknown operators
    default:
      return <span>{operator}</span>;
  }
}
