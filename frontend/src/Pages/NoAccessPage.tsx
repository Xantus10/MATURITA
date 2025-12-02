import { Center, Text, Title, Stack } from '@mantine/core'

import { useTranslation } from 'react-i18next';
import LangSwitch from '../Components/Clickables/LangSwitch';

import classes from '../styles/default.module.css';


/**
 * NoAccess page props
 */
export interface NoAccessPageProps {
  /**
   * Reason for denied access
   * 
   * If *null* then invalid microsoft login is assumed
   */
  reason: string | null;

  /**
   * Until when does the ban last
   * 
   * If *null* the user is permanently blacklisted
   */
  until: Date | null;
};

function NoAccessPage({reason, until}: NoAccessPageProps) {
  const { t } = useTranslation('loginpage');

  let cont = <></>;

  if (!reason) {
    cont = (<>
      <Title order={2} className={classes.title1}>{t('noAccess.msid')}</Title>
    </>);
  } else {
    if (!until) {
      cont = (<>
        <Title order={2} className={classes.title1}>{t('noAccess.blacklisted')}</Title>
        <Text>{t('noAccess.for')} {reason}</Text>
        <Text size='xs'>{t('noAccess.blacklistnotice')}</Text>
      </>);
    } else {
      cont = (<>
        <Title order={2} className={classes.title1}>{t('noAccess.banned')}</Title>
        <Text>{t('noAccess.for')} {reason}</Text>
        <Text>{t('noAccess.until')} {until.toLocaleString()}</Text>
      </>);
    }
  }

  return (
    <Stack className={classes.container}>
      <LangSwitch />
      <Center p={"md"} h={"100%"} flex={1}>
          <Stack>
            {cont}
          </Stack>
      </Center>
    </Stack>
  );
}

export default NoAccessPage;