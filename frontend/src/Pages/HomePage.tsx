import { Text, Title, Button, Stack, Group, Drawer, TextInput, NumberInput, NativeSelect, MultiSelect, Checkbox, Menu } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { MdOutlineAccountCircle, MdLogout, MdOutlineSettings, MdOutlineLocalPostOffice } from 'react-icons/md';
import LocalizedStrings from 'react-localization'

import PostDisplay, { type PostData } from '../Components/PostDisplay';
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
    orderDate: 'Nejnovější',
    orderPrice: 'Nejlevnější',
    title1: 'Vítejte na burze učebnic'
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
    orderDate: 'Most recent',
    orderPrice: 'The cheapest',
    title1: 'Welcome on the market for books'
  }
})


export default function HomePage() {
  async function getPosts(begin: number) {
    let res = await get('/posts', {begin: begin, orderBy: orderBy, filterState: STATES, filterYears: [1, 2, 3, 4], filterSubjects: subjects});
    if (!res) return;
    if (res.status !== 200) return;
    setPosts(posts.concat((await res.json()).posts));
  }
  
  async function createPost() {
    let values = postForm.getValues()
    if (values.priceMax < values.priceMin || !priceRange) values.priceMax = values.priceMin;
    let res = await post('/posts', values);
    console.log(res?.status);
  }

  const [addbtn, addbtncontroller] = useDisclosure(false);
  const [priceRange, setPriceRange] = useState(false);

  const STATES = ['Like new', 'Good', 'Worn'];

  const [subjects, setSubjects] = useState(['CJK', 'ANJ', 'PSI']); // WILL NEED TO CHANGE ONCE Subjects are implemented on BE
  const [posts, setPosts] = useState<PostData[]>([]);

  setSubjects;

  const [orderBy, setOrderBy] = useState('date');

  useEffect(() => {
    getPosts(0);
  }, []);

  const postForm = useForm({
    mode: 'uncontrolled',
    initialValues: {
      title: '',
      remove: 14,
      subjects: [],
      state: 'Like new',
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
        <Group mih={'10vh'} bg={'gray.9'} p="md" justify="space-between">
          <Title order={1}>{strings.title1}</Title>
          <Menu position="bottom-end">
            <Menu.Target>
              <Button w="110px" h="40px"><MdOutlineAccountCircle size="2rem" /></Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>
                <Button leftSection={<MdOutlineSettings />}>Account settings</Button>
              </Menu.Item>
              <Menu.Item>
                <Button leftSection={<MdOutlineLocalPostOffice />}>My posts</Button>
              </Menu.Item>
              <Menu.Item>
                <Button color='red.7' leftSection={<MdLogout />}>Log out</Button>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
        <Group className={classes.divider} preventGrowOverflow={false} align='start'>
          <Stack className={classes.filters} bg={'gray.8'}>
            <Text>{strings.form_title_state}</Text>
            <Text>{strings.form_title_subjects}</Text>
            <Text>{strings.form_title_years}</Text>
          </Stack>
          <Stack className={classes.main} bg={'gray.8'}>
            <Group>
              <NativeSelect data={[{label: strings.orderDate, value: 'date'}, {label: strings.orderPrice, value: 'price'}]} value={orderBy} onChange={(e) => setOrderBy(e.currentTarget.value)} />
            </Group>
            <Stack>
              {posts.map((p) => <PostDisplay {...p} />)}
            </Stack>
          </Stack>
          <Stack className={classes.new} justify="end" align='center'>
            <Button onClick={addbtncontroller.open} radius="50%" h="50px" w="50px"><FaPlus /></Button>
            <Drawer opened={addbtn} onClose={addbtncontroller.close} title={"Create post"} position='right' offset={18} radius="md">
              <TextInput label={strings.form_title_title} key={postForm.key('title')} {...postForm.getInputProps('title')} />
              <NumberInput label={strings.form_title_remove} key={postForm.key('remove')} min={1} max={90} {...postForm.getInputProps('remove')} />
              <MultiSelect label={strings.form_title_subjects} data={subjects} key={postForm.key('subjects')} {...postForm.getInputProps('subjects')} />
              <NativeSelect label={strings.form_title_state} data={STATES} key={postForm.key('state')} {...postForm.getInputProps('state')} />
              <MultiSelect label={strings.form_title_years} data={['1', '2', '3', '4']} key={postForm.key('years')} {...postForm.getInputProps('years')} />
              <NumberInput label={`${(priceRange) ? 'Min. ' : ''}${strings.form_title_price}`} min={PRICE_MIN} max={PRICE_MAX} key={postForm.key('priceMin')} {...postForm.getInputProps('priceMin')} />
              <Checkbox m="md" label={strings.checkbox} checked={priceRange} onChange={(e) => {setPriceRange(e.currentTarget.checked)}} />
              <NumberInput label={`Max. ${strings.form_title_price}`} min={PRICE_MIN} max={PRICE_MAX} key={postForm.key('priceMax')} {...postForm.getInputProps('priceMax')} disabled={!priceRange} display={(!priceRange) ? "none" : "initial"} />
              <Button m="md" onClick={createPost}>Post!</Button>
            </Drawer>
          </Stack>
        </Group>
      </Stack>
    </>
  );
}