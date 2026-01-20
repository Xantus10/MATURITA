import { useMsal } from '@azure/msal-react'

import { Center, Text, Title, Button, Stack } from '@mantine/core'
import classes from '../styles/default.module.css';

import { useTranslation } from 'react-i18next';
import LangSwitch from '../Components/Clickables/LangSwitch';

/**
 * Login page
 */
export default function LoginPage() {
  const { t } = useTranslation('loginpage');
  const {instance} = useMsal();
  
  return (
    <>
    <Stack className={classes.container}>
      <LangSwitch />
      <Center p={"md"} h={"100%"} flex={1}>
          <Stack>
            <Title order={2} className={classes.title1}>{t('welcome')}</Title>
            <Text>{t('log_in')}</Text>
            <Button onClick={() => {instance.loginRedirect();}} w='200px'>{t('btn')}</Button>
          </Stack>
      </Center>
    </Stack>
    </>
  );
}
