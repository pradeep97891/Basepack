import { useEffect, useState } from 'react';
import { useAppSelector } from './App.hook';

const useFlightChangesListData = () => {
  const [flightChangesData, setFlightChangesData] = useState({
    flightData: [] as any,
    passengerData: [] as any,
    rescheduleStatus: '' as string
  });
  const { activePNR } = useAppSelector((state: any) => state.PNRReducer);

  useEffect(() => {
      let flightDetailData: any[] = [];
      if (activePNR) {
        for (let i = 0; i < (activePNR[0]?.rebookOptionalFlightDetails as [])?.length; i++) {
          let tempPnrData: any = { ...activePNR[0]?.rebookOptionalFlightDetails[i] };
          tempPnrData['bookedFlight'] = {};
          flightDetailData[flightDetailData.length] = {
            flightData: tempPnrData,
            status: '',
            date: ''
          };
        }
        setFlightChangesData((prev: any) => {
          let pnrDetails = {
            ...prev,
            flightData: flightDetailData,
            paxInfo: activePNR[0]?.paxInfo
          };

          return pnrDetails;
        });
      } else {
        setFlightChangesData({
          flightData: [],
          passengerData: [],
          rescheduleStatus: ''
        });
      }
  }, [activePNR]);

  return { FCDataList: flightChangesData };
};

export { useFlightChangesListData };
