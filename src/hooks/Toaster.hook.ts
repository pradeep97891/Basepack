import { notification } from 'antd';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

/** Configuration for displaying a notification */
export type ToasterType = {
  type: NotificationType;
  title: string;
  description: string;
  duration?: any;
  width?: string | number;
};

/**
 * Custom hook for displaying toast notifications.
 * Uses Ant Design's notification component.
 * @returns Object containing a function to show toast notifications and a context holder for notification API.
 */
const useToaster = () => {
  const [api, toasterContextHolder] = notification.useNotification();

  /**
   * Function to display a toast notification.
   * @param config Configuration for the notification.
   */
  const showToaster = (config: ToasterType) => {
    api[config.type ?? 'success']({
      message: config.title,
      description: config.description,
      style: {
        width: config.width ? config.width : 350
      },
      ...(config.duration !== undefined && { duration: config.duration })
    });
  };

  return { showToaster, toasterContextHolder };
};

export { useToaster };
