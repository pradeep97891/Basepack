import { useEffect } from 'react';
import { useLocation } from 'react-router';
import ReactGA from 'react-ga';

// on every page change, will report to toogle analytics,
//  just have to use it once in App.tsx
const usePageTracking = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    if (window.location.href.indexOf('localhost') === -1) {
      ReactGA.pageview(pathname);
    }
  }, [pathname]);
};

// modal component does not change url
//   use this inside the modal component,
const useModalTracking = (name: string) => {
  useEffect(() => {
    if (window.location.href.indexOf('localhost') === -1) {
      ReactGA.modalview(name);
    }
  }, [name]);
};

export { usePageTracking, useModalTracking };
