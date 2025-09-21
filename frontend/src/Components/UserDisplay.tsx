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

function PostDisplay({data}: UserDisplayProps) {
  const {_id, MicrosoftId, Name, Role, LastLogin, Bans} = data;
  const [deleteDisc, deleteDiscController] = useDisclosure(false);
  const [deleteUPDisc, deleteUPDiscController] = useDisclosure(false);

  const { t } = useTranslation();

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
        <Button onClick={deleteUPDiscController.open} leftSection={<FaTrashAlt />}>DELETE User posts</Button>
        <Button onClick={deleteDiscController.open} leftSection={<FaTrashAlt />}>DELETE</Button>
        <Button onClick={() => {ChangeUserRole(inverseRole)}}>Make {inverseRole}</Button>
      </Group>
    </Paper>
    
    <Popup line="Do you really want to delete user posts" open={deleteUPDisc} onNo={deleteUPDiscController.close} onYes={DeleteUserPosts} />
    <Popup line="Do you really want to delete" open={deleteDisc} onNo={deleteDiscController.close} onYes={DeleteUser} />
    </>
  );
}

export default PostDisplay;
