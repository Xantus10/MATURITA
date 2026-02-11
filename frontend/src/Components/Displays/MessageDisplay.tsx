import { Paper, Text } from '@mantine/core';
import { useState, useEffect } from 'react';
import { UserCache, type PublicUserData } from '../../Util/cache';

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

export const GROUPS = ['admin', 'all'];

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
  const [sender, setSender] = useState<PublicUserData | null>(null);

  async function getSender() {
    setSender(await UserCache.getUserData(data.Sender));
  }

  useEffect(() => {
    getSender()
  }, [])

  let tit = data.Title;
  let con = data.Content;

  if (tit.startsWith("CODE:")) {
    if (tit.endsWith("REACT")) {
      tit = t('messagedisplay.c:react.title')
      let [ fn, ln, post ] = con.split('§');
      con = t('messagedisplay.c:react.content', {fn: fn, ln: ln, post: post});
    }
  }

  return (
    <>
      <Paper p={"lg"} className={classes.outline} maw={"500px"}>
        <Text size='sm'>{t('messagedisplay.from')}: {`${sender?.Name.First} ${sender?.Name.Last}`}</Text>
        <Text size='sm'>{t('messagedisplay.to')}: {(data.TargetUser) ? t('messagedisplay.you') : t('messagedisplay.group', {group: data.TargetGroup})}</Text>
        <Text fw={700}>{tit}</Text>
        <Text style={{whiteSpace: 'pre-line'}}>{con}</Text>
        <Text size='xs'>{new Date(data.SentAt).toLocaleString()}</Text>
      </Paper>
    </>
  );
}

export default MessageDisplay;
