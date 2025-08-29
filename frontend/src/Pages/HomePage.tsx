import { Text, Title, Button, Stack, Group, Drawer, TextInput, NumberInput, NativeSelect, MultiSelect, FileInput, Checkbox, Menu } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { MdOutlineAccountCircle, MdLogout, MdOutlineSettings, MdOutlineLocalPostOffice } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

import PostDisplay, { type PostData } from '../Components/PostDisplay';
import LangSwitch from '../Components/LangSwitch';
import { get, postFormV } from '../Util/http';

import classes from '../styles/homepage.module.css'

const PRICE_MIN = 0;
const PRICE_MAX = 1000;


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
    let res = await postFormV('/posts', values);
    console.log(res?.status);
  }

  const { t } = useTranslation('homepage');

  const [addbtn, addbtncontroller] = useDisclosure(false);
  const [priceRange, setPriceRange] = useState(false);

  const STATES = ['Like new', 'Good', 'Worn'];

  const [subjects, setSubjects] = useState(['CJK', 'ANJ', 'PSI']); // WILL NEED TO CHANGE ONCE Subjects are implemented on BE
  const [posts, setPosts] = useState<PostData[]>([]);
  console.log(posts);

  setSubjects;

  const [orderBy, setOrderBy] = useState('date');

  useEffect(() => {
    getPosts(0);
  }, [orderBy]);

  const postForm = useForm({
    mode: 'uncontrolled',
    initialValues: {
      title: '',
      remove: 14,
      subjects: [],
      state: 'Like new',
      years: [],
      priceMin: 0,
      priceMax: 0,
      pictures: []
    },
    validate: {
      title: (v) => ( (v.length > 0) ? null : t('form.err.title') ),
      remove: (v) => ( (v > 0) ? null : t('form.err.remove') ),
      subjects: (v) => ( (v.length > 0) ? null : t('form.err.subjects') ),
      state: (v) => ( (v in STATES) ? null : t('form.err.state') ),
      years: (v) => ( (v.length > 0) ? null : t('form.err.years') ),
      priceMin: (v) => ( (v >= PRICE_MIN && v <= PRICE_MAX) ? null : t('form.err.price', { PRICE_MIN: PRICE_MIN, PRICE_MAX: PRICE_MAX }) ),
      priceMax: (v) => ( (v >= PRICE_MIN && v <= PRICE_MAX) ? null : t('form.err.price', { PRICE_MIN: PRICE_MIN, PRICE_MAX: PRICE_MAX }) ),
      pictures: (v) => ( (v.length < 4) ? null : t('form.err.photos') ),
    }
  });

  return (
    <>
      <Stack className={classes.container}>
        <Group mih={'10vh'} bg={'gray.9'} p="md" justify="space-between">
          <Title order={1}>{t('title1')}</Title>
          <LangSwitch />
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
            <Text>{t('form.title.state')}</Text>
            <Text>{t('form.title.subjects')}</Text>
            <Text>{t('form.title.years')}</Text>
          </Stack>
          <Stack className={classes.main} bg={'gray.8'}>
            <Group>
              <NativeSelect data={[{label: t('orderDate'), value: 'date'}, {label: t('orderPrice'), value: 'price'}]} value={orderBy} onChange={(e) => setOrderBy(e.currentTarget.value)} />
            </Group>
            <Stack>
              {posts.map((p) => <PostDisplay {...p} />)}
            </Stack>
          </Stack>
          <Stack className={classes.new} justify="end" align='center'>
            <Button onClick={addbtncontroller.open} radius="50%" h="50px" w="50px"><FaPlus /></Button>
            <Drawer opened={addbtn} onClose={addbtncontroller.close} title={"Create post"} position='right' offset={18} radius="md">
              <TextInput label={t('form.title.title')} key={postForm.key('title')} {...postForm.getInputProps('title')} />
              <NumberInput label={t('form.title.remove')} key={postForm.key('remove')} min={1} max={90} {...postForm.getInputProps('remove')} />
              <MultiSelect label={t('form.title.subjects')} data={subjects} key={postForm.key('subjects')} {...postForm.getInputProps('subjects')} />
              <NativeSelect label={t('form.title.state')} data={STATES} key={postForm.key('state')} {...postForm.getInputProps('state')} />
              <MultiSelect label={t('form.title.years')} data={['1', '2', '3', '4']} key={postForm.key('years')} {...postForm.getInputProps('years')} />
              <NumberInput label={`${(priceRange) ? 'Min. ' : ''}${t('form.title.price')}`} min={PRICE_MIN} max={PRICE_MAX} key={postForm.key('priceMin')} {...postForm.getInputProps('priceMin')} />
              <Checkbox m="md" label={t('checkbox')} checked={priceRange} onChange={(e) => {setPriceRange(e.currentTarget.checked)}} />
              <NumberInput label={`Max. ${t('form.title.price')}`} min={PRICE_MIN} max={PRICE_MAX} key={postForm.key('priceMax')} {...postForm.getInputProps('priceMax')} disabled={!priceRange} display={(!priceRange) ? "none" : "initial"} />
              <FileInput label={t('form.title.photos')} description={t('form.desc.photos')} key={postForm.key('pictures')} {...postForm.getInputProps('pictures')} />
              <Button m="md" onClick={createPost}>Post!</Button>
            </Drawer>
          </Stack>
        </Group>
      </Stack>
    </>
  );
}