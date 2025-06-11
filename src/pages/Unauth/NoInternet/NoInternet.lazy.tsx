import React, { lazy, Suspense } from 'react';

const LazyNoInternet = lazy(() => import('./NoInternet'));

const PageNotFound = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyNoInternet {...props} />
  </Suspense>
);

export default LazyNoInternet;
