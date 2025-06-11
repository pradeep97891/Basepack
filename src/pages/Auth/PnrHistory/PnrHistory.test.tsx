import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import PnrHistory from './PnrHistory';

it('renders PnrHistory', () => {
  render(
    <CommonTestWrapper>
      <PnrHistory />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('pnrHistory')).toBeInTheDocument();
});
