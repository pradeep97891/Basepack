import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import ReviewFlight from './ReviewFlight';

it('renders ReviewFlight', () => {
  render(
    <CommonTestWrapper>
      <ReviewFlight />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('reviewFlight')).toBeInTheDocument();
});
