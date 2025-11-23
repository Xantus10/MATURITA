import { Stack, Group } from '@mantine/core'
import { useTranslation } from 'react-i18next';

import Header from '../Components/Clickables/Header';
import useMultiPostDisplay from '../Components/Displays/MutiPostDisplay';
import AddPost from '../Components/Overlays/AddPost';

import classes from '../styles/homepage.module.css';
import defclasses from '../styles/default.module.css';


/**
 * Home page
 */
export default function HomePage() {
  const { t } = useTranslation('homepage');

  const { FilterForm, MultiPostDisplay, Subjects } = useMultiPostDisplay({className: classes.filters}, {className: classes.main}, 'normal');

  return (
    <>
      <Stack className={defclasses.container}>
        <Header title={t('title1')} view='user' />
        <Group className={classes.divider} preventGrowOverflow={false} align='start'>
          {FilterForm}
          {MultiPostDisplay}
          <Stack className={classes.new} justify="end" align='center'>
            <AddPost subjects={Subjects} />
          </Stack>
        </Group>
      </Stack>
    </>
  );
}