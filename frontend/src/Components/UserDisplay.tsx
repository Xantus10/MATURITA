import { Title as ManTitle, Group, Paper, Code, Button, Menu, Tooltip, TextInput, NumberInput, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { FaTrashAlt, FaBan, FaExclamationTriangle } from "react-icons/fa";
import { MdOutlineAccountCircle, MdOutlineLocalPostOffice, MdHistory } from 'react-icons/md';
import Popup from "./Popup";
import PopupAsk from "./PopupAsk";
import { useTranslation } from "react-i18next";
import { post, deletef } from "../Util/http";
import { autoHttpResponseNotification } from "../Util/notifications";
import BanDisplay, { isBanned, labelBans, type BanData } from "./BanDisplay";
import { typedates } from "../Util/autotype";

import classes from '../styles/default.module.css'

/**
 * User data
 */
export interface UserData {
  /**
   * Id of the user
   */
  _id: string;

  /**
   * MicrosoftId of the associated Office365 account
   */
  MicrosoftId: string;

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

  /**
   * When was the last login of the user
   */
  LastLogin: Date;

  /**
   * Array of the users bans
   */
  Bans: BanData[];
};

/**
 * Props for UserDisplay
 */
export interface UserDisplayProps {
  /**
   * User data for the display
   */
  data: UserData;
};

/**
 * Display info about a user
 */
function UserDisplay({data}: UserDisplayProps) {
  const {_id, MicrosoftId, Name, Role, Bans} = data;
  const [deleteDisc, deleteDiscController] = useDisclosure(false);
  const [deleteUPDisc, deleteUPDiscController] = useDisclosure(false);
  const [banDisc, banDiscController] = useDisclosure(false);
  const [blackDisc, blackDiscController] = useDisclosure(false);
  const [banHistory, banHistoryController] = useDisclosure(false);
  const [changeRoleDisc, changeRoleDiscController] = useDisclosure(false);

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
  const [blackReason, setBlackReason] = useState("");

  async function BanUser({days, reason}: BanUserArg) {
    let res = await post('/users/ban', {userId: _id, days: days, reason: reason});
    if (res) autoHttpResponseNotification(res, true);
  }

  async function BlacklistUser(reason: string) {
    let res = await post('/blacklist', {microsoftId: MicrosoftId, reason: reason});
    if (res) autoHttpResponseNotification(res, true);
  }

  const inverseRole = (Role==='admin') ? 'user' : 'admin';
  const BansT = typedates(Bans);
  const userBanned = isBanned(BansT);
  const LabeledBans = labelBans(BansT);

  return (
    <>
    <Paper bd={(userBanned) ? 'solid 1px var(--mantine-color-red-7)' : ''} withBorder={userBanned} className={classes.outline}>
      <Group gap='xl' justify="space-between" p={"md"} >
        <ManTitle order={2}>{Name.First} {Name.Last} {(userBanned) ? `(${t('userDisplay.banned')})` : ''}</ManTitle>
        <Code>{Role}</Code>
        <Menu>
          <Menu.Target>
            <Button leftSection={<FaTrashAlt />} bg={"red.9"}>{t('userDisplay.delete')}</Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={deleteDiscController.open}>
              <Button leftSection={<MdOutlineAccountCircle />} bg={"red.9"}>{t('userDisplay.deleteAcc')}</Button>
            </Menu.Item>
            <Menu.Item onClick={deleteUPDiscController.open}>
              <Button leftSection={<MdOutlineLocalPostOffice />} bg={"red.9"}>{t('userDisplay.deletePosts')}</Button>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>

        <Menu>
          <Menu.Target>
            <Button leftSection={<FaBan />} bg={"red.9"} >
              {t('userDisplay.ban')}
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={banDiscController.open}>
              <Tooltip label={t('userDisplay.blacklistNotice')}>
                <Button leftSection={<FaBan />} bg={"red.9"} >
                  {t('userDisplay.ban')}
                </Button>
              </Tooltip>
            </Menu.Item>
            <Menu.Item onClick={banHistoryController.open}>
              <Button leftSection={<MdHistory />} >
                {t('userDisplay.banhistory')}
              </Button>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        

        <Button onClick={blackDiscController.open} leftSection={<FaExclamationTriangle />} bg={"red.9"}>
          {t('userDisplay.blacklist')}
        </Button>
        
        <Button onClick={changeRoleDiscController.open}>{t('userDisplay.make')} {inverseRole}</Button>
      </Group>
    </Paper>
    
    <Popup line={t('userDisplay.deletePostsReassure')} open={deleteUPDisc} onNo={deleteUPDiscController.close} onYes={DeleteUserPosts} />
    <Popup line={t('userDisplay.deleteReassure')} open={deleteDisc} onNo={deleteDiscController.close} onYes={DeleteUser} />
    <PopupAsk<BanUserArg> line={t('userDisplay.ban')} open={banDisc} onNo={banDiscController.close} onYes={BanUser} input={{element:
      (<>
        <NumberInput label={t('userDisplay.banDays')} value={banArg.days} onChange={(e) => {setBanArg({...banArg, days: ((typeof e === 'string') ? 0 : e)})}} />
        <TextInput label={t('userDisplay.banReason')} value={banArg.reason} onChange={(e) => {setBanArg({...banArg, reason: e.currentTarget.value})}} />
      </>)
    , value: banArg}} />
    <PopupAsk line={t('userDisplay.blacklist')} open={blackDisc} onNo={blackDiscController.close} onYes={BlacklistUser} input={{element: (<TextInput label={t('userDisplay.blacklistReason')} value={blackReason} onChange={(e) => {setBlackReason(e.currentTarget.value)}} />), value: blackReason}} />
    <Modal opened={banHistory} onClose={banHistoryController.close} title={t('userDisplay.banhistory')} >
      {LabeledBans.map((val) => {return (<BanDisplay {...val} />)})}
    </Modal>
    <Popup line={t('userDisplay.make') + ' ' + inverseRole} open={changeRoleDisc} onNo={changeRoleDiscController.close} onYes={() => ChangeUserRole(inverseRole)} />
    </>
  );
}

export default UserDisplay;
