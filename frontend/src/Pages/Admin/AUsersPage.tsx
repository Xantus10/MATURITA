import { Title, Button, Stack, Group, TextInput, NativeSelect, Menu } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import LangSwitch from '../../Components/LangSwitch';
import BackToHomeButton from '../../Components/BackToHomeButton';
import { get } from '../../Util/http';
import { autoHttpResponseNotification } from '../../Util/notifications';

import classes from '../styles/mypostspage.module.css'


export default function AHomePage() {
  

  const { t } = useTranslation('homepage');
  const navigate = useNavigate();


  const [users, setUsers] = useState<[]>([]);



  const filterForm = useForm({
    mode: 'uncontrolled',
    initialValues: {
    },
    validate: {
    }
  });

  return (
    <>
      <Stack className={classes.container}>
        <Group mih={'10vh'} bg={'gray.9'} p="md" justify="space-between">
          <Title order={1}>{}</Title>
          <LangSwitch />
          <BackToHomeButton />
        </Group>
        <Stack>
          <Group>
            FILTERS HERE
          </Group>
          <Stack>
            RENDER USERDISPLAY HERE
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}