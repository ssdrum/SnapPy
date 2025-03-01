import useDraggableBlock from '@/app/hooks/useDraggableBlock';

// Base props that all draggable blocks will have
export interface DraggableBlockProps {
  id: number;
  top: number;
  left: number;
  isWorkbenchBlock: boolean;
}

// HOC that wraps all blocks to reduce repetition
export default function withDraggableBlock<T extends object>(
  WrappedBlock: React.ComponentType<T>
) {
  // Return a new component that includes draggable functionality
  const WithDraggable = (props: T & DraggableBlockProps) => {
    const { id, top, left, isWorkbenchBlock, ...restProps } = props;

    // Use the draggable hook
    const { attributes, listeners, setNodeRef, style } = useDraggableBlock(
      id,
      isWorkbenchBlock,
      top,
      left
    );

    return (
      // dnd-kit setup
      <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
        <WrappedBlock
          id={id}
          isWorkbenchBlock={isWorkbenchBlock}
          {...(restProps as T)}
        />
      </div>
    );
  };

  return WithDraggable;
}
