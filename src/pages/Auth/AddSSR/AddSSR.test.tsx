import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import AddSSR from './AddSSR';

it('renders AddSSR', () => {
  render(
    <CommonTestWrapper>
      <AddSSR />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('addSSR')).toBeInTheDocument();
});
