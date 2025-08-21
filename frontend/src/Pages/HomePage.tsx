import { Center, Text, Title, Button, Stack, Group } from '@mantine/core'
import classes from '../styles/homepage.module.css'

import LocalizedStrings from 'react-localization'

let strings = new LocalizedStrings({
  cz: {
    
  },
  en: {
    
  }
})
strings;

export default function HomePage() {
  
  return (
    <>
      <Stack className={classes.container}>
        <Group h={'10vh'} bg={'blue'}>Header</Group>
        <Group className={classes.divider} preventGrowOverflow={false}>
          <Stack className={classes.filters} bg={'green'}>Filters</Stack>
          <Stack className={classes.main} bg={'red'}>
            <Group>Order</Group>
            <Stack>
              POSTS
            </Stack>
          </Stack>
          <Center className={classes.new} bg={'cyan'}>
            AddBtn
          </Center>
        </Group>
      </Stack>
    </>
  );
}