import { Title as ManTitle, Text, Modal, Group, Stack, Paper, Code, Grid, Menu, Button, NumberInput, Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { UserCache, type UserData } from "../Util/cache";
import ClickableImage from "./ClickableImage";
import Popup from "./Popup";
import PopupAsk from "./PopupAsk";
import { useTranslation } from "react-i18next";
import { post, deletef } from "../Util/http";
import { autoHttpResponseNotification } from "../Util/notifications";


export interface PostData {
  _id: string;
  Title: string;
  CreatorId: string;
  CreatedAt: Date;
  RemoveAt: Date;
  Subjects: string[];
  State: string;
  Years: number[];
  Price: {
    Min: number;
    Max: number;
  };
  Photos: string[];
};

export interface PostDisplayProps {
  data: PostData;
  view: 'normal' | 'edit' | 'admin';
};

function PostDisplay({data, view}: PostDisplayProps) {
  const {_id, Title, CreatorId, CreatedAt, RemoveAt, Subjects, State, Years, Price, Photos} = data;
  const [modalDisc, modalDiscController] = useDisclosure(false);

  const [creator, setCreator] = useState<UserData>({name: {first: '', last: ''}});

  const { t } = useTranslation();


  let menu = (<></>);

  if (view === 'edit') {
    const [deleteDisc, deleteDiscController] = useDisclosure(false);
    const [extendDisc, extendDiscController] = useDisclosure(false);
    const [days, setDays] = useState(0);

    async function ExtendPostLifespan(days: number) {
      let res = await post('/posts/extend', {postId: _id, days: days});
      if (res) autoHttpResponseNotification(res, true);
    }

    async function DeletePost() {
      let res = await deletef('/posts', {postId: _id});
      if (res) autoHttpResponseNotification(res, true);
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
              <Button fullWidth>Extend lifespan</Button>
            </Menu.Item>
            <Menu.Item onClick={deleteDiscController.open}>
              <Button fullWidth color="red" leftSection={<FaTrashAlt />}>Delete post</Button>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>

        <Popup line={t('postdisplay.deleteReassure')} open={deleteDisc} onNo={deleteDiscController.close} onYes={DeletePost} />
        <PopupAsk<number> open={extendDisc} onNo={extendDiscController.close} onYes={ExtendPostLifespan}
          input={{element: <NumberInput label={t('postdisplay.addDays')} max={30} min={1} value={days} onChange={(val) => {(typeof val === 'string') ? setDays(0) : setDays(val)}} />,
                  value: days}} />
      </>
    );
  } else if (view === 'admin') {
    ; // Future implementation
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
    <Paper>
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
        <Grid>
          <Grid.Col span={6}>{t('postdisplay.State')}</Grid.Col>
          <Grid.Col span={6}><Code>{State}</Code></Grid.Col>
          <Grid.Col span={6}>{t('postdisplay.Subjects')}</Grid.Col>
          <Grid.Col span={6}>{Subjects.map((sub) => {return <><Code>{sub}</Code>&nbsp;</>})}</Grid.Col>
          <Grid.Col span={6}>{t('postdisplay.Years')}</Grid.Col>
          <Grid.Col span={6}>{Years.map((sub) => {return <><Code>{sub}.</Code>&nbsp;</>})}</Grid.Col>
        </Grid>
        <Group>
          {Photos.map((uri: string) => {return (<ClickableImage mah={"200px"} fit="contain" src={`/images/${uri}`} />);})}
        </Group>
        <Text size="xs">{t('postdisplay.created')}: {CreatedAt.toLocaleString()}</Text>
        <Text size="xs">{t('postdisplay.until')}: {RemoveAt.toLocaleString()}</Text>
        <Text ml="auto">{creator.name.first} {creator.name.last}</Text>
      </Stack>
    </Modal>
    </>
  );
}

export default PostDisplay;
