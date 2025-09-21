import { Title as ManTitle, Group, Paper, Code, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FaTrashAlt } from "react-icons/fa";
import Popup from "./Popup";
import PopupAsk from "./PopupAsk";
import { useTranslation } from "react-i18next";
import { post, deletef } from "../Util/http";
import { autoHttpResponseNotification } from "../Util/notifications";


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

  const inverseRole = (Role==='admin') ? 'user' : 'admin';

  return (
    <>
    <Paper>
      <Group gap='xl' justify="space-between" p={"md"} >
        <ManTitle order={2}>{Name.First} {Name.Last}</ManTitle>
        <Code>{Role}</Code>
        <Button onClick={deleteUPDiscController.open} leftSection={<FaTrashAlt />}>{t('userDisplay.deletePosts')}</Button>
        <Button onClick={deleteDiscController.open} leftSection={<FaTrashAlt />}>{t('userDisplay.delete')}</Button>
        <Button onClick={() => {ChangeUserRole(inverseRole)}}>{t('userDisplay.make')} {inverseRole}</Button>
      </Group>
    </Paper>
    
    <Popup line={t('userDisplay.deletePostsReassure')} open={deleteUPDisc} onNo={deleteUPDiscController.close} onYes={DeleteUserPosts} />
    <Popup line={t('userDisplay.deleteReassure')} open={deleteDisc} onNo={deleteDiscController.close} onYes={DeleteUser} />
    </>
  );
}

export default UserDisplay;
