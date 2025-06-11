import { render, screen } from "@testing-library/react";
import CommonTestWrapper from "@/components/CommonTestWrapper/CommonTestWrapper";
import PassengersList from "./PassengersList";

it("renders PassengersList", () => {
  render(
    <CommonTestWrapper>
      <PassengersList pnrData={undefined} currentTab={undefined} />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId("passengersList")).toBeInTheDocument();
});

test('matches snapshot', () => {
  const { asFragment } = render(
    <CommonTestWrapper>
      <PassengersList pnrData={undefined} currentTab={undefined}  />
    </CommonTestWrapper>
  );
  expect(asFragment()).toMatchSnapshot();
});
