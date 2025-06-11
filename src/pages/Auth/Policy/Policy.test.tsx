import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import Policy from './Policy';

it('renders Policy', () => {
  render(
    <CommonTestWrapper>
      <Policy />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('policy')).toBeInTheDocument();
});
