import React, { lazy, Suspense } from 'react';

const LazyResetPassword = lazy(() => import('./PlanB'));

const ResetPassword = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode }) => (
  <Suspense fallback={null}>
    <LazyResetPassword {...props} />
  </Suspense>
);

export default ResetPassword;
