import { Title as ManTitle, Group, Paper, Code, Button, Menu, Tooltip, TextInput, NumberInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FaTrashAlt, FaBan } from "react-icons/fa";
import { MdOutlineAccountCircle, MdOutlineLocalPostOffice } from 'react-icons/md';
import Popup from "./Popup";
import PopupAsk from "./PopupAsk";
import { useTranslation } from "react-i18next";
import { post, deletef } from "../Util/http";
import { autoHttpResponseNotification } from "../Util/notifications";
import { useState } from "react";


export interface BanData {
  CreatedAt: Date;
  Until: Date;
  IssuedBy: string;
  Reason: string;
}

export interface UserData {
  _id: string;
  MicrosoftId: string;
  Name: {
    First: string;
    Last: string;
  };
  Role: 'user' | 'admin';
  LastLogin: Date;
  Bans: BanData[];
};

export interface UserDisplayProps {
  data: UserData;
};

function UserDisplay({data}: UserDisplayProps) {
  const {_id, MicrosoftId, Name, Role, Bans} = data;
  const [deleteDisc, deleteDiscController] = useDisclosure(false);
  const [deleteUPDisc, deleteUPDiscController] = useDisclosure(false);
  const [banDisc, banDiscController] = useDisclosure(false);

  const { t } = useTranslation('admin');

  async function DeleteUser() {
    let res = await deletef(`/users/${_id}`);
    if (res) autoHttpResponseNotification(res, true);
  }

  async function DeleteUserPosts() {
    let res = await deletef('/posts/user', {userId: _id});
    if (res) autoHttpResponseNotification(res, true);
  }

  async function ChangeUserRole(role: 'admin' | 'user') {
    let res = await post('/users/role', {userId: _id, role: role});
    if (res) autoHttpResponseNotification(res, true);
  }

  interface BanUserArg {
    days: number;
    reason: string;
  }

  const [banArg, setBanArg] = useState<BanUserArg>({days: 0, reason: ''});

  async function BanUser({days, reason}: BanUserArg) {
    days
  }

  const inverseRole = (Role==='admin') ? 'user' : 'admin';

  return (
    <>
    <Paper>
      <Group gap='xl' justify="space-between" p={"md"} >
        <ManTitle order={2}>{Name.First} {Name.Last}</ManTitle>
        <Code>{Role}</Code>
        <Menu>
          <Menu.Target>
            <Button leftSection={<FaTrashAlt />} bg={"red.9"}>{t('userDisplay.delete')}</Button>
          </Menu.Target>
          <Menu.Item onClick={deleteDiscController.open}>
            <Button leftSection={<MdOutlineAccountCircle />} bg={"red.9"}>{t('userDisplay.deleteAcc')}</Button>
          </Menu.Item>
          <Menu.Item onClick={deleteUPDiscController.open}>
            <Button leftSection={<MdOutlineLocalPostOffice />} bg={"red.9"}>{t('userDisplay.deletePosts')}</Button>
          </Menu.Item>
        </Menu>

        <Tooltip label={t('userDisplay.blacklistNotice')}>
          <Button onClick={banDiscController.open} leftSection={<FaBan />} bg={"red.9"} >
            {t('userDisplay.ban')}
          </Button>
        </Tooltip>
        
        <Button onClick={() => {ChangeUserRole(inverseRole)}}>{t('userDisplay.make')} {inverseRole}</Button>
      </Group>
    </Paper>
    
    <Popup line={t('userDisplay.deletePostsReassure')} open={deleteUPDisc} onNo={deleteUPDiscController.close} onYes={DeleteUserPosts} />
    <Popup line={t('userDisplay.deleteReassure')} open={deleteDisc} onNo={deleteDiscController.close} onYes={DeleteUser} />
    <PopupAsk<BanUserArg> line={t('userDisplay.ban')} open={banDisc} onNo={banDiscController.close} onYes={BanUser} input={{element:
      (<>
        <NumberInput title={t('userDisplay.banDays')} value={banArg.days} onChange={(e) => {setBanArg({...banArg, days: ((typeof e === 'string') ? 0 : e)})}} />
        <TextInput title={t('userDisplay.banReason')} value={banArg.reason} onChange={(e) => {setBanArg({...banArg, reason: e.currentTarget.value})}} />
      </>)
    , value: banArg}} />
    </>
  );
}

export default UserDisplay;
