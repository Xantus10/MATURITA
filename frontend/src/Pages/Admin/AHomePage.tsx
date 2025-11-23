import { Stack, Group } from '@mantine/core'
import { useTranslation } from 'react-i18next';

import Header from '../../Components/Clickables/Header';
import useMultiPostDisplay from '../../Components/Displays/MutiPostDisplay';

import classes from '../styles/homepage.module.css';
import defclasses from '../styles/default.module.css';

/**
 * Admin homepage
 */
export default function AHomePage() {
  const { t } = useTranslation('homepage');

  const { FilterForm, MultiPostDisplay } = useMultiPostDisplay({className: classes.filters}, {className: classes.main}, 'admin');


  return (
    <>
      <Stack className={defclasses.container}>
        <Header title={t('admin.title')} view="admin" />
        <Group className={classes.divider} preventGrowOverflow={false} align='start'>
          {FilterForm}
          {MultiPostDisplay}
        </Group>
      </Stack>
    </>
  );
}