import { Button, Tooltip } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";

import { useTranslation } from "react-i18next";

/**
 * Button to navigate to /
 */
function BackToHomeButton() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Tooltip label={t('backtooltip')} position="bottom">
      <Button onClick={() => {navigate('/')}} rightSection={<FaHome />}>{t('back')}</Button>
    </Tooltip>
  );
}

export default BackToHomeButton;
