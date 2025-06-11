import './HelpDialog.scss';
// import styled from 'styled-components';
// import { useState } from 'react';
import { Alert } from 'antd';

// const Div = styled.div<{
//   showDialog: string;
// }>`
//   display: ${(props) => props.showDialog};
// `;
const HelpDialog = () => {
  // const [showDialog, setShowDialog] = useState<string>('block');
  // const hideDialog = () => {
  //   setShowDialog('none');
  // };
  return (
    <Alert
      message = "Queue system is designed to simplify the agent's control over the created bookings and to inform the agency's staff about emerging events.Queuing of an order implies its further processing by the agent."
      data-testid = "HelpDialog"
      type = "info"
      closable
    />
  );
};

export default HelpDialog;
