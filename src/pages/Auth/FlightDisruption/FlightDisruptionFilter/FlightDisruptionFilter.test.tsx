import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import FlightDisruptionFilter from './FlightDisruptionFilter';

it('renders FlightDisruptionFilter', () => {
  render(
    <CommonTestWrapper>
      <FlightDisruptionFilter  />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('flightDisruptionFilter')).toBeInTheDocument();
});
