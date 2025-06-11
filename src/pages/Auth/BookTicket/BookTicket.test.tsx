import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import BookTicket from './BookTicket';

it('renders bookTicket', () => {
  render(
    <CommonTestWrapper>
      <BookTicket updatebooknow={undefined} selectTabFlightData={false} connectionTypeFilter={[]}/>
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('bookTicket')).toBeInTheDocument();
});
