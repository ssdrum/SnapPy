import React, { useContext, useState } from 'react';
import { EditorContext } from './editor-context';
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import Workbench from './workbench';
import Canvas from './canvas';
import classes from './editor.module.css';
import { isWorkbenchBlock, wasDroppedOnBin, wasDroppedOnCanvas } from './utils';
import CodeEditor from './code-editor';
import { DragEndEvent } from '@dnd-kit/core/dist/types';

export default function Editor() {
  const { createCanvasBlock, moveCanvasBlock, deleteCanvasBlock } =
    useContext(EditorContext)!;
  const [code, setCode] = useState<string>(`print("Hello World!")`); // Code in the code editor

  const handleCodeChange = (newCode: string): void => {
    setCode(newCode);
  };

  // Triggered when a drag event ends. Either move a block, delete one,
  // create one, or do nothing.
  // Handle the drag end event
  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over, delta } = event;

    if (!over) {
      return;
    }

    const activeId = active.id as number;

    if (wasDroppedOnCanvas(over)) {
      if (isWorkbenchBlock(activeId)) {
        createCanvasBlock(activeId, delta);
      } else {
        moveCanvasBlock(activeId, delta);
      }
    } else if (!isWorkbenchBlock(activeId) && wasDroppedOnBin(over)) {
      deleteCanvasBlock(activeId);
    }
  };

  // This workaround allows the onClick events for the input boxes to trigger.
  // Without it, the dragEvent will override any onClick
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0.1,
      },
    })
  );

  return (
    <div className={classes.editorWrapper}>
      <DndContext
        id='dnd-context' // Needs a unique id to avoid hydration errors
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <Workbench />
        <Canvas />
      </DndContext>

      <div className={classes.codeEditor}>
        <CodeEditor code={code} handleCodeChange={handleCodeChange} />
      </div>
    </div>
  );
}
