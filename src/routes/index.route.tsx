// Import necessary modules and components.
import { FunctionComponent, Suspense, useEffect, useState } from "react";
import { useLocation} from "react-router-dom";
import { Loader } from "../components/Loader/Loader";
import { useAuth } from "../hooks/Auth.hook";
import PageNotFound from "../pages/Unauth/PageNotFound/PageNotFound";
import {
  useGetLandingRoutesMutation,
  useGetMenuServiceMutation,
  useGetMenusMutation,
} from "../services/initializer/Initializer";
import { Components, Layouts } from "./route";
import { useDispatch } from "react-redux";
import { setMenuServiceData } from "../stores/menu.store";
import NoInternet from "../pages/Unauth/NoInternet/NoInternet";
import NetworkConnection from "../hooks/NetworkConnection.hook";
import { useEventListener } from "@/hooks/EventListener.hook";
import SessionTimeoutProvider from "@/components/SessionTimeoutProvider/SessionTimeoutProvider";
import {
  useLocalStorage,
  useSessionStorage,
} from "@/hooks/BrowserStorage.hook";
import useMinimumDelay from "../hooks/MinimumDelay.hook";
import { useRedirect } from "@/hooks/Redirect.hook";
import { setLandingRoute, setRoute } from "@/stores/Initializer.store";
import CFG from "@/config/config.json";

/**
 * Type definition for the route API.
 * @typedef {Object} TrouteAPI
 * @property {boolean} [default] - Indicates if it's the default route.
 * @property {FunctionComponent} component - The component to be rendered.
 * @property {string} path - The path for the route.
 * @property {number|string} route_id - Unique identifier for the route.
 * @property {string} layout - The layout to be used.
 * @property {string[]} permission - Array of permissions required for the route.
 */
type TrouteAPI = {
  default?: boolean;
  component: FunctionComponent<any>;
  path: string;
  route_id: number | string;
  layout: string;
  permission: string[];
};

/* Previous route storage key to handle navigate(-1) functinality using 'previousPage' method */
const PREV_ROUTE_STORAGE_KEY = "pr";

/**
 * AppRoute component handles the routing logic for the application.
 * It manages routes, authentication, and layout components dynamically.
 */
const AppRoute: React.FC = () => {
  const dispatch = useDispatch();
  const {currentPath, redirect } = useRedirect();

  // Authentication and network status
  const { isAuthenticated } = useAuth();
  // NetworkConnection custom hook to check the network connection status.
  const isOnline = NetworkConnection();

  // Route data and redirection states
  const [routeData, setRouteData] = useState<TrouteAPI[]>([]);
  const [redirects, setRedirects] = useState<string[]>(["/"]);
  const [isRouteValid, setIsRouteValid] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<any>(undefined);

  // Loading states and delays
  const LOADER_DELAY = 1000;
  const SCROLL_DISPLAY_DELAY = 1000;
  const delayComplete = useMinimumDelay(LOADER_DELAY);
  const [authLoading, setAuthLoading] = useState(true);

  // Storage hooks
  const [, LsetPrevRoute] = useLocalStorage(PREV_ROUTE_STORAGE_KEY);
  const [Llayout] = useLocalStorage("layout");
  // const [SformData] = useSessionStorage("formData");
  const [SfinalViewPNRData ,] = useSessionStorage<any>("finalViewPNRData");

  // API mutation hooks
  const [routeLocalService, routeLocalServiceResponse] = useGetMenusMutation();
  const [routeService, routeServiceResponse] = useGetMenuServiceMutation();
  const [landingRoutesAPI, landingRoutesResponse] =
    useGetLandingRoutesMutation();

  const [SairlineCode, SsetAirlineCode] = useSessionStorage("airlineCode");

  /* Toggles the scrollbar visibility on scroll events. */
  const scrollbarToggle = () => {
    const body = document.body;
    let isScrolling: any;
    window.addEventListener("scroll", function () {
      body.classList.remove("hide-scrollbar");
      body.classList.add("show-scrollbar");
      window.clearTimeout(isScrolling);
      isScrolling = setTimeout(function () {
        body.classList.remove("show-scrollbar");
        body.classList.add("hide-scrollbar");
      }, SCROLL_DISPLAY_DELAY);
    });
  };

  // useEventListener custom hook to add a scroll event listener to the document.
  useEventListener("scroll", scrollbarToggle, document);

  /**
   * useEffect hook to fetch landing and authenticated routes based on authentication status.
   * Calls the landingRoutesAPI if the user is not authenticated.
   * Calls the routeService and routeLocalService if the user is authenticated.
   */
  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated !== null) {
        if (isAuthenticated) {
          // Load the auth routes when user logged in
          try {
            let menuUrl = `${process.env.REACT_APP_API_URL}`;
            await routeService({
              url: `${menuUrl?.slice(0, menuUrl.lastIndexOf("/"))}/menu/reschedule/`,
            });
            await routeLocalService([]);
          } catch (error) {
            console.error("Error fetching routes:", error);
          }
        } else {
          // Else load the landing routes
          try {
            await landingRoutesAPI([]);
          } catch (error) {
            console.error("Error fetching landing routes:", error);
          }
        }
      }
    };

    fetchData();
    SsetAirlineCode(SairlineCode ? SairlineCode : CFG.airline_code);

  }, [isAuthenticated, routeLocalService, routeService, landingRoutesAPI]);

  /**
   * useEffect hook to handle route data, menu service data & invalid redirects.
   * Sets the route data and dispatches menu service data to the Redux store.
   */
  useEffect(() => {
    /**
     * Function to set invalid redirects based on the given routes.
     * @param {TrouteAPI[]} landingRoutes - Array of landing routes.
     * @param {TrouteAPI[]} routes - Array of authenticated routes.
     */
    const setInvalidRedirects = (
      landingRoutes: TrouteAPI[],
      routes: TrouteAPI[]
    ) => {
      setRedirects(
        ["/", ...landingRoutes?.map((route) => route.path)].filter(
          (path) => !routes?.some((route) => route.path === path)
        )
      );
    };

    const getRouteData = (response: any) => response?.data?.response?.data;

    let routeServiceData = 
      // getRouteData(routeLocalServiceResponse);
      routeServiceResponse?.isSuccess
      ? getRouteData(routeServiceResponse) || []
      : routeServiceResponse?.isError && routeLocalServiceResponse?.isSuccess
        ? getRouteData(routeLocalServiceResponse) || []
        : [];

    let landingRoutesData =
      (landingRoutesResponse?.isSuccess &&
        getRouteData(landingRoutesResponse)) ||
      [];

    if (isAuthenticated) {
      setInvalidRedirects(landingRoutesData, routeServiceData?.route);
      setRouteData(routeServiceData?.route);
    } else {
      setRouteData(landingRoutesData);
    }

    /* Used in document head */
    dispatch(setRoute(routeServiceData?.route))
    dispatch(setLandingRoute(landingRoutesData))

    /* Used in menu */
    dispatch(setMenuServiceData(routeServiceData?.menu));
    
    setAuthLoading(false);
  }, [
    isAuthenticated,
    routeServiceResponse,
    routeLocalServiceResponse,
    landingRoutesResponse,
    dispatch,
  ]);

  /**
   * useEffect hook to handle routing logic based on the current path.
   *
   * 1. Decrypts the current path to find route details from the API.
   * 2. Redirects to default routes if the path matches any from the redirects list.
   * 3. Sets the layout and component for the current page.
   * 4. Navigates to the 404 page if the route is invalid.
   */
  useEffect(() => {
    const handleNavigation = () => {
      // Exit if no route data available
      if (!routeData?.length) return;

      try {
        // Check if the path is in redirects, then find the default route
        if (redirects.includes(currentPath)) {
          let defaultRoute = routeData.find(
            (route: TrouteAPI) => route.default
          );

          // Special condition to redirect to specific route based on authentication and form data
          if (isAuthenticated && SfinalViewPNRData && defaultRoute?.path === "/planB") {
            defaultRoute = routeData.find(
              (route: TrouteAPI) => route.path === "/viewPnrInfo"
            );
          }

          // Redirect to the default route
          redirect(defaultRoute?.path as string);
        } else {
          // Find the current route based on decrypted path
          const currentRoute = routeData.find((route) => route.path === currentPath);

          // Set route validity flag
          setIsRouteValid(!!currentRoute);

          // Navigate to the 404 page
          if (!currentRoute) throw new Error();

          // Cache the current route for possible "go back" navigation
          LsetPrevRoute(currentRoute?.path);
          const layout = Llayout
            ? Layouts.get(Llayout)
            : Layouts.get(currentRoute?.layout);
          const component = Components.get(currentRoute?.component);
          if (!(layout || component)) {
            console.log(
              `Component(${currentRoute?.component}) or layout(${Layouts.get(currentRoute?.layout)}) is missing.`
            );
          }
          setCurrentPage({
            layout: layout,
            component: component,
          });
        }
      } catch {
        // Catch any decryption errors and navigate safely to 404
        currentPath !== "/404" && redirect("404");
      }
    };

    // Trigger navigation logic when dependencies are ready
    if (!authLoading && delayComplete && isAuthenticated !== null)
      handleNavigation();
  }, [
    authLoading,
    delayComplete,
    isAuthenticated,
    routeData,
    currentPath,
    redirects,
    SfinalViewPNRData,
    LsetPrevRoute,
  ]);

  // Render loader or components based on authentication and network status
  if (!delayComplete || authLoading || !redirects?.length)
    return <Loader fallback={true} />;

  /**
   * Returns the loader if the authentication status is null.
   * Renders the NoInternet component if the user is offline.
   * Provides session timeout handling and renders the current page layout and component.
   * Renders the PageNotFound component if the route is invalid.
   */
  return isOnline ? (
    // <SessionTimeoutProvider exemptedRoutes={redirects}>
    <>
      {!isRouteValid ? (
        <PageNotFound />
      ) : currentPage ? (
        <Suspense fallback={<Loader fallback={true} />}>
          <currentPage.layout>
            <Suspense fallback={<Loader fallback={true} />}>
              <currentPage.component />
            </Suspense>
          </currentPage.layout>
        </Suspense>
      ) : (
        <Loader />
      )}
    </>
  ) : (
    // </SessionTimeoutProvider>
    <NoInternet />
  );
};

export { AppRoute };
