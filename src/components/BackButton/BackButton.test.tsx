import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '../CommonTestWrapper/CommonTestWrapper';
import { BackButton } from './BackButton';

it('renders BackButton', () => {
  render(
    <CommonTestWrapper>
      <BackButton />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('BackButton')).toBeInTheDocument();
});
