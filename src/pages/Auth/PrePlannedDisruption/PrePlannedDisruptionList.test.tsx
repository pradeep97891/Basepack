import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import PrePlannedDisruptionList from './PrePlannedDisruptionList';

it('renders PrePlannedDisruptionList', () => {
  render(
    <CommonTestWrapper>
      <PrePlannedDisruptionList />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('prePlannedDisruptionList')).toBeInTheDocument();
});
