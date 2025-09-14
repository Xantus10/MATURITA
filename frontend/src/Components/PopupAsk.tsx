import type React from "react";
import { Modal, Title, Button, Group } from "@mantine/core";
import { useTranslation } from "react-i18next";


export interface PopupAskProps<T> {
  line?: string;
  open: boolean;
  onNo: () => void | Promise<void>;
  onYes: (arg: T) => void | Promise<void>;
  input: {
    element: React.ReactNode;
    value: T;
  };
};

function PopupAsk<T=string>({line, open, onNo, onYes, input }: PopupAskProps<T>) {
  const { t } = useTranslation();
  
  return (
    <Modal opened={open} onClose={onNo} size={"sm"} centered>
      {(line) ? <Title order={4}>{line}</Title> : <></>}
      {input.element}
      <Group justify="space-between">
        <Button onClick={onNo} color="red">{t('no')}</Button>
        <Button onClick={() => {onYes(input.value)}} color="green">{t('yes')}</Button>
      </Group>
    </Modal>
  );
}

export default PopupAsk;
