import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useDraggable } from "@dnd-kit/core";
import Draggable from "./Draggable";

// Mock useDraggable from @dnd-kit/core
jest.mock("@dnd-kit/core", () => ({
  useDraggable: jest.fn(),
}));

describe("Draggable component", () => {
  const mockSetNodeRef = jest.fn();
  const mockListeners = { onMouseDown: jest.fn(), onTouchStart: jest.fn() };

  beforeEach(() => {
    // Mock the return value of useDraggable hook
    (useDraggable as jest.Mock).mockReturnValue({
      attributes: { role: "draggable" },
      listeners: mockListeners,
      setNodeRef: mockSetNodeRef,
      transform: { x: 10, y: 20 },
    });
  });

  test("renders children correctly", () => {
    render(
      <Draggable id="test">
        <div>Draggable Content</div>
      </Draggable>
    );
    expect(screen.getByText("Draggable Content")).toBeInTheDocument();
  });

  test("applies transform style based on useDraggable hook", () => {
    render(
      <Draggable id="test">
        <div>Draggable Content</div>
      </Draggable>
    );
    const draggableElement = screen.getByText("Draggable Content").parentElement;
    expect(draggableElement).toHaveStyle("transform: translate3d(10px, 20px, 0)");
  });

  test("sets the node reference using setNodeRef", () => {
    render(
      <Draggable id="test">
        <div>Draggable Content</div>
      </Draggable>
    );
    expect(mockSetNodeRef).toHaveBeenCalled();
  });

  // test("attaches drag listeners", () => {
  //   render(
  //     <Draggable id="test">
  //       <div>Draggable Content</div>
  //     </Draggable>
  //   );

  //   const draggableElement = (screen.getByText("Draggable Content").parentElement as HTMLElement);
  //   userEvent.click(draggableElement);
  //   expect(mockListeners.onMouseDown).toHaveBeenCalled();
  // });
});
