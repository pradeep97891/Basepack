import { useDraggable } from "@dnd-kit/core";
import { FC, ReactElement } from "react";
import { CSS } from "@dnd-kit/utilities";

/**
 * Props interface for the Draggable component.
 */
interface IDraggable {
  id: number | string;
  children: ReactElement;
}

/**
 * Draggable component converts its children into draggable elements using @dnd-kit.
 * @param id Unique identifier for the draggable element.
 * @param children The React element to be made draggable.
 * @returns A draggable version of the provided children.
 */
const Draggable: FC<IDraggable> = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    data: { title: children },
  });

  return (
    <div
      ref={setNodeRef}
      data-testid="cls-draggable-div"
      style={{ transform: CSS.Translate.toString(transform) }}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
};

export default Draggable;
