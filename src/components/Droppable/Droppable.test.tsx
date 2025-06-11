import { render, screen } from "@testing-library/react";
import { useDroppable } from "@dnd-kit/core";
import Droppable from "./Droppable";

// Mock useDroppable from @dnd-kit/core
jest.mock("@dnd-kit/core", () => ({
  useDroppable: jest.fn(),
}));

describe("Droppable component", () => {
  const mockSetNodeRef = jest.fn();

  beforeEach(() => {
    // Mock the return value of useDroppable hook
    (useDroppable as jest.Mock).mockReturnValue({
      setNodeRef: mockSetNodeRef,
      over: null,
    });
  });

  test("renders children correctly", () => {
    render(
      <Droppable id="droppable-1" draggedOver="">
        <div>Droppable Content</div>
      </Droppable>
    );
    expect(screen.getByText("Droppable Content")).toBeInTheDocument();
  });

  test("applies droppable class when dragged over", () => {
    (useDroppable as jest.Mock).mockReturnValue({
      setNodeRef: mockSetNodeRef,
      over: { id: "droppable-1" },
    });

    render(
      <Droppable
        id="droppable-1"
        droppableClass="dragged-over"
        nonDroppableClass="non-dragged-over"
        draggedOver="droppable-1"
      >
        <div>Droppable Content</div>
      </Droppable>
    );

    const droppableElement = screen.getByText("Droppable Content").parentElement;
    expect(droppableElement).toHaveClass("dragged-over");
  });

  test("applies non-droppable class when not dragged over", () => {
    (useDroppable as jest.Mock).mockReturnValue({
      setNodeRef: mockSetNodeRef,
      over: { id: "droppable-1" },
    });

    render(
      <Droppable
        id="droppable-1"
        droppableClass="dragged-over"
        nonDroppableClass="non-dragged-over"
        draggedOver="another-droppable"
      >
        <div>Droppable Content</div>
      </Droppable>
    );

    const droppableElement = screen.getByText("Droppable Content").parentElement;
    expect(droppableElement).toHaveClass("non-dragged-over");
  });

  test("sets the node reference using setNodeRef", () => {
    render(
      <Droppable id="droppable-1" draggedOver="">
        <div>Droppable Content</div>
      </Droppable>
    );
    expect(mockSetNodeRef).toHaveBeenCalled();
  });

  test("applies no class when no element is dragged over", () => {
    render(
      <Droppable
        id="droppable-1"
        droppableClass="dragged-over"
        nonDroppableClass="non-dragged-over"
        draggedOver=""
      >
        <div>Droppable Content</div>
      </Droppable>
    );

    const droppableElement = screen.getByText("Droppable Content").parentElement;
    expect(droppableElement).not.toHaveClass("dragged-over");
    expect(droppableElement).not.toHaveClass("non-dragged-over");
  });
});
