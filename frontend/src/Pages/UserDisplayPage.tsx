import { Text, Stack, Paper, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import Header from "../Components/Clickables/Header";
import Popup from "../Components/Overlays/Popup";
import { LogoutFunc } from "../Components/Clickables/Logout";
import { get, deletef } from "../Util/http";
import { autoHttpResponseNotification } from "../Util/notifications";
import type { PublicUserData } from "../Util/cache";

import classes from '../styles/default.module.css';

import { useTranslation } from 'react-i18next';


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

  const [userData, setUserData] = useState<PublicUserData>();

  const [deleteDisc, deleteDiscController] = useDisclosure(false);

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      <Stack className={classes.container} gap={"xl"}>
        <Header title={t('useracc.title')} view="user" />
        <Paper p={"md"}>
          <Stack>
            <Text>{t('useracc.name')}: {userData?.Name.First} {userData?.Name.Last}</Text>
            <Text>{t('useracc.role')}: {userData?.Role}</Text>
            <Button bg={'red'} rightSection={<FaTrashAlt />} onClick={deleteDiscController.open} size="md">{t('useracc.delete')}</Button>
          </Stack>
        </Paper>
      </Stack>
      <Popup line={t('useracc.deleteReassure')} open={deleteDisc} onNo={deleteDiscController.close} onYes={deleteAcc} />
    </>
  );
}

export default UserDisplayPage;
