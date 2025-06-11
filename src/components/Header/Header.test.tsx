import { render, screen } from '@testing-library/react';
import { HeaderItems } from './Header';
import TestWrapper from '../CommonTestWrapper/CommonTestWrapper';

it('renders Header', () => {
  render(
    <TestWrapper>
      <HeaderItems />
    </TestWrapper>
  );
  expect(screen.getByTestId('header')).toBeInTheDocument();
});
