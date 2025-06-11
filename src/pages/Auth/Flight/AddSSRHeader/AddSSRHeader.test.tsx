import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import AddSSRHeader from './AddSSRHeader';

it('renders AddSSRHeader', () => {
  render(
    <CommonTestWrapper>
      <AddSSRHeader flightName="AirLine" />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('addSSRHeader')).toBeInTheDocument();
});
