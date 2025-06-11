import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import ServerError from './ServerError';

it('renders ServerError', () => {
  render(
    <CommonTestWrapper>
      <ServerError />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('serverError')).toBeInTheDocument();
});
