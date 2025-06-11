import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import UpcomingEvent from './UpcomingEvent';

const UpcomingEventData = [{
  "day": "07",
  "month": "Augest",
  "text": "Lorem ipsum Lorem ipsum",
  "time": "12PM - 3PM"
},
{
  "day": "17",
  "month": "Augest",
  "text": "Function",
  "time": "1PM - 3PM"
}]
it('renders UpcomingEvent', () => {
  render(
    <CommonTestWrapper>
      <UpcomingEvent dataInfo={UpcomingEventData} />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('upcomingEvent')).toBeInTheDocument();
});
