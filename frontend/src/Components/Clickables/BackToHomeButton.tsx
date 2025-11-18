import { Button, Tooltip } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";

/**
 * Button to navigate to /
 */
function BackToHomeButton() {
  const navigate = useNavigate();

  return (
    <Tooltip label="Go back" position="bottom">
      <Button onClick={() => {navigate('/')}} rightSection={<FaHome />}>Back to</Button>
    </Tooltip>
  );
}

export default BackToHomeButton;
