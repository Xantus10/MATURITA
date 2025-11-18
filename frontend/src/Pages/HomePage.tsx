import { Title, Button, Stack, Group, Menu } from '@mantine/core'
import { useNavigate } from 'react-router-dom';
import { MdOutlineAccountCircle, MdOutlineSettings, MdOutlineLocalPostOffice } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

import Logout from '../Components/Clickables/Logout';
import LangSwitch from '../Components/Clickables/LangSwitch';
import useMultiPostDisplay from '../Components/Displays/MutiPostDisplay';
import AddPost from '../Components/Overlays/AddPost';

import classes from '../styles/homepage.module.css';
import defclasses from '../styles/default.module.css';


/**
 * Home page
 */
export default function HomePage() {
  const { t } = useTranslation('homepage');
  const navigate = useNavigate();

  const { FilterForm, MultiPostDisplay, Subjects } = useMultiPostDisplay({className: classes.filters}, {className: classes.main});

  return (
    <>
      <Stack className={defclasses.container}>
        <Group mih={'10vh'} className={defclasses.header} justify="space-between">
          <Title order={1} className={defclasses.title1}>{t('title1')}</Title>
          <LangSwitch />
          <Menu position="bottom-end">
            <Menu.Target>
              <Button w="110px" h="40px"><MdOutlineAccountCircle size="2rem" /></Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => {navigate('/my-account')}}>
                <Button fullWidth leftSection={<MdOutlineSettings />}>{t('myacc')}</Button>
              </Menu.Item>
              <Menu.Item onClick={() => {navigate('/my-posts')}}>
                <Button fullWidth leftSection={<MdOutlineLocalPostOffice />}>{t('mypost')}</Button>
              </Menu.Item>
              <Menu.Item>
                <Logout />
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
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