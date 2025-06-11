import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import SelectedFlight from './SelectedFlight';

it('renders SelectedFlight', () => {
  render(
    <CommonTestWrapper>
      <SelectedFlight type="" tripId={0} tripIndexes={[]}/>
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('selectedFlight')).toBeInTheDocument();
});
