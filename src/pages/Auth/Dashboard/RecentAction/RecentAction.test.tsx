import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import RecentAction from './RecentAction';

it('renders RecentAction', () => {
  render(
    <CommonTestWrapper>
      <RecentAction />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('recentAction')).toBeInTheDocument();
});
