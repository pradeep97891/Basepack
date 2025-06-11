import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import PaymentFooter from './PaymentFooter';

const data = {
  ticket_id: 'PS-424',
  from_time: '04:50',
  from: 'MAA',
  stop_count: '1 stop(s)',
  hours_to_reach: '2h 00m',
  to_time: '06:50',
  to: 'KUL',
  seats_left: '6',
  inr: '10,000'
};
it('renders PaymentFooter', () => {
  render(
    <CommonTestWrapper>
      <PaymentFooter data={data} />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('paymentFooter')).toBeInTheDocument();
});
