import { render, screen } from "@testing-library/react";
import TestWrapper from "../CommonTestWrapper/CommonTestWrapper";
import "@testing-library/jest-dom";
import { AutoComplete } from "./AutoComplete";
it("renders AutoComplete", () => {
  render(
    <TestWrapper>
      <AutoComplete />
    </TestWrapper>
  );
  expect(screen.getByTestId("autoComplete")).toBeInTheDocument();
});
