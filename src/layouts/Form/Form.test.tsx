import { render, screen } from "@testing-library/react";
import { FormLayout } from "./Form";

// Mock necessary dependencies
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key, // simple mock for translation function
  }),
}));

jest.mock("@/components/BackButton/BackButton", () => ({
  BackButton: () => <button>Back</button>,
}));

describe("FormLayout Component", () => {
  const renderComponent = (props = {}) => {
    return render(
      <FormLayout title="Test Title" {...props}>
        <div>Form Children</div>
      </FormLayout>
    );
  };

  it("renders the form layout with title and children", () => {
    renderComponent();
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Form Children")).toBeInTheDocument();
  });

  it("renders the back button", () => {
    renderComponent();
    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  it("renders additional head content when provided", () => {
    const additionalHead = <div>Additional Content</div>;
    renderComponent({ additionalHead });
    expect(screen.getByText("Additional Content")).toBeInTheDocument();
  });

  it("uses translation for form legend", () => {
    renderComponent();
    expect(screen.getByText("fill_below_details")).toBeInTheDocument();
  });

  it("does not render additional head content when not provided", () => {
    renderComponent();
    expect(screen.queryByText("Additional Content")).toBeNull();
  });
});
