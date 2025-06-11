import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EmailPreviewModal from './EmailPreviewModal';
import Testwrapper from '@/components/CommonTestWrapper/CommonTestWrapper';

describe('Tests Email Preview Modal mounts or not />', () => {
  test('it should mount', () => {
    render(
        <Testwrapper>
          <EmailPreviewModal 
            footer={null} 
            isModalOpen={true} 
            onCancel={undefined} 
            confirmLoading={false} 
            loading={false} 
            header={<></>} 
            iFrameContent={''} 
          />
        </Testwrapper>
      );

    const EmailPreviewModalElement = screen.getByTestId('EmailPreviewModal');
    expect(EmailPreviewModalElement).toBeInTheDocument();
  });
});