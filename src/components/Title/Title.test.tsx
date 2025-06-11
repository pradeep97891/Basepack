import { screen, render, waitFor } from '@testing-library/react';
import CommonTestWrapper from '../CommonTestWrapper/CommonTestWrapper';
import { FormTitle } from './Title';

it('renders Title', async () => {
  render(
    <CommonTestWrapper>
      <FormTitle title="TestTitle" subTitle="TestSubtitle" />
    </CommonTestWrapper>
  );
  await waitFor(() =>screen.debug());
  await waitFor(() => expect(screen.getByText(/TestTitle/i)).toBeInTheDocument());
});
