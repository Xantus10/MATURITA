import { Modal, Title, Button, Group } from "@mantine/core";
import { useTranslation } from "react-i18next";

/**
 * Props for the Popup component
 */
export interface PopupProps {
  /**
   * The title of the popup
   */
  line: string;

  /**
   * State of the popup (useDisclosure)
   */
  open: boolean;

  /**
   * When user clicks 'no' (Typically close the Popup/Disclosure)
   */
  onNo: () => void | Promise<void>;

  /**
   * When user clicks 'yes' (Typically do the action)
   */
  onYes: () => void | Promise<void>;
};

/**
 * Display a popup asking a simple question with yes/no answer
 */
function Popup({line, open, onNo, onYes}: PopupProps) {
  const { t } = useTranslation();
  
  return (
    <Modal opened={open} onClose={onNo} size={"sm"} centered>
      <Title order={4}>{line}</Title>
      <Group justify="space-between" mt="30px">
        <Button onClick={onNo} variant="filled" color="red">{t('no')}</Button>
        <Button onClick={() => {onYes(); onNo()}} variant="filled" color="green">{t('yes')}</Button>
      </Group>
    </Modal>
  );
}

export default Popup;
