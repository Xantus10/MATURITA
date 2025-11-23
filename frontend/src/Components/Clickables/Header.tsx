import { Group, Title, Menu, Button } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdOutlineAccountCircle, MdOutlineSettings, MdOutlineLocalPostOffice } from "react-icons/md";

import LangSwitch from "./LangSwitch";
import Logout from "./Logout";
import BackToHomeButton from "./BackToHomeButton";
import ThemeSwitch from "./ThemeSwitch";

import classes from '../../styles/default.module.css';

/**
 * Props for Header component
 */
export interface HeaderProps {
  /**
   * Title of the page
   */
  title: string;

  /**
   * View of the user (affects dropdown menu)
   */
  view: 'user' | 'admin';
};

function Header({ title, view }: HeaderProps) {

  const { t } = useTranslation('homepage');
  const { pathname } = useLocation();
  const navigate = useNavigate();

  let menuComp = <BackToHomeButton />;

  if (pathname === "/") {
    if (view === 'admin') {
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
    } else {
      menuComp = <>
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
      </>;
    }
  }

  return (
    <>
      <Group mih={'10vh'} className={classes.header} justify="space-between">
          <Title order={1} className={classes.title1}>{title}</Title>
          <LangSwitch />
          <Group>
            <ThemeSwitch />
            {menuComp}
          </Group>
        </Group>
    </>
  );
}

export default Header;