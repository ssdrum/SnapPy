import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { PointerSensorOptions } from '@dnd-kit/core';

/**
 * Custom PointerSensor that prevents dragging when interacting with select elements
 */
export class SelectAwarePointerSensor extends PointerSensor {
  static activators = [
    {
      eventName: 'onPointerDown' as const,
      handler: ({ nativeEvent: event }: React.PointerEvent) => {
        // Skip sensor activation if the event originates from a select element or its children
        if (
          event.target instanceof Element &&
          (event.target.tagName.toLowerCase() === 'select' ||
            event.target.closest('select'))
        ) {
          return false;
        }

        // Continue with default activation logic
        return true;
      },
    },
  ];
}

/**
 * Hook that provides configured sensors for dnd-kit, including
 * custom handling for select elements
 */
export function useCustomSensors(options?: PointerSensorOptions) {
  const sensorOptions = {
    // Default options
    activationConstraint: {
      distance: 5, // 5px activation distance
    },
    // Override with any provided options
    ...options,
  };

  return useSensors(useSensor(SelectAwarePointerSensor, sensorOptions));
}
