import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import { QueueDetails } from './QueueDetails';

const QueueDetailsData = {
  airline: 1,
  airline_name: 'JetBlue',
  queue_id: 1,
  queue_number: '101',
  purpose: 2,
  purpose_name: 'Ticketing',
  status: 1,
  status_name: 'Active',
  created_user: 1,
  created_user_name: 'kavi arasan',
  created_at: '2021-09-28T10:30:00Z',
  modified_user: 1,
  modified_user_name: 'kavi arasan',
  modified_at: '2022-09-15T05:23:58.216695Z'
};
it('renders QueueDetails', () => {
  render(
    <CommonTestWrapper>
      <QueueDetails data={QueueDetailsData} mode="" />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('queueDetails')).toBeInTheDocument();
});
