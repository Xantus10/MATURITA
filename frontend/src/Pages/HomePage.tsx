import { Title, Button, Stack, Group, Drawer, TextInput, NumberInput, NativeSelect, MultiSelect, FileInput, Checkbox, Menu } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { MdOutlineAccountCircle, MdOutlineSettings, MdOutlineLocalPostOffice } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

import PostDisplay, { type PostData } from '../Components/PostDisplay';
import Logout from '../Components/Logout';
import LangSwitch from '../Components/LangSwitch';
import { get, postFormV } from '../Util/http';
import { autoHttpResponseNotification } from '../Util/notifications';

import classes from '../styles/homepage.module.css'

/**
 * Lowest possible price
 */
export const PRICE_MIN = 0;

/**
 * Highest possible price
 */
export const PRICE_MAX = 1000;

/**
 * Home page
 */
export default function HomePage() {
  async function getPosts(begin: number, overwrite: boolean) {
    let values = filterForm.getValues();
    if (values.priceMax < values.priceMin) values.priceMax = values.priceMin;
    let res = await get('/posts', {begin: begin, orderBy: orderBy, filterState: values.state, filterYears: values.years, filterSubjects: values.subjects, priceMin: values.priceMin, priceMax: values.priceMax});
    if (res) {
      autoHttpResponseNotification(res);
      setPosts((overwrite) ? ((await res.json()).posts) : (posts.concat((await res.json()).posts)));
    }
  }
  
  async function createPost() {
    let values = postForm.getValues();
    if (values.priceMax < values.priceMin || !priceRange) values.priceMax = values.priceMin;
    let res = await postFormV('/posts', values);
    if (res) autoHttpResponseNotification(res);
  }

  const { t } = useTranslation('homepage');
  const navigate = useNavigate();

  const [addbtn, addbtncontroller] = useDisclosure(false);
  const [priceRange, setPriceRange] = useState(false);

  const STATES = ['Like new', 'Good', 'Worn'];

  const [subjects, setSubjects] = useState(['CJK', 'ANJ', 'PSI']); // WILL NEED TO CHANGE ONCE Subjects are implemented on BE
  const [posts, setPosts] = useState<PostData[]>([]);

  setSubjects;

  const [orderBy, setOrderBy] = useState('date');

  useEffect(() => {
    getPosts(0, true);
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

  const filterForm = useForm({
    mode: 'uncontrolled',
    initialValues: {
      subjects: subjects,
      state: STATES,
      years: ['1', '2', '3', '4'],
      priceMin: PRICE_MIN,
      priceMax: PRICE_MAX
    },
    validate: {
      subjects: (v) => ( (v.length > 0) ? null : t('form.err.subjects') ),
      state: (v) => ( (v.length > 0) ? null : t('form.err.states') ),
      years: (v) => ( (v.length > 0) ? null : t('form.err.years') ),
      priceMin: (v) => ( (v >= PRICE_MIN && v <= PRICE_MAX) ? null : t('form.err.price', { PRICE_MIN: PRICE_MIN, PRICE_MAX: PRICE_MAX }) ),
      priceMax: (v) => ( (v >= PRICE_MIN && v <= PRICE_MAX) ? null : t('form.err.price', { PRICE_MIN: PRICE_MIN, PRICE_MAX: PRICE_MAX }) ),
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
              <Menu.Item onClick={() => {navigate('/my-account')}}>
                <Button fullWidth leftSection={<MdOutlineSettings />}>{t('myacc')}</Button>
              </Menu.Item>
              <Menu.Item onClick={() => {navigate('/my-posts')}}>
                <Button fullWidth leftSection={<MdOutlineLocalPostOffice />}>{t('mypost')}</Button>
              </Menu.Item>
              <Menu.Item>
                <Logout />
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
        <Group className={classes.divider} preventGrowOverflow={false} align='start'>
          <Stack className={classes.filters} bg={'gray.8'}>
            <MultiSelect label={t('form.title.subjects')} data={subjects} key={filterForm.key('subjects')} {...filterForm.getInputProps('subjects')} />
            <MultiSelect label={t('form.title.state')} data={STATES} key={filterForm.key('state')} {...filterForm.getInputProps('state')} />
            <MultiSelect label={t('form.title.years')} data={['1', '2', '3', '4']} key={filterForm.key('years')} {...filterForm.getInputProps('years')} />
            <NumberInput label={`Min. ${t('form.title.price')}`} min={PRICE_MIN} max={PRICE_MAX} key={filterForm.key('priceMin')} {...filterForm.getInputProps('priceMin')} />
            <NumberInput label={`Max. ${t('form.title.price')}`} min={PRICE_MIN} max={PRICE_MAX} key={filterForm.key('priceMax')} {...filterForm.getInputProps('priceMax')} />
            <Button m="md" onClick={() => {getPosts(0, true)}}>{t('filter')}</Button>
          </Stack>
          <Stack className={classes.main} bg={'gray.8'}>
            <Group>
              <NativeSelect data={[{label: t('orderDate'), value: 'date'}, {label: t('orderPrice'), value: 'price'}]} value={orderBy} onChange={(e) => setOrderBy(e.currentTarget.value)} />
            </Group>
            <Stack>
              {posts.map((p) => <PostDisplay data={p} view='normal' />)}
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
              <FileInput label={t('form.title.photos')} description={t('form.desc.photos')} key={postForm.key('pictures')} {...postForm.getInputProps('pictures')} multiple />
              <Button m="md" onClick={createPost}>Post!</Button>
            </Drawer>
          </Stack>
        </Group>
      </Stack>
    </>
  );
}