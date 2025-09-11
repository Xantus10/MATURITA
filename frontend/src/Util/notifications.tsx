import { notifications } from "@mantine/notifications";
import { FaExclamationTriangle, FaInfoCircle, FaCheckCircle } from "react-icons/fa";


export interface showNotificationProps {
  title: string;
  message?: string;
  icon?: 'OK' | 'INFO' | 'ERR';
};

export function showNotification({ title, message="", icon='OK' }: showNotificationProps) {
  notifications.show({
    title: title,
    message: message,
    withCloseButton: true,
    autoClose: 5000,
    icon: (icon === 'OK') ? <FaCheckCircle /> : ((icon === 'INFO') ? <FaInfoCircle /> : <FaExclamationTriangle />),
  });
}

export async function autoHttpResponseNotification(res: Response, with200: boolean=false) {
  let status
  let msg;
  if (res.status) {
    status = res.status;
    let js = await res.json()
    msg = js.msg;
  } else {
    status = 500;
    msg = "FE res undefined!"
  }
  if (status === 200 && !with200) return;
  let props: showNotificationProps = {title: msg, icon: (status in [200, 201]) ? 'OK' : 'ERR'};
  showNotification(props);
}
