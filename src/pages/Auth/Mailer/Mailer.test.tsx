import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import Mailer from './Mailer';

it('renders Mailer', () => {
  render(
    <CommonTestWrapper>
      <Mailer />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('mailer')).toBeInTheDocument();
});
