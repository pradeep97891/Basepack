import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import FlightList from './FlightList';

it('renders FlightList page', () => {
  render(
    <CommonTestWrapper>
      <FlightList flight="" rescheduleStatus="" updateRescheduleState={()=>{}} isCustomApplied={true}/>
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('FlightList')).toBeInTheDocument();
});
