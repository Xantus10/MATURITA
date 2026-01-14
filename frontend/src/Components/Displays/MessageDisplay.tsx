import { Paper, Text, Button, Group } from '@mantine/core';

import { useTranslation } from 'react-i18next';

import classes from '../../styles/default.module.css'


/**
 * Subject data
 */
export interface MessageData {
  /**
   * Id of the subject
   */
  _id: string;

  /**
   * Sender of the message
   */
  Sender: string;
  
  /**
   * User that should recieve the message
   */
  TargetUser?: string;

  /**
   * Group that should recieve the message
   */
  TargetGroup?: 'admin' | 'all';

  /**
   * When was the message sent
   */
  SentAt: Date;

  /**
   * Title of the message
   */
  Title: string;

  /**
   * Content of the message
   */
  Content: string;
};

/**
 * Props for the SubjectDisplay component
 */
export interface MessageDisplayProps {
  /**
   * Data from db
   */
  data: MessageData;
};

function MessageDisplay({data}: MessageDisplayProps) {
  const { t } = useTranslation('components');

  return (
    <>
      <Paper p={"lg"} className={classes.outline}>
        <Group justify='space-between'>
          
        </Group>
      </Paper>
    </>
  );
}

export default MessageDisplay;
