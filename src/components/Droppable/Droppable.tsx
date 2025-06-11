import { UniqueIdentifier, useDroppable } from "@dnd-kit/core";
import { FC, ReactElement } from "react";

/**
 * Props interface for the Droppable component.
 */
interface IDroppable {
  id: UniqueIdentifier;
  children: ReactElement;
  droppableClass?: string;
  nonDroppableClass?: string;
  draggedOver: string;
}

/**
 * Droppable component converts its children into droppable elements using @dnd-kit.
 * @param id Unique identifier for the droppable element.
 * @param children The React element to be made droppable.
 * @param droppableClass Optional class name for the droppable element when it is being dragged over.
 * @param nonDroppableClass Optional class name for the droppable element when it is not being dragged over.
 * @param draggedOver The ID of the element currently being dragged over this droppable element.
 * @returns A droppable version of the provided children.
 */
const Droppable: FC<IDroppable> = ({
  id,
  children,
  draggedOver,
  droppableClass,
  nonDroppableClass,
}) => {
  const { setNodeRef, over } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={
        over?.id === id
          ? draggedOver === over?.id
            ? droppableClass
            : nonDroppableClass
          : ""
      }
    >
      {children}
    </div>
  );
};

export default Droppable;
