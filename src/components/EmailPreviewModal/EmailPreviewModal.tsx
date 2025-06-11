import { Modal } from "antd";
import "./EmailPreviewModal.scss";

interface EmailPreviewModalProps {
  footer?: JSX.Element | null;
  isModalOpen: boolean;
  onCancel: any;
  confirmLoading: boolean;
  loading: boolean;
  header: JSX.Element;
  iFrameContent: string;
}

const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({
  footer,
  isModalOpen,
  onCancel,
  confirmLoading,
  loading,
  header,
  iFrameContent,
}) => {
  /* Use CSS to disable pointer events and user interactions inside iframe. */
  const iframeContent = `
    <style>
      body {
        pointer-events: none;
        user-select: none;
      }
    </style>
    ${iFrameContent}
  `;

  return (
    <Modal
      data-testid="EmailPreviewModal"
      title={<></>}
      footer={footer}
      open={isModalOpen}
      onCancel={onCancel}
      width={800}
      confirmLoading={confirmLoading}
      loading={loading}
      style={{ top: 20 }}
    >
      {header}
      <div className="PreviewMail">
        <div className="cls-preview-frame">
          {/* The sandbox attribute in this case:
        - allow-same-origin: Allows the iframe content to be treated as being from the same origin.
        - allow-scripts: Allows the execution of scripts inside the iframe.
        - By omitting attributes like allow-forms and allow-modals, you can prevent the content inside the iframe from being interactive or editable. */}
          <iframe
            title="Preview"
            width="100%"
            height="450px"
            srcDoc={iframeContent}
            sandbox="allow-same-origin"
            style={{ border: 0 }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default EmailPreviewModal;
