import { notification } from 'antd';

const openNotificationWithIcon = (type, message, description = '') => {
  notification[type]({
    message,
    description,
  });
};

export default openNotificationWithIcon;
