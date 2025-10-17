import { Button } from "@mantine/core";
import { useMsal, type IMsalContext } from "@azure/msal-react";
import { MdLogout } from "react-icons/md";
import { post } from "../Util/http";

/**
 * Log the user out
 * 
 * @param msalInstance Instance of msal from useMsal
 */
export async function LogoutFunc(msalInstance?: IMsalContext['instance']) {
  await post('/auth/logout');
  if (msalInstance) {
    msalInstance.logoutPopup({mainWindowRedirectUri: "/"});
  }
}

/**
 * Button to log the user out  
 *   
 * The onClick param will call LogoutFunc by default (or with 'handle' specified) or it can call a custom function
 */
function Logout({ onClick = 'handle' }: {onClick?: 'handle' | (() => void)}) {
  const {instance} = useMsal();

  return (
    <>
    <Button fullWidth color='red.7' onClick={(onClick === 'handle') ? (() => {LogoutFunc(instance)}) : (onClick)} leftSection={<MdLogout />}>Log out</Button>
    </>
  );
}

export default Logout;
