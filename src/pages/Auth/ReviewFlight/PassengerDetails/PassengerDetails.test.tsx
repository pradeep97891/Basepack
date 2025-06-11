import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import PassengerDetails from './PassengerDetails';

it('renders PassengerDetails', () => {
  render(
    <CommonTestWrapper>
      <PassengerDetails />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('passengerDetails')).toBeInTheDocument();
});
