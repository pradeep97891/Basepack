import { Col, Typography, Card } from "antd";
import { useEffect, useState } from "react";
import QueueSettingsForm from "../QueueSettingsForm/QueueSettingsForm";
import "../../QueueSettings/QueueSettings.scss";
import { useLocation } from "react-router-dom";
import { useLazyGetEditQueueQuery } from "@/services/queue/Queue";
import { IQueueData } from "@/services/queue/QueueTypes";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { useSessionStorage } from "@/hooks/BrowserStorage.hook";
import { useRedirect } from "@/hooks/Redirect.hook";
const Text = Typography.Text;

export const QueueDetails = (props: any) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [queueInfo, setQueueInfo] = useState<IQueueData | null>(null);
  const [getQueueService, getQueueServiceStatus] = useLazyGetEditQueueQuery();
  const [editQueueId] = useSessionStorage<any>("editQueueId");
  const {isCurrentPathEqual} = useRedirect();

  // To retrieve the appropriate active Queue to edit
  useEffect(() => {
    if (editQueueId !== 0 && editQueueId !== undefined) {
      getQueueService({ queue_id: editQueueId });
    }
  }, [editQueueId]);

  // To store the response of a queue in the local state
  useEffect(() => {
    if (
      getQueueServiceStatus.isSuccess &&
      getQueueServiceStatus.data &&
      getQueueServiceStatus.data.responseCode === 0
    ) {
      setQueueInfo(getQueueServiceStatus.data.response.data);
    }
  }, [editQueueId, getQueueServiceStatus]);

  return (
    <Col
      data-testid="queueDetails"
      span={24}
      className="cls-edit-queue-container"
    >
      { 
        isCurrentPathEqual("editQueue") && queueInfo ? 
        <div className="EditQueueContainerGrid mb-2">
          {queueInfo.modified_user_name ? (
            <p className="EditDetails f-med fs-14">
              Last {queueInfo?.purpose_name.toLowerCase()} by :{" "}
              <Text className="cls-grey f-reg fs-14">
                {queueInfo?.modified_user_name} (Airline admin manager) | {" "}
                <Text className="cls-grey f-reg fs-13">
                  {moment(queueInfo?.modified_at).format("YYYY-MM-DD HH:MM A")}
                </Text>
              </Text>
            </p>
          ) : (
            <p className="EditDetails">
              Not modified {queueInfo?.purpose_name.toLowerCase()} yet
            </p>
          )}
        </div> : 
        <></>
      }
      <Card>
        <QueueSettingsForm
          mode={props.mode}
          queueInfo={isCurrentPathEqual("editQueue") ? queueInfo : null}
        />
      </Card>
    </Col>
  );
};
