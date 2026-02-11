import type React from "react";
import { Modal, Title, Button, Group, Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";

/**
 * Props for the PopupAsk component
 */
export interface PopupAskProps<T> {
  /**
   * The title of the popup
   */
  line?: string;

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
   * 
   * @param arg Function will take a single arg with a specific type (Can be an object)
   */
  onYes: (arg: T) => void | Promise<void>;

  /**
   * Input aspect of the PopupAsk
   */
  input: {
    /**
     * Element/s to display in the popup
     */
    element: React.ReactNode;

    /**
     * Value, which is a) mutated by the element/s and b) passed to the onYes function
     */
    value: T;
  };
};

/**
 * A popup with enhanced functionality to input value/s
 */
function PopupAsk<T=string>({line, open, onNo, onYes, input }: PopupAskProps<T>) {
  const { t } = useTranslation();
  
  return (
    <Modal opened={open} onClose={onNo} size={"sm"} centered>
      {(line) ? <Title order={4}>{line}</Title> : <></>}
      
      <Stack>
        {input.element}
      </Stack>
      
      <Group justify="space-between" mt="30px">
        <Button onClick={onNo} variant="filled" color="red">{t('no')}</Button>
        <Button onClick={() => {onYes(input.value); onNo()}} variant="filled" color="green">{t('yes')}</Button>
      </Group>
    </Modal>
  );
}

export default PopupAsk;
