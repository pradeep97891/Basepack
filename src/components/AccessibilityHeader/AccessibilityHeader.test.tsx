import { render, screen, fireEvent } from "@testing-library/react";
import AccessibilityHeader from "./AccessibilityHeader";
import { useTheming } from "@/hooks/Theme.hook";

// Mocking the hook used for theme selection
jest.mock("@/hooks/Theme.hook", () => ({
  useTheming: jest.fn(),
}));

interface CSSStyleDeclaration {
  zoom?: string | number;
}

describe("AccessibilityHeader Component", () => {
  const mockChangeTheme = jest.fn();
  const defaultTheme = "default";

  beforeEach(() => {
    // Mock the theme change and selected theme values
    (useTheming as jest.Mock).mockReturnValue({
      changeTheme: mockChangeTheme,
      selectedTheme: defaultTheme,
    });
    mockChangeTheme.mockClear();
  });

  test("renders the AccessibilityHeader component correctly", () => {
    render(<AccessibilityHeader />);

    const AccessibilityElement = screen.getByTestId('Accessibility');
    expect(AccessibilityElement).toBeInTheDocument();

  });

  test("clicking on the font size buttons changes font size", () => {
    render(<AccessibilityHeader />);

    // Simulate clicking the A+ button to increase font size
    const increaseButton = screen.getByText("A+");
    fireEvent.click(increaseButton);

    // Check that the zoom style has increased (using spies/mocks for style)
    expect((document.body.style as CSSStyleDeclaration).zoom).toBe(1.1);

    // Simulate clicking the A- button to decrease font size
    const decreaseButton = screen.getByText("A-");
    fireEvent.click(decreaseButton);

    // Check that the zoom style has decreased
    expect((document.body.style as CSSStyleDeclaration).zoom).toBe(1.0);

  });

  // test("active class is added on font size and theme buttons", () => {
  //   render(<AccessibilityHeader />);

  //   // Simulate clicking a theme button
  //   const themeButton = screen.getByText("A", { selector: ".cls-bw" });
  //   fireEvent.click(themeButton);

  //   // Check if the "active" class is added
  //   expect(themeButton).toHaveClass("active");

  //   // Simulate clicking the A+ button
  //   const increaseButton = screen.getByText("A+");
  //   fireEvent.click(increaseButton);

  //   // Check if the "active" class is added
  //   expect(increaseButton).toHaveClass("active");
  // });
});
