import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import BaggageMealBox from './BaggageMealBox';

const baggageList: any = [
  {
    weight: '5kg',
    price: '1800.00'
  },
  {
    weight: '10kg',
    price: '2800.00'
  },
  {
    weight: '15kg',
    price: '3800.00'
  },
  {
    weight: '20kg',
    price: '4800.00'
  },
  {
    weight: '25kg',
    price: '5800.00'
  },
  {
    weight: '30kg',
    price: '6800.00'
  },
  {
    weight: '35kg',
    price: '7800.00'
  },
  {
    weight: '40kg',
    price: '8800.00'
  },
  {
    weight: '45kg',
    price: '9800.00'
  },
  {
    weight: '50kg',
    price: '10800.00'
  },
  {
    weight: '55kg',
    price: '11800.00'
  },
  {
    weight: '60kg',
    price: '12800.00'
  }
];
it('renders baggageMealBox', () => {
  render(
    <CommonTestWrapper>
      <BaggageMealBox name="Baggage" data={baggageList} />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('baggageMealBox')).toBeInTheDocument();
});
