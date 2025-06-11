import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import CustomReport from './CustomReport';

it('renders CustomReport', () => {
  render(
    <CommonTestWrapper>
      <CustomReport />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('CustomReport')).toBeInTheDocument();
});
