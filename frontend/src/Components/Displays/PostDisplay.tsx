import { Title as ManTitle, Text, Modal, Group, Stack, Paper, Code, Table, Menu, Button, NumberInput, Box, Tooltip, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { useMsal } from "@azure/msal-react";
import { UserCache, type PublicUserData } from "../../Util/cache";
import ClickableImage from "../Clickables/ClickableImage";
import Popup from "../Overlays/Popup";
import PopupAsk from "../Overlays/PopupAsk";
import SocialsPopup from "../Overlays/SocialsPopup";
import { useTranslation } from "react-i18next";
import { post, deletef } from "../../Util/http";
import { autoHttpResponseNotification, showNotification } from "../../Util/notifications";

import classes from '../../styles/default.module.css'

/**
 * Data associated with each post
 */
export interface PostData {
  /**
   * Id of the post
   */
  _id: string;

  /**
   * User._id of the creator
   */
  CreatorId: string;

  /**
   * Title of the post
   */
  Title: string;

  /**
   * When was the post originally created
   */
  CreatedAt: Date;

  /**
   * When to remove the post
   */
  RemoveAt: Date;

  /**
   * Subject tags the post is associated with
   */
  Subjects: string[];

  /**
   * State of the book
   */
  State: 'Like new' | 'Good' | 'Worn';

  /**
   * Years the book is used in
   */
  Years: number[];

  /**
   * Price info for the book
   */
  Price: {
    /**
     * Lower end of the price spectrum
     */
    Min: number;
    /**
     * Higher end of the price spectrum (if is eq to lower end => the price is not a spectrum)
     */
    Max: number;
  };

  /**
   * Paths to associated photos
   */
  Photos: string[];

  /**
   * Additional info/messages/updates
   */
  AddInfo: string[];
};

/**
 * Quality of the book
 */
export const STATES = ['Like new', 'Good', 'Worn'];


/**
 * Lowest possible price
 */
export const PRICE_MIN = 0;

/**
 * Highest possible price
 */
export const PRICE_MAX = 1000;

/**
 * Props for PostDisplay
 */
export interface PostDisplayProps {
  /**
   * Data of the post
   */
  data: PostData;

  /**
   * View with possible enhanced functionalities  
   * normal - standard view  
   * edit - view for the Creator  
   * admin - view for admin
   */
  view: 'normal' | 'edit' | 'admin';

  /**
   * Function called when the post wants to remove itself from parent component
   */
  removeSelf: () => void;
};

/**
 * Display a single post
 */
function PostDisplay({data, view, removeSelf}: PostDisplayProps) {
  const [localData, setLocalData] = useState(data);
  const {_id, Title, CreatorId, CreatedAt, RemoveAt, Subjects, State, Years, Price, Photos} = localData;
  const [modalDisc, modalDiscController] = useDisclosure(false);
  const { instance, accounts } = useMsal();

  const [creator, setCreator] = useState<PublicUserData>();

  const { t } = useTranslation();

  async function teamsChat() {
    let reactres = await post('/messages/react', {target: data.CreatorId, post: data.Title});
    if (reactres?.status !== 201) return;
    let restoken;
    try {
      restoken = await instance.acquireTokenSilent({scopes: ['Chat.Create'], account: accounts[0]});
    } catch (e) {
      restoken = await instance.acquireTokenPopup({scopes: ['Chat.Create']});
    }
    if (!restoken) {
      showNotification({ title: "Graph token acquisition failed, contact administrator", message: "", icon: 'ERR' })
    }
    let res = await fetch('https://graph.microsoft.com/v1.0/chats', {
      method: 'POST',
      headers: {Authorization: `Bearer ${restoken.accessToken}`,
      "Content-Type": 'application/json'},
      body: JSON.stringify({chatType: 'oneOnOne', members: [{
          "@odata.type": "#microsoft.graph.aadUserConversationMember",
          "roles": ["owner"],
          "user@odata.bind": "https://graph.microsoft.com/v1.0/me"
        },
        {
          "@odata.type": "#microsoft.graph.aadUserConversationMember",
          "roles": ["owner"],
          "user@odata.bind": `https://graph.microsoft.com/v1.0/users('${creator?.MicrosoftId}')`
        }]})});
    let js = await res.json();
    window.open(`https://teams.microsoft.com/l/chat/${js.id}`, '_blank')
  }


  let menu = (<></>);

  if (view === 'edit') {
    const [deleteDisc, deleteDiscController] = useDisclosure(false);
    const [extendDisc, extendDiscController] = useDisclosure(false);
    const [msgDisc, msgDiscController] = useDisclosure(false);
    const [days, setDays] = useState(0);
    const [msg, setMsg] = useState("");

    async function ExtendPostLifespan(days: number) {
      let res = await post('/posts/extend', {postId: _id, days: days});
      if (res) {
        autoHttpResponseNotification(res, true);
        if (res.status === 200) {
          setLocalData((prevLocalData) => ({...prevLocalData, RemoveAt: new Date(prevLocalData.RemoveAt.getTime() + days*1000*86400)}))
        }
      }
    }

    async function DeletePost() {
      let res = await deletef('/posts', {postId: _id});
      if (res) {
        autoHttpResponseNotification(res, true);
        if (res.status === 200) {
          removeSelf();
        }
      }
    }

    async function AddInfo(msg: string) {
      let res = await post('/posts/addinfo', {postId: _id, msg: msg});
      if (res) {
        autoHttpResponseNotification(res, true);
        if (res.status === 201) {
          setLocalData((prevLocalData) => ({...prevLocalData, AddInfo: [...prevLocalData.AddInfo, msg]}));
        }
      }
    }

    menu = (
      <>
        <Menu>
          <Menu.Target>
            <Box p={"md"}>
              <BsThreeDots style={{cursor: 'pointer'}} />
            </Box>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={extendDiscController.open}>
              <Button fullWidth>{t('postdisplay.extendLifespan')}</Button>
            </Menu.Item>
            <Menu.Item onClick={msgDiscController.open}>
              <Button fullWidth>{t('postdisplay.addinfo')}</Button>
            </Menu.Item>
            <Menu.Item onClick={deleteDiscController.open}>
              <Button fullWidth color="red" leftSection={<FaTrashAlt />}>{t('postdisplay.delete')}</Button>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>

        <Popup line={t('postdisplay.deleteReassure')} open={deleteDisc} onNo={deleteDiscController.close} onYes={DeletePost} />
        <PopupAsk<number> open={extendDisc} onNo={extendDiscController.close} onYes={ExtendPostLifespan}
          input={{element: <NumberInput label={t('postdisplay.addDays')} max={30} min={1} value={days} onChange={(val) => {(typeof val === 'string') ? setDays(0) : setDays(val)}} />,
                  value: days}} />
        <PopupAsk<string> open={msgDisc} onNo={msgDiscController.close} onYes={AddInfo}
          input={{element: <TextInput label={t('postdisplay.addinfolong')} value={msg} onChange={(e) => setMsg(e.currentTarget.value)} />, value: msg}} />
      </>
    );
  } else if (view === 'admin') {
    const [deleteDisc, deleteDiscController] = useDisclosure(false);

    async function DeletePost() {
      let res = await deletef('/posts', {postId: _id});
      if (res) {
        autoHttpResponseNotification(res, true);
        if (res.status === 200) {
          removeSelf();
        }
      }
    }

    menu = (
      <>
        <Menu>
          <Menu.Target>
            <Box p={"md"}>
              <BsThreeDots style={{cursor: 'pointer'}} />
            </Box>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={deleteDiscController.open}>
              <Button fullWidth color="red" leftSection={<FaTrashAlt />}>{t('postdisplay.delete')}</Button>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>

        <Popup line={t('postdisplay.deleteReassure')} open={deleteDisc} onNo={deleteDiscController.close} onYes={DeletePost} />
        
      </>
    );
  }

  useEffect(() => {
    UserCache.getUserData(CreatorId).then((val) => {
      if (val) {
        setCreator(val);
      }
    });
  }, [])

  return (
    <>
    <Paper className={classes.outline}>
        <Group gap='xl' justify="space-between" >
          <Box onClick={modalDiscController.open} flex={5}>
            <Group gap='xl' justify="space-between" p={"md"} >
              <ManTitle order={2}>{Title}</ManTitle>
              <Code>{State}</Code>
              <Text>{(Price.Min === Price.Max) ? Price.Min : `${Price.Min} - ${Price.Max}`} Kč</Text>
            </Group>
          </Box>
          {menu}
        </Group>
    </Paper>
    
    <Modal opened={modalDisc} onClose={modalDiscController.close}>
      <Stack>
        <Group justify="space-between">
          <ManTitle order={2}>{Title}</ManTitle>
          <Text>{(Price.Min === Price.Max) ? Price.Min : `${Price.Min} - ${Price.Max}`} Kč</Text>
        </Group>
        <Table data={{
          body: [
            [t('postdisplay.State'), State],
            [t('postdisplay.Subjects'), Subjects.map((sub) => {return <><Code>{sub}</Code>&nbsp;</>})],
            [t('postdisplay.Years'), Years.map((sub) => {return <><Code>{sub}.</Code>&nbsp;</>})]
          ]
        }} />
        <Group>
          {Photos.map((uri: string) => {return (<ClickableImage mah={"200px"} fit="contain" src={`/images/${uri}`} />);})}
        </Group>
        <Text size="xs">{t('postdisplay.created')}: {CreatedAt.toLocaleString()}</Text>
        <Text size="xs">{t('postdisplay.until')}: {RemoveAt.toLocaleString()}</Text>
        <Group ml="auto">
          <Text>{creator?.Name.First} {creator?.Name.Last}</Text>
          <SocialsPopup contacts={creator?.Socials} />
        </Group>
        <Tooltip label={t('postdisplay.reacttooltip')}>
          <Button ml="auto" onClick={teamsChat}>{t('postdisplay.react')}</Button>
        </Tooltip>
      </Stack>
    </Modal>
    </>
  );
}

export default PostDisplay;
