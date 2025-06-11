import { useEffect, useRef } from "react";
import "./Notification.scss";
import { useState } from "react";
import {
  Modal,
  Button,
  Row,
  Avatar,
  Col,
  Collapse,
  Divider,
  Empty,
  Typography,
  Tooltip,
} from "antd";
import { MessageData, ReadAtList, userParamData } from "./Notification.d";
import { hydrateUserFromLocalStorage } from "@/Utils/user";
import {
  useGetMessageMutation,
  useUpdateMessageStatusMutation,
} from "@/services/notification/Notification";
import { FdNotificationIcon } from "../Icons/Icons";
import { useTranslation } from "react-i18next";
const { Text } = Typography;

function Notification() {
  const { t } = useTranslation();
  const readMessageList = useRef<ReadAtList>({ id: [], read_at: "" });
  const initialRender = useRef(true);
  const [open, setopen] = useState(false);
  const hasMore = useRef(true);
  const [pageNo, setPageNo] = useState(1);
  const { Panel } = Collapse;
  // eslint-disable-next-line
  const [getList, MessageResponse] = useGetMessageMutation();
  const [updateStatus] = useUpdateMessageStatusMutation();
  const [readData, setReadData] = useState<MessageData[]>([]);
  const userData: any = hydrateUserFromLocalStorage();

  const getListPostData: userParamData = {
    email_id: userData?.email,
    project: "GRM",
    page: pageNo,
  };

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      getList(getListPostData).then((resolvedData: any) => {
        if (resolvedData?.data?.responseCode === 0) {
          let MessageList = resolvedData?.data?.response?.data.results;
          hasMore.current = resolvedData?.data?.response?.data.links.next
            ? true
            : false;
          setReadData((prev) => [...prev, ...MessageList]);
        }
      });
    }
    // eslint-disable-next-line
  }, [pageNo]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      if (readMessageList.current.id.length > 0) {
        updateStatus(readMessageList.current);
      }
    }
    // eslint-disable-next-line
  }, [readData]);

  const TriggerModal = (event: any) => {
    return setopen(!open);
  };

  const getCurrentTime = () => {
    let dateObj = new Date();
    return dateObj.toISOString();
  };

  const getReceivedTime = (targetDate: string) => {
    const date: any = new Date(targetDate);
    const now: any = new Date();

    const diffInMs = now - date;
    const diffInSecs = Math.floor(diffInMs / 1000);
    const diffInMins = Math.floor(diffInSecs / 60);
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInMonths / 12);

    if (diffInYears > 0) {
      return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
    } else if (diffInMonths > 0) {
      return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
    } else if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else if (diffInMins > 0) {
      return `${diffInMins} minute${diffInMins > 1 ? "s" : ""} ago`;
    } else {
      return `${diffInSecs} second${diffInSecs > 1 ? "s" : ""} ago`;
    }
  };

  /**
   * function to change the status of the Notification message and prepare data for the api call
   * ReadAll params is used to change the flow of the function
   */
  const MarkAsRead = (event: any, index: any, ReadAll: boolean = false) => {
    let apiData: MessageData[] = JSON.parse(JSON.stringify([...readData]));
    if (ReadAll === false) {
      apiData[index].read_at = getCurrentTime();
      console.warn("updated-------->", readMessageList);
      readMessageList.current.id.push(apiData[index].id);
      readMessageList.current.read_at = apiData[index].read_at;
      setReadData(apiData);
    } else {
      apiData = apiData.map((message: MessageData, key: number) => {
        if (message.status_name !== "Read") {
          message.status_name = "Read";
          message.read_at = getCurrentTime();
          readMessageList.current.id.push(message.id);
          if (readMessageList.current.read_at === "") {
            readMessageList.current.read_at = message.read_at;
          }
        }
        return message;
      });

      setReadData(apiData);
    }
  };

  const getTitle = (data: MessageData, index: number) => {
    return (
      <Col className="cls-message" key={data.id}>
        <span
          className={!data?.read_at ? "cls-not-read" : ""}
          onClick={(event: any) => MarkAsRead(event, index)}
          data-msg-id={data?.id}
        >
          {data.title}
        </span>
      </Col>
    );
  };

  const handelScroll = (event: any) => {
    if (
      Math.abs(
        event.target.scrollHeight -
          event.target.clientHeight -
          event.target.scrollTop
      ) <= 1
    ) {
      if (hasMore.current) {
        setPageNo((prev) => prev + 1);
      }
    }
  };
  return (
    <div data-testid="Notification">
      <Tooltip title={t("view_notifications")}>
        <Button type="text" onClick={TriggerModal} className="cls-notification-comp">
          <FdNotificationIcon  />
        </Button>
      </Tooltip>
      <Modal
        title="Notification"
        open={open}
        onCancel={TriggerModal}
        className="cls-modal"
        width={364}
        closeIcon={<Text className="cls-close-icon Infi-Fd_09_CloseIcon"></Text>}
        // ref={bottom_ref}
        footer={
          <>
            {/* <Divider plain />
            <Text
              className="cls-mark-as-read"
              onClick={(event) => MarkAsRead(event, readData, true)}
            >
              Mark all as read
            </Text> */}
          </>
        }
      >
        <div className="cls-modal-body" onScroll={(e) => handelScroll(e)}>
          {readData.length===0? (
            <Empty description={"No Notifications"} className="cls-ant-empty" />
          ) : (
            <Row gutter={[0, 12]}>
              {readData.map((value: MessageData, key: number) => {
                let other;
                other = JSON.parse(value.other);
                return (
                  <Col span={24}>
                    <Row>
                      <Col span={4} className="cls-profile-picture">
                        <Avatar size={30} src={other.icon} />
                      </Col>
                      <Col span={20} className="cls-message">
                        <Collapse accordion ghost>
                          <Panel
                            header={getTitle(value, key)}
                            showArrow={false}
                            key="notificationCollapse"
                          >
                            <Row
                              className="cls-message-body-box"
                              gutter={[0, 5]}
                            >
                              <Col className="cls-message-body">
                                {value.body}
                              </Col>
                            </Row>
                          </Panel>
                        </Collapse>
                        <Row>
                          <Col className="cls-message-received-time">
                            {getReceivedTime(value.sent_at)}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                );
              })}
            </Row>
          )}
        </div>
      </Modal>
    </div>
  );
}

export { Notification };
