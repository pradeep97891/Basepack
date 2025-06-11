import { isRejectedWithValue } from '@reduxjs/toolkit';
import { notification } from 'antd';
import { Middleware, MiddlewareAPI } from 'redux';

// intercept all service errors and show notification
export const serviceErrorLoggerMiddleware: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
  if (isRejectedWithValue(action) && 0) {
    if (action && action.meta && ['initialAuthService', 'deleteFolder'].includes(action.meta.arg.endpointName)) {
      return next(action);
    }
    console.log('service error with action', action);
    let description = action.error.data ? action.error.data.message : action.error.message;
    if (action.payload && action.payload.error) {
      description = action.payload.error;
    }
    notification.error({ message: 'Network error', description });
  }
  return next(action);
};
