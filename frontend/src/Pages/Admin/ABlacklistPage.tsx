import { Title, Stack, Group } from '@mantine/core';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import LangSwitch from '../../Components/LangSwitch';
import BackToHomeButton from '../../Components/BackToHomeButton';
import { get } from '../../Util/http';
import { autoHttpResponseNotification } from '../../Util/notifications';
import BlacklistDisplay, { type BlacklistData } from '../../Components/BlacklistDisplay';

import classes from '../../styles/mypostspage.module.css'

/**
 * Admin page for blacklisting Microsoft Ids
 */
export default function ABlacklistPage() {
  async function getBlacklists() {
    let res = await get('/blacklist');
    if (res) {
      autoHttpResponseNotification(res);
      if (res.status === 200) setBlacklists((await res.json()).blists);
    }
  }

  const { t } = useTranslation('admin');

  const [blacklists, setBlacklists] = useState<BlacklistData[]>([]);

  useEffect(() => {
    getBlacklists();
  }, [])

  return (
    <>
      <Stack className={classes.container}>
        <Group mih={'10vh'} bg={'gray.9'} p="md" justify="space-between">
          <Title order={1}>{t('userDisplay.blacklist')}</Title>
          <LangSwitch />
          <BackToHomeButton />
        </Group>
        <Stack bg={'gray.8'} p={"md"}>
          {blacklists.map((v) => {return (
            <BlacklistDisplay {...v} />
          )})}
        </Stack>
      </Stack>
    </>
  );
}