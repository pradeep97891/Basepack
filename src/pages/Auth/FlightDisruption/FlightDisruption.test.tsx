import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import FlightDisruption from './FlightDisruption';

it('renders FlightDisruption page', () => {
  render(
    <CommonTestWrapper>
      <FlightDisruption />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('flightDisruption')).toBeInTheDocument();
});
