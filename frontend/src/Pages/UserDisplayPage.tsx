import { Title, Text, Stack, Group, Paper, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import BackToHomeButton from "../Components/Clickables/BackToHomeButton";
import LangSwitch from "../Components/Clickables/LangSwitch";
import Popup from "../Components/Overlays/Popup";
import { LogoutFunc } from "../Components/Clickables/Logout";
import { get, deletef } from "../Util/http";
import { autoHttpResponseNotification } from "../Util/notifications";

import classes from '../styles/default.module.css';

import { useTranslation } from 'react-i18next';

/**
 * Minified version of user data
 */
interface UserData {
  /**
   * The name recieved through Office365
   */
  Name: {
    /**
     * First name of the user
     */
    First: string;
    /**
     * Last name of the user
     */
    Last: string;
  };

  /**
   * Role assigned to the user
   */
  Role: 'user' | 'admin';
};

/**
 * Display information about the current user
 */
function UserDisplayPage() {
  async function getUserData() {
    let res = await get('/users/me');
    if (res) {
      autoHttpResponseNotification(res);
      if (res.status === 200) setUserData(await res.json());
    }
  }

  async function deleteAcc() {
    await deletef('/users/me');
    await LogoutFunc();
  }

  const { t } = useTranslation('userpages');

  const [userData, setUserData] = useState<UserData>({Name: {First: '', Last: ''}, Role: 'user'});

  const [deleteDisc, deleteDiscController] = useDisclosure(false);

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      <Stack className={classes.container} gap={"xl"}>
        <Group justify="space-between" className={classes.header}>
          <Title order={2} className={classes.title1}>{t('useracc.title')}</Title>
          <LangSwitch />
          <BackToHomeButton />
        </Group>
        <Paper p={"md"}>
          <Stack>
            <Text>{t('useracc.name')}: {userData.Name.First} {userData.Name.Last}</Text>
            <Text>{t('useracc.role')}: {userData.Role}</Text>
            <Button bg={'red'} rightSection={<FaTrashAlt />} onClick={deleteDiscController.open} size="md">{t('useracc.delete')}</Button>
          </Stack>
        </Paper>
      </Stack>
      <Popup line={t('useracc.deleteReassure')} open={deleteDisc} onNo={deleteDiscController.close} onYes={deleteAcc} />
    </>
  );
}

export default UserDisplayPage;
