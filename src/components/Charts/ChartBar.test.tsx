import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '../CommonTestWrapper/CommonTestWrapper';
import { ChartBar } from './ChartBar';

it('renders ChartBar', () => {
  render(
    <CommonTestWrapper>
      <ChartBar data={[]} />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('chartbar')).toBeInTheDocument();
});
