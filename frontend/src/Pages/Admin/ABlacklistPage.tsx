import { Stack } from '@mantine/core';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Header from '../../Components/Clickables/Header';
import { get } from '../../Util/http';
import { autoHttpResponseNotification } from '../../Util/notifications';
import BlacklistDisplay, { type BlacklistData } from '../../Components/Displays/BlacklistDisplay';
import { typedates } from '../../Util/autotype';

import classes from '../../styles/default.module.css';

/**
 * Admin page for blacklisting Microsoft Ids
 */
export default function ABlacklistPage() {
  async function getBlacklists() {
    let res = await get('/blacklist');
    if (res) {
      autoHttpResponseNotification(res);
      if (res.status === 200) setBlacklists(typedates((await res.json()).blists, ['CreatedAt']));
    }
  }

  const { t } = useTranslation();

  const [blacklists, setBlacklists] = useState<BlacklistData[]>([]);

  useEffect(() => {
    getBlacklists();
  }, [])

  return (
    <>
      <Stack className={classes.container}>
        <Header title={t('userDisplay.blacklist')} view="admin" />
        <Stack p={"md"}>
          {blacklists.map((v) => {return (
            <BlacklistDisplay {...v} />
          )})}
        </Stack>
      </Stack>
    </>
  );
}