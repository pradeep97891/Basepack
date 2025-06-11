import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import BiDashboard from './BiDashboard';

it('renders BiDashboard', () => {
  render(
    <CommonTestWrapper>
      <BiDashboard />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('BiDashboard')).toBeInTheDocument();
});
