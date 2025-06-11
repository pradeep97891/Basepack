import { render, screen } from '@testing-library/react';
import HelpDialog from './HelpDialog';
import TestWrapper from '../CommonTestWrapper/CommonTestWrapper';

it('renders Header', () => {
  render(
    <TestWrapper>
      <HelpDialog />
    </TestWrapper>
  );
  expect(screen.getByTestId('HelpDialog')).toBeInTheDocument();
});
