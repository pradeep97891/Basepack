import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import SeatMap from './SeatMap';

const data = {
  icon: 'Free_seatIcon',
  seat_number: 'I1',
  item: 'Free'
};
const selectedData: any[] = [];
it('renders SeatMap', () => {
  render(
    <CommonTestWrapper>
      <SeatMap data={data} selectedData={selectedData} />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('seatMap')).toBeInTheDocument();
});
