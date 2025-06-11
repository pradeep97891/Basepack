import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import AdhocDisruptionList from './AdhocDisruptionList';

it('renders AdhocDisruptionList', () => {
  render(
    <CommonTestWrapper>
      <AdhocDisruptionList />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('AdhocDisruptionList')).toBeInTheDocument();
});
