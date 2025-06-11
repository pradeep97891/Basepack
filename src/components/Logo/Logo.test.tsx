import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '../CommonTestWrapper/CommonTestWrapper';
import { Logo } from './Logo';

it('renders Loader', () => {
  render(
    <CommonTestWrapper>
      <Logo />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('logo')).toBeInTheDocument();
});
