import { render, screen } from "@testing-library/react";
import Landing from "./Landing";

// Mock necessary dependencies
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key, // simple mock for translation function
  }),
}));

jest.mock("@/components/Icons/HeaderIcon", () => ({
  LandingLogo: jest.fn(() => <div>LandingLogo</div>),
}));

jest.mock("@/components/Logo/Logo", () => ({
  Logo: jest.fn(() => <div>Logo</div>),
}));

jest.mock("@/pages/Unauth/Login/Login", () => ({
  Login: jest.fn(() => <div>Login Component</div>),
}));

jest.mock("@/components/Language/Language", () => ({
  Language: jest.fn(() => <div>Language Component</div>),
}));

jest.mock("@/components/Theme/Theme", () => ({
  Theme: jest.fn(() => <div>Theme Component</div>),
}));

describe("Container Component", () => {
  const renderComponent = (props = {}) => {
    return render(<Landing {...props}>Form Children</Landing>);
  };

  it("renders the LandingLogo and title content", () => {
    renderComponent();
    expect(screen.getByText("LandingLogo")).toBeInTheDocument();
    expect(
      screen.getByText("login_registered_users_get_more_offers")
    ).toBeInTheDocument();
  });

  it("renders list items translated", () => {
    renderComponent();
    expect(screen.getByText("view_cancel_reschedule_booking")).toBeInTheDocument();
    expect(screen.getByText("manage_cancellation_booking_view_booking_history")).toBeInTheDocument();
    expect(screen.getByText("faster_booking_with_saved_travelers")).toBeInTheDocument();
    expect(screen.getByText("low_cancellation_fee_for_SME_business_customers")).toBeInTheDocument();
  });

  it("renders the Logo component in mobile view", () => {
    renderComponent();
    expect(screen.getByText("Logo")).toBeInTheDocument();
  });

  it("renders the child content when isPlanb is false", () => {
    renderComponent({ isPlanb: false });
    expect(screen.getByText("Form Children")).toBeInTheDocument();
    expect(screen.queryByText("Login Component")).not.toBeInTheDocument();
  });

  it("renders the Login component when isPlanb is true", () => {
    renderComponent({ isPlanb: true });
    expect(screen.getByText("Login Component")).toBeInTheDocument();
    expect(screen.queryByText("Form Children")).not.toBeInTheDocument();
  });

  it("renders the Theme and Language components when isPlanb is false", () => {
    renderComponent({ isPlanb: false });
    expect(screen.getByText("Theme Component")).toBeInTheDocument();
    expect(screen.getByText("Language Component")).toBeInTheDocument();
  });

  it("does not render the Theme and Language components when isPlanb is true", () => {
    renderComponent({ isPlanb: true });
    expect(screen.queryByText("Theme Component")).not.toBeInTheDocument();
    expect(screen.queryByText("Language Component")).not.toBeInTheDocument();
  });
});
