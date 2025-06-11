import { screen, render } from '@testing-library/react';
import Language from './Language';
import TestWrapper from '../CommonTestWrapper/CommonTestWrapper';

it('renders Language menu', () => {
  render(
    <TestWrapper>
      <Language />
    </TestWrapper>
  );
  expect(screen.getByTestId('lang')).toBeInTheDocument();
});
