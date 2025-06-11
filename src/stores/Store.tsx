import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { FC } from "react";
import {
  RescheduleService,
  CommonService,
  AuthService,
  EmailService,
} from "../services/Services";
import { serviceErrorLoggerMiddleware } from "./Service.middleware";
import { QueueReducer } from "./Queue.store";
import { PNRReducer } from "./Pnr.store";
import { userReducer } from "../stores/User.store";
import { FlightSeatReducer } from "./Ssr.store";
import { ReviewFlightReducer } from "./ReviewFlight.store";
import { PassengerListReducer } from "./Passenger.store";
import { DashboardReducer } from "./Dashboard.store";
import { NotificationService } from "../services/Services";
import { PnrListReducer } from "./PnrList.store";
import { initializerReducer } from "./Initializer.store";
import { MenuServiceReducer } from "./menu.store";
import { ThemeReducer } from "./Theme.store";
import { PolicyReducer } from "./Policy.store";
import { GeneralReducer } from "./General.store";

const store = configureStore({
  reducer: {
    user: userReducer,
    initializerReducer,
    GeneralReducer,
    PnrListReducer,
    PolicyReducer,
    DashboardReducer,
    MenuServiceReducer,
    QueueReducer,
    ThemeReducer,
    PNRReducer,
    ReviewFlightReducer,
    FlightSeatReducer,
    PassengerListReducer,
    [AuthService.reducerPath]: AuthService.reducer,
    [EmailService.reducerPath]: EmailService.reducer,
    [RescheduleService.reducerPath]: RescheduleService.reducer,
    [CommonService.reducerPath]: CommonService.reducer,
    [NotificationService.reducerPath]: NotificationService.reducer,
  },
  middleware: (getDefaultMidleware) =>
    getDefaultMidleware({serializableCheck: false})
      .concat(serviceErrorLoggerMiddleware)
      .concat(AuthService.middleware)
      .concat(EmailService.middleware)
      .concat(RescheduleService.middleware)
      .concat(CommonService.middleware)
      .concat(NotificationService.middleware),
  devTools: true,
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const AppStoreProvider: FC<ChildInterface> = (props) => {
  return <Provider store={store}>{props.children}</Provider>;
};

export { AppStoreProvider };
