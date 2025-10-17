import { notifications } from "@mantine/notifications";
import { FaExclamationTriangle, FaInfoCircle, FaCheckCircle } from "react-icons/fa";

/**
 * Props for showing notification
 */
export interface showNotificationProps {
  /**
   * Title of the notification
   */
  title: string;

  /**
   * Optional message of the notification
   */
  message?: string;

  /**
   * Which icon to display
   */
  icon?: 'OK' | 'INFO' | 'ERR';
};

/**
 * Display a notification (wrapper around notifications.show)
 */
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

/**
 * Generate an automatic notification on Response  
 * !!! Call BEFORE any interaction with the Response !!!
 * 
 * @param res Fetch Response
 * @param with200 Generate a notification for 200 response?
 */
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
