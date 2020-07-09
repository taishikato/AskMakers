import { notification } from 'antd';

const openNotificationWithIcon = (type, message, description = '') => {
  notification[type]({
    message,
    description,
    style: { zIndex: 500 },
  });
};

export default openNotificationWithIcon;
