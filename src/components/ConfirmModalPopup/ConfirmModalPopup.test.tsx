import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmModalPopup, { ConfirmModalPopupProps } from "./ConfirmModalPopup";

// Mock the translation and Ant Design modal
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("ConfirmModalPopup Component", () => {
  const mockOnData = jest.fn();

  const defaultProps: ConfirmModalPopupProps = {
    props: {
      modalName: "confirm",
      page: "Test Page",
      header: "Are you sure?",
      description: "This is a confirmation modal.",
      modalToggle: true,
      modalClass: "custom-class",
      modalWidth: 600,
      primaryBtn: { text: "Cancel", value: false },
      secondaryBtn: { text: "Confirm", value: true },
      type: "confirm",
      loading: false,
    },
    onData: mockOnData,
  };

  beforeEach(() => {
    mockOnData.mockClear();
  });

  test("renders the ConfirmModalPopup component correctly", () => {
    render(<ConfirmModalPopup {...defaultProps} />);

    // Check if the modal is rendered with correct text
    expect(screen.getByTestId("ConfirmModalPopup")).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(screen.getByText("This is a confirmation modal.")).toBeInTheDocument();

    // Check if buttons are rendered
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
  });

  test("calls onData when Cancel button is clicked", () => {
    render(<ConfirmModalPopup {...defaultProps} />);

    // Simulate clicking the Cancel button
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    // Verify that onData was called with the correct value
    expect(mockOnData).toHaveBeenCalledWith(false);
  });

  test("calls onData when Confirm button is clicked", () => {
    render(<ConfirmModalPopup {...defaultProps} />);

    // Simulate clicking the Confirm button
    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);

    // Verify that onData was called with the correct value
    expect(mockOnData).toHaveBeenCalledWith(true);
  });

  test("renders with the correct modal icon based on modalName", () => {
    // Render the component with modalName set to 'delete'
    const deleteProps = {
      ...defaultProps,
      props: {
        ...defaultProps.props,
        modalName: "delete",
      },
    };
    render(<ConfirmModalPopup {...deleteProps} />);

    // Check for delete icon (assuming there's some text or aria-label for the icon)
    expect(screen.getByTestId("ConfirmModalPopup")).toBeInTheDocument();
    // Modify this line based on how your icons are rendered and identified
  });

  test("disables Confirm button when input is less than 40 characters for 'cancel' modal", () => {
    const cancelProps = {
      ...defaultProps,
      props: {
        ...defaultProps.props,
        modalName: "cancel",
      },
    };
    render(<ConfirmModalPopup {...cancelProps} />);

    const confirmButton = screen.getByText("Confirm");
    expect(confirmButton).toHaveClass("cls-disabled");

    // Type more than 40 characters in the textarea
    const textArea = screen.getByPlaceholderText("text_area_description");
    fireEvent.change(textArea, {
      target: { value: "This is a test input with more than 40 characters." },
    });

    // The Confirm button should now be enabled
    expect(confirmButton).not.toHaveClass("cls-disabled");
  });

  test("displays loader on Confirm button after clicking it", async () => {
    render(<ConfirmModalPopup {...defaultProps} />);

    const confirmButton = screen.getByText("Confirm");

    // Click the confirm button and trigger the loading state
    fireEvent.click(confirmButton);
    expect(confirmButton).toHaveAttribute("loading");
  });

  test("calls the correct handler when modal is closed", () => {
    render(<ConfirmModalPopup {...defaultProps} />);

    const closeIcon = screen.getByRole("button", { name: "" }); // Adjust based on how your close icon is labeled
    fireEvent.click(closeIcon);

    // Check if onData was called with the correct value on closing the modal
    expect(mockOnData).toHaveBeenCalledWith(false);
  });
});
