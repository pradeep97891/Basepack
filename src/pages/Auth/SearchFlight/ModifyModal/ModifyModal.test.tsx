import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import ModifyModal from './ModifyModal';

it('renders ModifyModal', () => {
  render(
    <CommonTestWrapper>
      <ModifyModal type="" tripId={0} tripIndexes={[]}/>
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('modifyModal')).toBeInTheDocument();
});
