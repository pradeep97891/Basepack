import { render, screen, fireEvent } from '@testing-library/react';
import Attention from './Attention';

describe('Custom filter render suite', () => {
  const attentionData =  {
    days_left : "2hrs",
  flight_number: "PTYT00",
  total_passenger:100,
  sector: "MAA-KUL",
  pnr_count:6,
  user:"Corporate",
  passenger_info:[],
  Action_status : "Emailed"
};
  const attentionData1 = {
    days_left : "2hrs",
    flight_number: "PTYT00",
    total_passenger:100,
    sector: "MAA-KUL",
    pnr_count:6,
    user:"Corporate",
    passenger_info:[],
    Action_status : "Emailed"
  };
  it('rendered reschedule attention testing', () => {
    render(<Attention dataInfo={attentionData} />);
    expect(screen.getByText(attentionData['flight_number'])).toBeInTheDocument();
  });
  it('reschedule attention with reschedule data', async () => {
    render(<Attention dataInfo={attentionData} />);
    let selectBox = screen.getByTestId('attention');
    if (selectBox) fireEvent.click(selectBox);
    expect(screen.getByText(attentionData['Action_status'])).toBeInTheDocument();
  });
  it('reschedule attention with cancelled data', async () => {
    render(<Attention dataInfo={attentionData1} />);
    let selectBox = screen.getByText(attentionData1['Action_status']);
    if (selectBox) fireEvent.click(selectBox);
    expect(screen.getByText(attentionData1['Action_status'])).toBeInTheDocument();
  });
});
