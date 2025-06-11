import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import ViewPnrInfo from './ViewPnrInfo';

it('renders ViewPnrInfo', () => {
  render(
    <CommonTestWrapper>
      <ViewPnrInfo />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('viewPnrInfo')).toBeInTheDocument();
});
