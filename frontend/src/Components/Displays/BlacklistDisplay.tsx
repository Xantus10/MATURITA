import { Stack, Paper, Text, Code, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';

import classes from '../styles/default.module.css'

/**
 * Blacklisted MicrosoftId data
 */
export interface BlacklistData {
  /**
   * The MicrosoftId to be blacklisted
   */
  MicrosoftId: string;

  /**
   * When was the MicrosoftId blacklisted
   */
  CreatedAt: Date;

  /**
   * For what reason was the MicrosoftId blacklisted
   */
  Reason: string;
};

/**
 * A component to display a single Microsoft Id blacklist
 */
function BlacklistDisplay({CreatedAt, MicrosoftId, Reason}: BlacklistData) {
  const [dis, disController] = useDisclosure(false);
  const { t } = useTranslation();

  return (
    <>
      <Paper p={"lg"} onClick={disController.open} className={classes.outline}>
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
