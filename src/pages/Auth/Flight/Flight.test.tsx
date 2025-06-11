import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import Flight from './Flight';

it('renders Flight', () => {
  render(
    <CommonTestWrapper>
      <Flight />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('flight')).toBeInTheDocument();
});
