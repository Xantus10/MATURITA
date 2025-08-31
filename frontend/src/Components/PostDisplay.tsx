import { Title as ManTitle, Text, Modal, Group, Stack, Paper, Code, Grid, Image } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { UserCache, type UserData } from "../Util/cache";
import { useTranslation } from "react-i18next";


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

function PostDisplay({_id, Title, CreatorId, CreatedAt, RemoveAt, Subjects, State, Years, Price, Photos}: PostData) {
  const [modalDisc, modalDiscController] = useDisclosure(false);

  const [creator, setCreator] = useState<UserData>({name: {first: '', last: ''}});
  _id;

  const { t } = useTranslation();

  useEffect(() => {
    UserCache.getUserData(CreatorId).then((val) => {
      if (val) {
        setCreator(val);
      }
    });
  }, [])

  return (
    <>
    <Paper onClick={modalDiscController.open} p="md">
      <Group gap='xl' >
        <ManTitle order={2}>{Title}</ManTitle>
        <Code>{State}</Code>
        <Text>{(Price.Min === Price.Max) ? Price.Min : `${Price.Min} - ${Price.Max}`} Kč</Text>
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
          {Photos.map((uri: string) => {return (<Image src={`/images/${uri}`} />);})}
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
