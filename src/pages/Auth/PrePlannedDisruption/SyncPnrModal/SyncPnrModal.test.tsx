import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import SyncPnrModal from './SyncPnrModal';

it('renders SyncPnrModal', () => {
  render(
    <CommonTestWrapper>
      <SyncPnrModal queueData={undefined} isModalOpen={true} toggleModal={() => { } } page="" syncData={() => { } }/>
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('syncPnrModal')).toBeInTheDocument();
});
