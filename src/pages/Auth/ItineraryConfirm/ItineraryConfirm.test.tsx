import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import ItineraryConfirm from './ItineraryConfirm';

it('renders ItineraryConfirm', () => {
  render(
    <CommonTestWrapper>
      <ItineraryConfirm />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('itineraryConfirm')).toBeInTheDocument();
});
