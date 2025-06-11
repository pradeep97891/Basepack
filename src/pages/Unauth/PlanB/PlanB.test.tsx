import { render, screen } from "@testing-library/react";
import PlanB from "./PlanB";
import CommonTestWrapper from "@/components/CommonTestWrapper/CommonTestWrapper";

describe("<PlanB />", () => {
  test("it should mount", () => {
    render(
      <CommonTestWrapper>
        <PlanB />
      </CommonTestWrapper>
    );

    const planB = screen.getByTestId("planB");

    expect(planB).toBeInTheDocument();
  });
});
