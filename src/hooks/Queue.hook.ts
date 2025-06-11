import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  useLazyGetQueueQuery,
  useLazyGetEditQueueQuery,
  useLazyGetQueueMasterInfoQuery,
  useLazyGetRegularActionQuery,
} from "../services/queue/Queue";
import { IQueueData, IQueueMasterIfo } from "../services/queue/QueueTypes";
import {
  updateChangeInQueueList,
  updateQueueList,
  updateQueueCount,
} from "../stores/Queue.store";
import { useAppSelector } from "./App.hook";

const useQueueSettings = () => {
  const dispatch = useDispatch();
  const { isUpdated } = useAppSelector((state: any) => state.QueueReducer);
  const useGetQueueList: any = (pageNumber : number = 1) => {
    const [service, getQueueList] = useLazyGetQueueQuery();

    useEffect(() => {
      service({pageNumber : pageNumber});
    }, [isUpdated]);

    useEffect(() => {
      if (
        getQueueList.isSuccess &&
        getQueueList &&
        getQueueList.data &&
        getQueueList.data.responseCode === 0
      ) {
        dispatch(updateQueueList((getQueueList as any).data.response.data.results));
        if ((getQueueList as any).data.response.data?.results.length) {
          dispatch(updateChangeInQueueList(true));
          dispatch(updateQueueCount(Number((getQueueList as any).data.response.data?.count)));
        }
      }
    }, [getQueueList]);
  };

  // Get Queue details by ID
  const useGetQueueInfoByID: any = ({
    activeId,
  }: {
    activeId: string | number;
  }) => {
    const [getQueueService, getQueueServiceStatus] = useLazyGetEditQueueQuery();
    const [queueInfo, setQueueInfo] = useState<IQueueData | null>(null);

    useEffect(() => {
      if (activeId !== 0 && activeId !== undefined) {
        getQueueService({ queue_id: activeId });
      }
    }, [activeId, getQueueService]);

    useEffect(() => {
      if (
        getQueueServiceStatus.isSuccess &&
        getQueueServiceStatus.data &&
        getQueueServiceStatus.data.responseCode === 0
      ) {
        setQueueInfo(getQueueServiceStatus.data.response.data);
      }
    }, [activeId, getQueueServiceStatus]);

    return { queueInfo: queueInfo };
  };

  // Get Queue Regular Action List
  const useRegularActionSelection: any = () => {
    const [regularActionService, regularActionServiceStatus] =
      useLazyGetRegularActionQuery();
    const [data, setData] = useState({
      serviceData: [] as any,
      optionData: [] as any,
    });

    useEffect(() => {
      regularActionService({});
      // eslint-disable-next-line
    }, []);

    useEffect(() => {
      if (
        regularActionServiceStatus?.isSuccess &&
        regularActionServiceStatus?.data?.responseCode === 0
      ) {
        setData((regularActionServiceStatus as any).data.response.data.results);
        const temp = (regularActionServiceStatus as any).data.response.data.map(
          (action: any) => {
            return {
              label: action.rule_name,
              id: action.rule,
            };
          }
        );
        setData((prev) => {
          return {
            ...prev,
            optionData: temp,
            serviceData: (regularActionServiceStatus as any).data.response.data,
          };
        });
      }
    }, [regularActionServiceStatus]);

    return { regularActionInfo: data };
  };

  // To get the filter data
  const useQueueMasterData: any = () => {
    const [actions, setActions] = useState<IQueueMasterIfo[]>([]);
    const [getMasterInfo, getMasterInfoStatus] =
      useLazyGetQueueMasterInfoQuery();

    useEffect(() => {
      getMasterInfo({});
      // eslint-disable-next-line
    }, []);

    useEffect(() => {
      if (
        getMasterInfoStatus.isSuccess &&
        getMasterInfoStatus.data?.responseCode === 0
      ) {
        setActions((getMasterInfoStatus as any).data.response.data);
      }
    }, [actions, getMasterInfoStatus]);

    return { QueueMasterInfo: actions };
  };

  return {
    useGetQueueList,
    useGetQueueInfoByID,
    useRegularActionSelection,
    useQueueMasterData,
  };
};

export { useQueueSettings };
