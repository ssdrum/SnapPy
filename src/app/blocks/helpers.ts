import { Coordinates } from '@dnd-kit/core/dist/types';

export function calcOffset(
  localRef: React.RefObject<HTMLDivElement | null>
): Coordinates {
  const offset: Coordinates = { x: 0, y: 0 };
  const rect = localRef.current?.getBoundingClientRect(); // Get block's bounding rectangle

  if (!rect) {
    console.error('calcOffsetRelativeToPage: rect is undefined.');
    return offset;
  }

  // Use the viewport coordinates directly
  offset.x = rect.left;
  offset.y = rect.top;

  return offset;
}
