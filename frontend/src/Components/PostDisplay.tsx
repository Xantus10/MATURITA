import { Title as ManTitle, Text, Modal, Group, Stack, Paper, Code, Grid } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

import LocalizedStrings from "react-localization";

let strings = new LocalizedStrings({
  cz: {
    State: 'Stav',
    Subjects: 'Předměty',
    Years: 'Ročníky',
    created: 'Vytvořeno',
    until: 'Platí do'
  },
  en: {
    State: 'State',
    Subjects: 'Subjects',
    Years: 'Years',
    created: 'Created',
    until: 'Valid until'
  }
});

export interface PostData { /////////////////////////////////////// I think the names are lost steven (we returnin the raw response from mongodb)
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
};

function PostDisplay({_id, Title, CreatorId, CreatedAt, RemoveAt, Subjects, State, Years, Price}: PostData) {
  const [modalDisc, modalDiscController] = useDisclosure(false);

  const [creator, setCreator] = useState({first: 'Fname', last: 'Lname'});
  _id;CreatorId;setCreator;

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
          <Grid.Col span={6}>{strings.State}</Grid.Col>
          <Grid.Col span={6}><Code>{State}</Code></Grid.Col>
          <Grid.Col span={6}>{strings.Subjects}</Grid.Col>
          <Grid.Col span={6}>{Subjects.map((sub) => {return <><Code>{sub}</Code>&nbsp;</>})}</Grid.Col>
          <Grid.Col span={6}>{strings.Years}</Grid.Col>
          <Grid.Col span={6}>{Years.map((sub) => {return <><Code>{sub}.</Code>&nbsp;</>})}</Grid.Col>
        </Grid>
        <Text size="xs">{strings.created}: {CreatedAt.toLocaleString()}</Text>
        <Text size="xs">{strings.until}: {RemoveAt.toLocaleString()}</Text>
        <Text ml="auto">{creator.first} {creator.last}</Text>
      </Stack>
    </Modal>
    </>
  );
}

export default PostDisplay;
