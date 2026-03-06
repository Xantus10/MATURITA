import { Center, Tooltip } from "@mantine/core";
import { FaRegQuestionCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import classes from '../../styles/default.module.css'


function Help() {
  const { t } = useTranslation();
  
  return (
    <>
      <Tooltip label={t('help')}>
        <a href="/guide.html" target="_blank">
          <Center p="7px" w="fit-content" bdrs="100%" className={classes.seeThroughBtn} style={{aspectRatio: "1/1", cursor: 'pointer'}} ><FaRegQuestionCircle size="1.5rem" /></Center>
        </a>
      </Tooltip>
    </>
  );
}

export default Help;