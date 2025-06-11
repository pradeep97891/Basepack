import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import AddUser from './AddUser';

it('renders AddSSR', () => {
  render(
    <CommonTestWrapper>
      <AddUser />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('AddUser')).toBeInTheDocument();
});
