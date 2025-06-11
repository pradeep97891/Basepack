import React, { forwardRef, useImperativeHandle } from 'react';
import './Toastr.scss';
import { notification } from 'antd';
import type { NotificationArgsProps } from 'antd';

type NotificationPlacement = NotificationArgsProps['placement'];
type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface ToastrProps {
  data: {
    position: NotificationPlacement;
    closeIcon?: boolean;
    title?: string;
    description?: string;
    type: NotificationType;
    top?: number;
    right?:number;
    duration?: number;
    className?: string;
  }
}

export interface ToastrRef {
  childFunction: () => void;
}

const Toastr = forwardRef<ToastrRef, ToastrProps>((props, ref) => {

  const config = {
    top: props?.data?.top,
    // maxCount: 1
  }
  const [api, contextHolder] = notification.useNotification(config);

  const childFunction = () => {
    // api.destroy();
    api[props.data.type]({
      message: props?.data?.title,
      description: props?.data?.description,
      placement: props?.data?.position,
      closeIcon: false,
      duration: props?.data?.duration,
      className: props?.data.className
    });
  };

  useImperativeHandle(ref, () => ({
    childFunction: childFunction
  }));

  return (
    <>
      {contextHolder}
    </>
  );
});

export default Toastr;
