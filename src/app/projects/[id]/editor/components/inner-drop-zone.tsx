import { Block } from '../blocks/types';
import { useDroppable } from '@dnd-kit/core';
import classes from '../blocks/blocks.module.css';
import CanvasBlocksRenderer from './canvas-blocks-renderer';

interface InnerDropZoneProps {
  id: string;
  enabled: boolean;
  children: Block[];
}

export default function InnerDropZone({
  id,
  enabled,
  children,
}: InnerDropZoneProps) {
  const { setNodeRef } = useDroppable({ id });

  if (children.length > 0) {
    return <CanvasBlocksRenderer canvas={children} />;
  }

  return (
    <div
      ref={enabled ? setNodeRef : undefined}
      className={classes.innerDropzone}
    />
  );
}

//import { useDroppable } from '@dnd-kit/core';
//import classes from '../blocks/blocks.module.css';
////import BlocksRenderer from './blocks-renderer';
//import { useBlocks } from '../contexts/blocks-context';
//import React from 'react';
//
//interface InnerDropZoneProps {
//  id: string;
//  children: Block[];
//  enabled: boolean;
//  enableStacking: boolean;
//}
//
//export default function InnerDropZone({
//  id,
//  children,
//  enabled,
//  enableStacking,
//}: InnerDropZoneProps) {
//  const { state } = useBlocks();
//  const { setNodeRef } = useDroppable({ id });
//
//  const active = children.length === 0;
//  const highlighted = state.highlightedDropZoneId === id;
//
//  return (
//    <div
//      ref={enabled && active ? setNodeRef : undefined} // Only make droppable if there's no children
//      className={classes.innerDropZone}
//      style={{
//        backgroundColor: highlighted ? '#FFD54F' : undefined,
//      }}
//    >
//      {/*children && !enableStacking && <BlocksRenderer blocks={children} />*/}
//      {children &&
//        enableStacking &&
//        (() => {
//          const startNodes = children.filter((block) => block.prevId === null);
//          return (
//            <div>
//              {startNodes.map((block) => (
//                <React.Fragment key={block.id}>
//                  {/*renderBlockSequence(block, state.canvas)*/}
//                </React.Fragment>
//              ))}
//            </div>
//          );
//        })()}
//    </div>
//  );
//}
