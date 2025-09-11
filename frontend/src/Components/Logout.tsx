import { Button } from "@mantine/core";
import { MdLogout } from "react-icons/md";
import { post } from "../Util/http";

export async function LogoutFunc() {
  let res = await post('/auth/logout');
  if (res?.status === 200) {
    console.log('logged out');
  }
}


function Logout({ onClick = LogoutFunc }: {onClick?: () => void}) {

  return (
    <>
    <Button fullWidth color='red.7' onClick={onClick} leftSection={<MdLogout />}>Log out</Button>
    </>
  );
}

export default Logout;
