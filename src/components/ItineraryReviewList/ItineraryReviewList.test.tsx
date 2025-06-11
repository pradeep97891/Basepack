import { render, screen } from "@testing-library/react";
import ItineraryReviewList from "./ItineraryReviewList";
import TestWrapper from "../CommonTestWrapper/CommonTestWrapper";

it("renders Header", () => {
  render(
    <TestWrapper>
      <ItineraryReviewList />
    </TestWrapper>
  );
  expect(screen.getByTestId("ItineraryReviewList")).toBeInTheDocument();
});
