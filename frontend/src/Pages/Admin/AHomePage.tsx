import { Title, Button, Stack, Group, Menu } from '@mantine/core'
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Logout from '../../Components/Clickables/Logout';
import LangSwitch from '../../Components/Clickables/LangSwitch';
import useMultiPostDisplay from '../../Components/Displays/MutiPostDisplay';

import classes from '../styles/homepage.module.css';
import defclasses from '../styles/default.module.css';

/**
 * Admin homepage
 */
export default function AHomePage() {
  const { t } = useTranslation('homepage');
  const navigate = useNavigate();

  const { FilterForm, MultiPostDisplay } = useMultiPostDisplay({className: classes.filters}, {className: classes.main}, 'admin');


  return (
    <>
      <Stack className={defclasses.container}>
        <Group mih={'10vh'} className={defclasses.header} justify="space-between">
          <Title order={1} className={defclasses.title1}>{t('admin.title')}</Title>
          <LangSwitch />
          <Menu position="bottom-end">
            <Menu.Target>
              <Button w="110px" h="40px">{t('admin.manage')}</Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => {navigate('/users')}}>
                <Button fullWidth>{t('admin.users')}</Button>
              </Menu.Item>
              <Menu.Item onClick={() => {navigate('/blacklists')}}>
                <Button fullWidth>{t('admin.blacklist')}</Button>
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
        </Group>
      </Stack>
    </>
  );
}