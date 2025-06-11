import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import LoginWithOTP from './loginwithotp';

it('renders LoginWithOTP', () => {
  render(
    <CommonTestWrapper>
      <LoginWithOTP />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('loginWithOTP')).toBeInTheDocument();
});
