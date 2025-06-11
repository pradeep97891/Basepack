import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import QueueConditionForm from './QueueConditionForm';

const field = { isListField: true };
const value = 0;
it('renders QueueConditionForm', () => {
  render(
    <CommonTestWrapper>
      <QueueConditionForm field={field} name={value} fieldKey={value} key={value} index={value} remove={'remove'} />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('queueConditionForm')).toBeInTheDocument();
});
