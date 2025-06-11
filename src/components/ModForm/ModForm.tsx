import { Form } from 'antd';
import styled from 'styled-components';

const ModForm = styled(Form)`
  margin-top: 24px;

  .ant-input-affix-wrapper {
    border: 1px solid #cee1fc;
    border-radius: 8px;
  }

  .ant-form-item-label label {
    font-size: 15px;
  }

  input {
    height: 40px;
  }

  .ant-input-prefix {
    margin-right: 12px;
  }

  .ant-btn {
    width: 100%;
    height: 48px;
    border-radius: 4px;

    span {
      font-size: 16px;
      font-weight: 700;
    }
  }

  .forgot {
    float: right;
    .ant-btn {
      padding: 0px;
    }
  }
`;

export { ModForm };
