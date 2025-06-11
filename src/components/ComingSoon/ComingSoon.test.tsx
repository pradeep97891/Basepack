import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '../CommonTestWrapper/CommonTestWrapper';
import ComingSoon from './ComingSoon';

it('renders ComingSoon', () => {
  render(
    <CommonTestWrapper>
      <ComingSoon />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('comingsoon')).toBeInTheDocument();
});
