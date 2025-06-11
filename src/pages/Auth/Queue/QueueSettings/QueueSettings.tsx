import { Col, Divider, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import "./QueueSettings.scss";
import { QueueDetails } from "./QueueDetails/QueueDetails";
import { useQueueSettings } from "@/hooks/Queue.hook";
import DescriptionHeader, { ItineraryHeaderProps }  from "@/components/DescriptionHeader/DescriptionHeader";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/hooks/App.hook";
import { useSessionStorage } from "@/hooks/BrowserStorage.hook";
import QueueSettingsSkeleton from "./QueueSettings.skeleton";
import { useRedirect } from "@/hooks/Redirect.hook";

const QueueSettings = () => {
  const { t } = useTranslation();
  const [queueList, setQueueList] = useState([]);
  const [editQueueId] = useSessionStorage<any>("editQueueId");
  const { useGetQueueList } = useQueueSettings();
  useGetQueueList();
  const {currentPath, isCurrentPathEqual} = useRedirect();
  
  const { QueueList } = useAppSelector(
    (state: any) => state.QueueReducer
  );

  let headerProps: ItineraryHeaderProps["data"] = {
    title: isCurrentPathEqual('editQueue')
              ? t("edit_queue") + " id - " + ((queueList?.filter((queue:any) => queue.queue_id === editQueueId))[0] as any)?.queue_number
              : t("create_new"),
    breadcrumbProps: [
      {
        path: "dashboard",
        title: t("dashboard"),
        breadcrumbName: "Dashboard",
        key: "Dashboard",
      },
      {
        path: "queueList",
        title: "Queue list",
        breadcrumbName: "Queue list",
        key: "Queue list",
      },
      {
        path: currentPath,
        title: t(
          isCurrentPathEqual('editQueue')
            ? `Edit queue`
            : `Create queue`
        ),
        breadcrumbName: t(
          isCurrentPathEqual('editQueue')
            ? `Edit queue`
            : `Create queue`
        ),
        key: t(
          isCurrentPathEqual('editQueue')
            ? `Edit queue`
            : `Create queue`
        ),
      },
    ]
  };

  // To store the queue list from store to local state for furter process
  useEffect(() => {
    setQueueList(QueueList);
  }, [QueueList]);

  return (
    <Row className="cls-queue-settings" data-testid="queueSettings">
      { queueList.length ? (
        <>
          <Col span={24}>
            <DescriptionHeader data={headerProps} />
          </Col>
          <Col className="cls-queue-box-container" span={24}>
              <QueueDetails
                data={queueList}
                mode={queueList.length > 0 ? "edit" : ""}
              />
          </Col>
        </>
      ) :
      <QueueSettingsSkeleton />
      }
    </Row>
  );
};

export default QueueSettings;