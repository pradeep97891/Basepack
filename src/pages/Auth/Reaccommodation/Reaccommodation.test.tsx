import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import Reaccommodation from './Reaccommodation';

it('renders Reaccommodation', () => {
  render(
    <CommonTestWrapper>
      <Reaccommodation />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('reaccommodation')).toBeInTheDocument();
});
