import React, { FC, useEffect, useState } from 'react';
import './paymentPage.scss';
import { Button, Card, Col, Divider, Flex, Row, Typography, Statistic, Radio, Tooltip } from 'antd';
import CFG from "@/config/config.json";
import { useTranslation } from 'react-i18next';
import ItineraryHeader, { ItineraryHeaderProps } from "@/components/DescriptionHeader/DescriptionHeader";
import { useSessionStorage } from '@/hooks/BrowserStorage.hook';
import { useRedirect } from '@/hooks/Redirect.hook';
const Text = Typography;

interface PaymentPageProps {}

const PaymentPage: FC<PaymentPageProps> = () => {
  const { t } = useTranslation();
  const {redirect} = useRedirect();
  const { Countdown } = Statistic;
  const deadline = Date.now() + 1000 * 60 * 5; // 5 minutes from now
  const [enableBtn, setEnableBtn] = useState(true);
  const [SfinalPaymentAmount] = useSessionStorage<any>("finalPaymentAmount");
  var paymentValue = Number(SfinalPaymentAmount);
  
  useEffect(() => {
    window.scroll(0, 0);
  });
  
  let headerProps:ItineraryHeaderProps["data"] = {
    title:  `${t("payment_heading")}`
  };

  const handleRadioButtonChanges = (value: any) => {
    // let radioValue = value.target.value;
    setEnableBtn(false);
  };

  return (
    <div className="cls-paymentPage" data-testid="PaymentPage">
      <ItineraryHeader data={headerProps} />
      <Row justify={"space-between"}>
        <Col span={15}>
          <Card>
            <Radio.Group
              className="f-sbold"
              onChange={(e) => {
                handleRadioButtonChanges(e);
              }}
            >
              <Radio.Button value="credit" className="f-reg mr-3">
                {t("credit_card")}
              </Radio.Button>
              <Radio.Button value="debit" className="f-reg mr-3">
                {t("debit_card")}
              </Radio.Button>
              <Radio.Button value="paylater" className="f-reg mr-3">
                {t("pay_later")}
              </Radio.Button>
              <Radio.Button value="netbanking" className="f-reg mr-3">
                {t("net_banking")}
              </Radio.Button>
              <Radio.Button value="upi" className="f-reg mr-3">
                {t("UPI_QR")}
              </Radio.Button>
              <Radio.Button value="wallet" className="f-reg mr-3">
                {t("wallet")}
              </Radio.Button>
              <Radio.Button value="wiretransfer" className="f-reg mr-3">
                {t("wire_transfer")}
              </Radio.Button>
            </Radio.Group>
          </Card>
        </Col>
        <Col span={8}>
          <Text className='d-flex justify-end w-100 fs-14 f-reg py-2'> 
            {t("session_expires_in")} &nbsp;
            <Text className='px-1'> 
              <Countdown 
                value={deadline} 
                format="mm:ss"
                valueStyle={{ width: "45px", color: 'var(--t-common-primary)', fontSize: '14px', fontFamily: "var(--font-medium)" }}
                onFinish={() => console.log('Countdown Finished!')} 
              /> 
            </Text>
          </Text>
          <Card>
            <Flex justify="space-between" className='pb-1'>
              <Text className='fs-14 f-reg'>{t("total_amount")}</Text>
              <Text className='fs-16 f-sbold'>{CFG.currency} {paymentValue.toFixed(2)} </Text>
            </Flex>
            <Divider />
            <Tooltip title={enableBtn ? "Select any option to enable button" : ""}>
              <Button
                type="primary"
                className={`cls-primary-btn w-100 mt-2 h-40 ${enableBtn ? 'cls-disabled no-events' : ''}`}
                onClick={() => redirect("itineraryConfirm")}
              >
                {t("pay_now")}
              </Button>
            </Tooltip>
          </Card>
        </Col>
      </Row>
    </div>
  )

};

export default PaymentPage;
