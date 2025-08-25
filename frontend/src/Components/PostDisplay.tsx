import { Title, Text, Modal, Group, Stack, Paper, Code, Grid } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

import LocalizedStrings from "react-localization";

let strings = new LocalizedStrings({
  cz: {
    state: 'Stav',
    subjects: 'Předměty',
    years: 'Ročníky',
    created: 'Vytvořeno',
    until: 'Platí do'
  },
  en: {
    state: 'State',
    subjects: 'Subjects',
    years: 'Years',
    created: 'Created',
    until: 'Valid until'
  }
});


function PostDisplay({id, title, creatorId, createdAt, removeAt, subjects, state, years, price}: {id: string, title: string, creatorId: string, createdAt: Date, removeAt: Date, subjects: string[], state: string, years: number[], price: {min: number, max: number}}) {
  const [modalDisc, modalDiscController] = useDisclosure(false);

  const [creator, setCreator] = useState({first: 'Fname', last: 'Lname'})

  return (
    <>
    <Paper onClick={modalDiscController.open} p="md">
      <Group gap='xl' >
        <Title order={2}>{title}</Title>
        <Code>{state}</Code>
        <Text>{(price.min === price.max) ? price.min : `${price.min} - ${price.max}`} Kč</Text>
      </Group>
    </Paper>
    
    <Modal opened={modalDisc} onClose={modalDiscController.close}>
      <Stack>
        <Group justify="space-between">
          <Title>{title}</Title>
          <Text>{(price.min === price.max) ? price.min : `${price.min} - ${price.max}`} Kč</Text>
        </Group>
        <Grid>
          <Grid.Col span={6}>{strings.state}</Grid.Col>
          <Grid.Col span={6}><Code>{state}</Code></Grid.Col>
          <Grid.Col span={6}>{strings.subjects}</Grid.Col>
          <Grid.Col span={6}>{subjects.map((sub) => {return <><Code>{sub}</Code>&nbsp;</>})}</Grid.Col>
          <Grid.Col span={6}>{strings.years}</Grid.Col>
          <Grid.Col span={6}>{years.map((sub) => {return <><Code>{sub}.</Code>&nbsp;</>})}</Grid.Col>
        </Grid>
        <Text size="xs">{strings.created}: {createdAt.toLocaleString()}</Text>
        <Text size="xs">{strings.until}: {removeAt.toLocaleString()}</Text>
        <Text ml="auto">{creator.first} {creator.last}</Text>
      </Stack>
    </Modal>
    </>
  );
}

export default PostDisplay;
