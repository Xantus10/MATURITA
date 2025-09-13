import { notifications } from "@mantine/notifications";
import { FaExclamationTriangle, FaInfoCircle, FaCheckCircle } from "react-icons/fa";


export interface showNotificationProps {
  title: string;
  message?: string;
  icon?: 'OK' | 'INFO' | 'ERR';
};

export function showNotification({ title, message="", icon='OK' }: showNotificationProps) {
  console.log(icon);
  notifications.show({
    title: title,
    message: message,
    withCloseButton: true,
    autoClose: 5000,
    color: (icon === 'OK') ? "green" : ((icon === 'INFO') ? "blue" : "red"),
    icon: (icon === 'OK') ? <FaCheckCircle /> : ((icon === 'INFO') ? <FaInfoCircle /> : <FaExclamationTriangle />),
  });
}

export async function autoHttpResponseNotification(res: Response, with200: boolean=false) {
  let status
  let msg;
  if (res.status) {
    status = res.status;
    let js = await res.clone().json()
    msg = js.msg;
  } else {
    status = 500;
    msg = "FE res undefined!"
  }
  if (status === 200 && !with200) return;
  console.log(status);
  let props: showNotificationProps = {title: msg, icon: ([200, 201].includes(status)) ? 'OK' : 'ERR'};
  showNotification(props);
}
