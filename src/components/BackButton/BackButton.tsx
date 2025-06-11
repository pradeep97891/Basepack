import { Button, Col, Row } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useRedirect } from '@/hooks/Redirect.hook';

const BackButtons = styled(Button)`
  background: #d8d8d8;
  color: #0c28a8;
  border-radius: 6px;
`;

const BackButton = () => {
  const {redirect} = useRedirect()
  const { t } = useTranslation();

  return (
    <Row justify="end" data-testid="BackButton">
      <Col data-testid="backbutton">
        <BackButtons
          className="back-btn"
          onClick={()=>redirect(-1)}
          type="default"
          icon={<ArrowLeftOutlined />}
          size="small"
        >
          {t('back')}
        </BackButtons>
      </Col>
    </Row>
  );
};

export { BackButton };
