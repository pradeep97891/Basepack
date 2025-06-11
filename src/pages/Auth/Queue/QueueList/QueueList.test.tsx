import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import QueueSettings from './QueueList';

it('renders QueueSettings', () => {
  render(
    <CommonTestWrapper>
      <QueueSettings />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('queueSettings')).toBeInTheDocument();
});
