import { useMsal } from '@azure/msal-react'

import { Center, Text, Title, Button, Stack } from '@mantine/core'
import classes from '../styles/loginpage.module.css'

import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const { t } = useTranslation('loginpage');
  const {instance} = useMsal();
  
  return (
    <>
      <Center className={classes.container} bg={'dark.8'}>
        <Stack>
          <Title order={2}>{t('welcome')}</Title>
          <Text>{t('log_in')}</Text>
          <Button onClick={() => {instance.loginRedirect();}} w='200px'>Log in</Button>
        </Stack>
      </Center>
    </>
  );
}
