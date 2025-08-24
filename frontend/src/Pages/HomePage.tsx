import { Center, Text, Title, Button, Stack, Group, Drawer, TextInput, NumberInput, NativeSelect, MultiSelect, Checkbox } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import LocalizedStrings from 'react-localization'

import { get, post } from '../Util/http';

import classes from '../styles/homepage.module.css'

const PRICE_MIN = 0;
const PRICE_MAX = 1000;

let strings = new LocalizedStrings({
  cz: {
    form_err_title: 'Vložte titulek',
    form_err_remove: 'Doba trvání musí být alespoň 1 den',
    form_err_subjects: 'Alespoň 1 předmět',
    form_err_state: 'Vložte platný stav',
    form_err_years: 'Alespoň 1 ročník',
    form_err_price: `Cena musí být v rozsahu ${PRICE_MIN}..${PRICE_MAX}`,
    form_title_title: 'Titulek',
    form_title_remove: 'Doba trvání',
    form_title_subjects: 'Předmět/y',
    form_title_state: 'Stav učebnice',
    form_title_years: 'Ročník/y',
    form_title_price: 'Cena',
    checkbox: 'Použít rozsah místo pevné ceny',
  },
  en: {
    form_err_title: 'Enter title',
    form_err_remove: 'Duration must be at least 1 day',
    form_err_subjects: 'Enter at least 1 subject',
    form_err_state: 'Enter a valid state!',
    form_err_years: 'Enter at least 1 year',
    form_err_price: `Price must be in range ${PRICE_MIN}..${PRICE_MAX}`,
    form_title_title: 'Title',
    form_title_remove: 'Duration',
    form_title_subjects: 'Subject/s',
    form_title_state: 'Book condition',
    form_title_years: 'Year/s',
    form_title_price: 'Price',
    checkbox: 'Use price range instead of price',
  }
})
strings;


export default function HomePage() {
  
  async function createPost() {
    let values = postForm.getValues()
    if (values.priceMax < values.priceMin) values.priceMax = values.priceMin;
    let res = await post('/posts', values);
    console.log(res?.status);
  }

  const [addbtn, addbtncontroller] = useDisclosure(false);
  const [priceRange, setPriceRange] = useState(false);

  const STATES = ['Like new', 'Good', 'Worn'];

  const [subjects, setSubjects] = useState(['CJK', 'ANJ', 'PSI']); // WILL NEED TO CHANGE ONCE Subjects are implemented on BE

  const postForm = useForm({
    mode: 'uncontrolled',
    initialValues: {
      title: '',
      remove: 14,
      subjects: [],
      state: '',
      years: [],
      priceMin: 0,
      priceMax: 0
    },
    validate: {
      title: (v) => ( (v.length > 0) ? null : strings.form_err_title ),
      remove: (v) => ( (v > 0) ? null : strings.form_err_remove ),
      subjects: (v) => ( (v.length > 0) ? null : strings.form_err_subjects ),
      state: (v) => ( (v in STATES) ? null : strings.form_err_state ),
      years: (v) => ( (v.length > 0) ? null : strings.form_err_years ),
      priceMin: (v) => ( (v >= PRICE_MIN && v <= PRICE_MAX) ? null : strings.form_err_price ),
      priceMax: (v) => ( (v >= PRICE_MIN && v <= PRICE_MAX) ? null : strings.form_err_price )
    }
  });

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
            <Button onClick={addbtncontroller.open}><FaPlus /></Button>
            <Drawer opened={addbtn} onClose={addbtncontroller.close} title={"Create post"} position='right' offset={8} radius="md">
              <TextInput label={strings.form_title_title} key={postForm.key('title')} {...postForm.getInputProps('title')} />
              <NumberInput label={strings.form_title_remove} key={postForm.key('remove')} min={1} max={90} {...postForm.getInputProps('remove')} />
              <MultiSelect label={strings.form_title_subjects} data={subjects} key={postForm.key('subjects')} {...postForm.getInputProps('subjects')} />
              <NativeSelect label={strings.form_title_state} data={STATES} key={postForm.key('state')} {...postForm.getInputProps('state')} />
              <MultiSelect label={strings.form_title_years} data={['1', '2', '3', '4']} key={postForm.key('years')} {...postForm.getInputProps('years')} />
              <Group>
                <NumberInput label={`${(priceRange) ? 'Min. ' : ''}${strings.form_title_price}`} key={postForm.key('priceMin')} {...postForm.getInputProps('priceMin')} />
                <Checkbox label={strings.checkbox} checked={priceRange} onChange={(e) => {setPriceRange(e.currentTarget.checked)}} />
                <NumberInput label={`Max. ${strings.form_title_price}`} key={postForm.key('priceMax')} {...postForm.getInputProps('priceMax')} disabled={!priceRange} />
              </Group>
              <Button onClick={createPost}>Post!</Button>
            </Drawer>
          </Center>
        </Group>
      </Stack>
    </>
  );
}