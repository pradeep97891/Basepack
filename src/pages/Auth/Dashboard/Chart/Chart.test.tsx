import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import { ChartBar } from './Chart';

it('renders ChartBar', () => {
  render(
    <CommonTestWrapper>
      <ChartBar />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('barChart')).toBeInTheDocument();
});
