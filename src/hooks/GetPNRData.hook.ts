import { useEffect, useState } from "react";
import { useGetSyncQueueMutation } from "@/services/reschedule/Reschedule";

const useGetPNRData = (operation:string) => {
  const [queueList, queueListResponse] = useGetSyncQueueMutation();
  const [pnrList, setPnrList] = useState<any[]>([]);
  const [flightList, setFlightList] = useState<any[]>([]);
  const [pnrQueue, setPnrQueue] = useState<any[]>([]);
  const [flightQueue, setFlightQueue] = useState<any[]>([]);
  
  useEffect(() => {
    queueList([]);
  }, []);

  const fetchData = () => {
    if (!queueListResponse?.isSuccess) return;

    const queueData = (queueListResponse.data as any)?.response?.data || [];
    setPnrQueue(queueData?.preplannedPNRs);
    setFlightQueue(queueData?.adhocFlights);

    const pnrAccumulator:any = [];
    const flightAccumulator:any = [];

    queueData?.preplannedPNRs?.forEach((pnrs: any) => {
      pnrs.data?.forEach((pnr: any) => {
        pnrAccumulator.push(pnr);
      });
    });

    queueData?.adhocFlights?.forEach((flights: any) => {
      flights.data?.forEach((flight: any) => {
        flightAccumulator.push(flight);
      });
    });

    setPnrList(pnrAccumulator);
    setFlightList(flightAccumulator);
  };

  useEffect(() => {
    fetchData();
  }, [queueListResponse?.isSuccess]);
  
  if(queueListResponse?.isSuccess) {
    switch (operation) {
      case "pnr":
        return pnrList;
      case "flight":
        return flightList;
      case "pnrQueue":
        return pnrQueue;
      case "flightQueue":
        return flightQueue;
      default:
        return [];
    }
  }
};

export default useGetPNRData;
