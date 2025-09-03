import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";


function BackToHomeButton() {
  const navigate = useNavigate();

  return (
    <>
      <Button onClick={() => {navigate('/')}} rightSection={<FaHome />}>Back to</Button>
    </>
  );
}

export default BackToHomeButton;
