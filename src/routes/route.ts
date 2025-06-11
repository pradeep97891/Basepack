import { lazy } from "react";

//LAYOUTS
const LandingLayout = lazy(() => import("@/layouts/Landing/Landing"));
const PlanBLayout = lazy(() => import("@/layouts/planB/PlanB"));
const HomeLayout = lazy(() => import("@/layouts/Home/Home"));
const HomeHorizontalLayout = lazy(
  () => import("@/layouts/HomeHorizontal/HomeHorizontal")
);
const SearchLayout = lazy(() => import("@/layouts/SearchLayout/SearchLayout"));

//Unauth
const PlanB = lazy(() => import("@/pages/Unauth/PlanB/PlanB"));
const Login = lazy(() => import("@/pages/Unauth/Login/Login"));

const LoginWithOTP = lazy(
  () => import("@/pages/Unauth/LoginWithOTP/loginwithotp")
);
const ForgotPassword = lazy(
  () => import("@/pages/Unauth/ForgotPassword/ForgotPassword.lazy")
);
const ResetPassword = lazy(
  () => import("@/pages/Unauth/ResetPassword/ResetPassword.lazy")
);

//Auth
const Dashboard = lazy(() => import("@/pages/Auth/Dashboard/Dashboard"));
const PrePlannedDisruptionList = lazy(
  () => import("@/pages/Auth/PrePlannedDisruption/PrePlannedDisruptionList")
);
const QueueList = lazy(() => import("@/pages/Auth/Queue/QueueList/QueueList"));
const ViewPnrInfo = lazy(() => import("@/pages/Auth/ViewPnrInfo/ViewPnrInfo"));
const FlightDisruption = lazy(
  () => import("@/pages/Auth/FlightDisruption/FlightDisruption")
);
const SearchFlight = lazy(
  () => import("@/pages/Auth/SearchFlight/SearchFlight")
);
const AddSSR = lazy(() => import("@/pages/Auth/AddSSR/AddSSR"));
const ReviewFlight = lazy(
  () => import("@/pages/Auth/ReviewFlight/ReviewFlight")
);
const AdhocDisruptionList = lazy(
  () => import("@/pages/Auth/AdhocDisruptionList/AdhocDisruptionList")
);
const QueueSettings = lazy(
  () => import("@/pages/Auth/Queue/QueueSettings/QueueSettings")
);
const Reaccommodation = lazy(
  () => import("@/pages/Auth/Reaccommodation/Reaccommodation")
);
const ItineraryConfirm = lazy(
  () => import("@/pages/Auth/ItineraryConfirm/ItineraryConfirm")
);
const ScoreSettings = lazy(
  () => import("@/pages/Auth/ScoreList/ScoreSettings/ScoreSettings")
);
const Policy = lazy(() => import("@/pages/Auth/Policy/Policy"));
const CreatePolicy = lazy(
  () => import("@/pages/Auth/Policy/CreatePolicy/CreatePolicy")
);
const ComingSoon = lazy(() => import("@/components/ComingSoon/ComingSoon"));
const Mailer = lazy(() => import("@/pages/Auth/Mailer/Mailer"));
const Payment = lazy(() => import("@/components/paymentPage/paymentPage"));
const CustomRport = lazy(
  () => import("@/pages/Auth/CustomReport/CustomReport")
);
const BiDashboard = lazy(() => import("@/pages/Auth/BiDashboard/BiDashboard"));
const AddUser = lazy(() => import("@/pages/Auth/AddUser/AddUser"));
const ViewUsers = lazy(() => import("@/pages/Auth/ViewUsers/ViewUsers"));
const ScoreList = lazy(() => import("@/pages/Auth/ScoreList/ScoreList"));
const Faq = lazy(() => import("@/pages/Auth/Faq/Faq"));

//LAYOUTS
const Layouts = new Map();
Layouts.set("LandingLayout", LandingLayout);
Layouts.set("PlanBLayout", PlanBLayout);
Layouts.set("HomeLayout", HomeLayout);
Layouts.set("HomeHorizontalLayout", HomeHorizontalLayout);
Layouts.set("SearchLayout", SearchLayout);

const Components = new Map();
//Unauth
Components.set("PlanB", PlanB);
Components.set("Login", Login);
Components.set("LoginWithOTP", LoginWithOTP);
Components.set("ForgotPassword", ForgotPassword);
Components.set("ResetPassword", ResetPassword);

//Auth
Components.set("Dashboard", Dashboard);
Components.set("PrePlannedDisruptionList", PrePlannedDisruptionList);
Components.set("QueueList", QueueList);
Components.set("QueueSettings", QueueSettings);
Components.set("ViewPnrInfo", ViewPnrInfo);
Components.set("FlightDisruption", FlightDisruption);
Components.set("SearchFlight", SearchFlight);
Components.set("AddSSR", AddSSR);
Components.set("ReviewFlight", ReviewFlight);
Components.set("Reaccommodation", Reaccommodation);
Components.set("AdhocDisruptionList", AdhocDisruptionList);
Components.set("ItineraryConfirm", ItineraryConfirm);
Components.set("ScoreSettings", ScoreSettings);
Components.set("Policy", Policy);
Components.set("CreatePolicy", CreatePolicy);
Components.set("ComingSoon", ComingSoon);
Components.set("Mailer", Mailer);
Components.set("Payment", Payment);
Components.set("CustomReport", CustomRport);
Components.set("BiDashboard", BiDashboard);
Components.set("AddUser", AddUser);
Components.set("Users", ViewUsers);
Components.set("ScoreList", ScoreList);
Components.set("Faq", Faq)

export { Components, Layouts };
