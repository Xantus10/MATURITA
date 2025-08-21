import { useMsal } from '@azure/msal-react'

import { Center, Text, Title, Button, Stack } from '@mantine/core'
import classes from '../styles/loginpage.module.css'

import LocalizedStrings from 'react-localization'

let strings = new LocalizedStrings({
  cz: {
    welcome: 'Vítejte na trhu pro použité učebnice',
    log_in: 'Pro pokračování se přihlašte vaším školním účtem',
  },
  en: {
    welcome: 'Welcome to the market for used books',
    log_in: 'To continue, log in with your school account',
  }
})

export default function LoginPage() {
  const {instance} = useMsal();
  
  return (
    <>
      <Center className={classes.container} bg={'dark.8'}>
        <Stack>
          <Title order={2}>{strings.welcome}</Title>
          <Text>{strings.log_in}</Text>
          <Button onClick={() => {instance.loginRedirect();}} w='200px'>Log in</Button>
        </Stack>
      </Center>
    </>
  );
}
