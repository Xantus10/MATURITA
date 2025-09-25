import { Button } from "@mantine/core";
import { useMsal, type IMsalContext } from "@azure/msal-react";
import { MdLogout } from "react-icons/md";
import { post } from "../Util/http";

export async function LogoutFunc(msalInstance?: IMsalContext['instance']) {
  await post('/auth/logout');
  if (msalInstance) {
    msalInstance.logoutPopup({mainWindowRedirectUri: "/"});
  }
}


function Logout({ onClick = 'handle' }: {onClick?: 'handle' | (() => void)}) {
  const {instance} = useMsal();

  return (
    <>
    <Button fullWidth color='red.7' onClick={(onClick === 'handle') ? (() => {LogoutFunc(instance)}) : (onClick)} leftSection={<MdLogout />}>Log out</Button>
    </>
  );
}

export default Logout;
