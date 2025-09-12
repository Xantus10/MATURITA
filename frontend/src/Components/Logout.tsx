import { Button } from "@mantine/core";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { post } from "../Util/http";

export async function LogoutFunc() {
  await post('/auth/logout');
  const navigate = useNavigate();
  navigate('/');
}


function Logout({ onClick = LogoutFunc }: {onClick?: () => void}) {

  return (
    <>
    <Button fullWidth color='red.7' onClick={onClick} leftSection={<MdLogout />}>Log out</Button>
    </>
  );
}

export default Logout;
