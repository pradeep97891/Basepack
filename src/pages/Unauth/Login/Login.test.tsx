import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import Login from './Login';

it('renders Login', () => {
  render(
    <CommonTestWrapper>
      <Login />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('login')).toBeInTheDocument();
});
