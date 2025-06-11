import { Helmet, HelmetProvider } from "react-helmet-async";
import { useLocation } from "react-router";
import "./DocumentHead.scss";
import { useAppSelector } from "@/hooks/App.hook";
import { useLayoutEffect, useMemo, useState } from "react";
import { RouterResponse } from "@/services/initializer/InitializerTypes";
import { useRedirect } from "@/hooks/Redirect.hook";

const DocumentHead = () => {
  /* Initialize title and description state variables */
  const { currentPath } = useRedirect();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const { Routes, LandingRoutes } = useAppSelector(
    (state) => state.initializerReducer
  );

  /* Combine Routes and LandingRoutes */
  const combinedRoutes = useMemo(() => {
    /* Ensure arrays or null values */
    const landingRoutes = Array.isArray(LandingRoutes) ? LandingRoutes : [];
    const routes = Array.isArray(Routes) ? Routes : [];

    return [...landingRoutes, ...routes];
  }, [LandingRoutes, Routes]);

  /* Function to find a route object by its path within a given array */
  const findPathWithObject = useMemo(
    () => (routes: RouterResponse[], path: string) =>
      routes?.find((route) => route.path === path) || null,
    // eslint-disable-next-line
    [combinedRoutes]
  );

  /* Function to extract title and description from a route object or provide default values if the route is not found */
  const findTitleDescription = useMemo(
    () => (route: RouterResponse | null) =>
      route
        ? [route.title, route.description]
        : [
            "Airline Disruption Management Tool",
            "Welcome to the Airline Disruption Management Tool",
          ],
    // eslint-disable-next-line
    [findPathWithObject]
  );

  /* Effect hook to update title and description based on pathname changes */
  useLayoutEffect(() => {
    if (currentPath && combinedRoutes.length) {
      /* Find the matching route using both Routes and LandingRoutes */
      const route = findPathWithObject(combinedRoutes, currentPath);
      /* Extract title and description from the route or use defaults */
      const [tempTitle, tempDescription] = findTitleDescription(route);

      // Update document title directly
      document.title = tempTitle || "Airline Disruption Management Tool";

      setTitle(tempTitle);

      setDescription(tempDescription);
    }
  }, [currentPath, combinedRoutes, findPathWithObject, findTitleDescription]);

  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
    </HelmetProvider>
  );
};

export { DocumentHead };