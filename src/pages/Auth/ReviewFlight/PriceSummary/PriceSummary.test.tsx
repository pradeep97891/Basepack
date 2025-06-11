import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import PriceSummary from './PriceSummary';

it('renders PriceSummary', () => {
  render(
    <CommonTestWrapper>
      <PriceSummary />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('priceSummary')).toBeInTheDocument();
});
