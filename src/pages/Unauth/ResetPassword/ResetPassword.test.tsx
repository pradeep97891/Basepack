import { render, screen } from '@testing-library/react';
import ResetPassword from './ResetPassword';

describe('<ResetPassword />', () => {
  test('it should mount', () => {
    render(<ResetPassword />);

    const resetPassword = screen.getByTestId('ResetPassword');

    expect(resetPassword).toBeInTheDocument();
  });
});
