import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import FlightSeatList from './FlightSeatList';

it('renders FlightSeatList', () => {
  render(
    <CommonTestWrapper>
      <FlightSeatList seatList={[]} />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('flightSeatList')).toBeInTheDocument();
});
