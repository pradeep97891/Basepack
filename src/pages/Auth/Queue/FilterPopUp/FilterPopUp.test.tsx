import { render, screen } from "@testing-library/react";
import CommonTestWrapper from "@/components/CommonTestWrapper/CommonTestWrapper";
import FilterPopUp from "./FilterPopUp";

it("renders FilterPopUp", () => {
  render(
    <CommonTestWrapper>
      <FilterPopUp
        className="QueueBoxContainerFilterox"
        show={false}
        onFormSubmit={() => false}
      />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId("filterPopUp")).toBeInTheDocument();
});
