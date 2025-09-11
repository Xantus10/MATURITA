import { notifications } from "@mantine/notifications";
import { FaExclamationTriangle, FaInfoCircle, FaCheckCircle } from "react-icons/fa";


export function showNotification(title: string, message: string="", icon: 'OK' | 'INFO' | 'ERR'='OK') {
  notifications.show({
    title: title,
    message: message,
    withCloseButton: true,
    autoClose: 5000,
    icon: (icon === 'OK') ? <FaCheckCircle /> : ((icon === 'INFO') ? <FaInfoCircle /> : <FaExclamationTriangle />),
  });
}
