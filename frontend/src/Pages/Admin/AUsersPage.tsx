import { Title, Stack, Group, TextInput, NativeSelect } from '@mantine/core';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import UserDisplay, { type UserData } from '../../Components/UserDisplay';
import LangSwitch from '../../Components/LangSwitch';
import BackToHomeButton from '../../Components/BackToHomeButton';
import { get } from '../../Util/http';
import { autoHttpResponseNotification } from '../../Util/notifications';

import classes from '../styles/mypostspage.module.css'


export default function AUsersPage() {
  async function getUserList(afirst: string, alast: string, alimit: number) {
    let res = await get('/users/list', {first: afirst, last: alast, limit: alimit});
    if (res) {
      autoHttpResponseNotification(res);
      setUsers((await res.json()).users);
    }
  }

  const { t } = useTranslation('admin');

  const [users, setUsers] = useState<UserData[]>([]);

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [limit, setLimit] = useState('20');

  useEffect(() => {
    getUserList(first, last, parseInt(limit));
  }, [first, last, limit])

  return (
    <>
      <Stack className={classes.container}>
        <Group mih={'10vh'} bg={'gray.9'} p="md" justify="space-between">
          <Title order={1}>{t('userPage.title')}</Title>
          <LangSwitch />
          <BackToHomeButton />
        </Group>
        <Stack  bg={'gray.9'} p="md">
          <Group gap={"xl"}>
            <TextInput label={t('userPage.first')} value={first} onChange={(e) => {setFirst(e.currentTarget.value)}} />
            <TextInput label={t('userPage.last')} value={last} onChange={(e) => {setLast(e.currentTarget.value)}} />
            <NativeSelect label={t('userPage.display')} value={limit} data={['10', '20', '50']} onChange={(e) => {setLimit(e.currentTarget.value)}} />
          </Group>
          <Stack>
            {users.map((v) => <UserDisplay data={v} />)}
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}