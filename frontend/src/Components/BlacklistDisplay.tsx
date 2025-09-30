import { Stack, Paper, Text, Code, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';


export interface BlacklistData {
  CreatedAt: Date;
  MicrosoftId: string;
  Reason: string;
};


function BlacklistDisplay({CreatedAt, MicrosoftId, Reason}: BlacklistData) {
  const [dis, disController] = useDisclosure(false);
  const { t } = useTranslation();

  return (
    <>
      <Paper p={"lg"} onClick={disController.open}>
        <Text>{MicrosoftId}</Text>
      </Paper>

      <Modal opened={dis} onClose={disController.close} title={MicrosoftId}>
        <Stack gap={"md"}>
          <Text>{t('blackdisplay.at')} <Code>{CreatedAt.toLocaleString()}</Code></Text>
          <Text>{t('blackdisplay.reason')}: {Reason}</Text>
        </Stack>
      </Modal>
    </>
  );
}

export default BlacklistDisplay;
