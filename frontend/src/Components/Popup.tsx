import { Modal, Title, Button, Group } from "@mantine/core";
import { useTranslation } from "react-i18next";


export interface PopupProps {
  line: string;
  open: boolean;
  onNo: () => void;
  onYes: () => void;
};

function Popup({line, open, onNo, onYes}: PopupProps) {
  const { t } = useTranslation();
  
  return (
    <Modal opened={open} onClose={onNo} size={"sm"} centered>
      <Title order={4}>{line}</Title>
      <Group justify="space-between">
        <Button onClick={onNo} color="red">{t('no')}</Button>
        <Button onClick={onYes} color="green">{t('yes')}</Button>
      </Group>
    </Modal>
  );
}

export default Popup;
