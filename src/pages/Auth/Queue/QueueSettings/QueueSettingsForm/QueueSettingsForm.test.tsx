import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import QueueSettings from '../QueueSettings';
import QueueSettingsForm from './QueueSettingsForm';

it('renders QueueSettingsForm', () => {
  render(
    <CommonTestWrapper>
      <QueueSettingsForm show={true} mode={'edit'} queueInfo={null} />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('queueSettingsForm')).toBeInTheDocument();
});
