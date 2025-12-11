import { Modal, Table, Button, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IoShareSocial } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import ClickAndCopy from "../Clickables/ClickAndCopy";
import type { Socials } from "../../Util/cache";


/**
 * Will iterate over the contacts and display key-value pairs
 */
function SocialsPopup({ contacts }: { contacts?: Socials }) {
  const [open, openController] = useDisclosure(false);
  const { t } = useTranslation();

  return (
    <>
    <Tooltip label={t('socials')}>
      <Button onClick={openController.open} style={{aspectRatio: "1/1", height: "2rem"}} ><IoShareSocial /></Button>
    </Tooltip>

    <Modal opened={open} onClose={openController.close}>
      <Table data={{body: Object.entries((contacts) ? contacts : {}).map(([key, val]) => {
        return [key, <ClickAndCopy display={val} copy={val} />]
      })}} />
    </Modal>
    </>
  );
}

export default SocialsPopup;