import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import ViewUsers from './ViewUsers';

it('renders ViewUsers', () => {
  render(
    <CommonTestWrapper>
      <ViewUsers />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('viewUsers')).toBeInTheDocument();
});
