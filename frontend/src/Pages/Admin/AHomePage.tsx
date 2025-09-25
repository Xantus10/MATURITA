import { Title, Button, Stack, Group, NumberInput, NativeSelect, MultiSelect, Menu } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import PostDisplay, { type PostData } from '../../Components/PostDisplay';
import Logout from '../../Components/Logout';
import LangSwitch from '../../Components/LangSwitch';
import { get } from '../../Util/http';
import { autoHttpResponseNotification } from '../../Util/notifications';

import classes from '../styles/homepage.module.css'

const PRICE_MIN = 0;
const PRICE_MAX = 1000;


export default function AHomePage() {
  async function getPosts(begin: number, overwrite: boolean) {
    let values = filterForm.getValues();
    if (values.priceMax < values.priceMin) values.priceMax = values.priceMin;
    let res = await get('/posts', {begin: begin, orderBy: orderBy, filterState: values.state, filterYears: values.years, filterSubjects: values.subjects, priceMin: values.priceMin, priceMax: values.priceMax});
    if (res) {
      autoHttpResponseNotification(res);
      setPosts((overwrite) ? ((await res.json()).posts) : (posts.concat((await res.json()).posts)));
    }
  }

  const { t } = useTranslation('homepage');
  const navigate = useNavigate();

  const STATES = ['Like new', 'Good', 'Worn'];

  const [subjects, setSubjects] = useState(['CJK', 'ANJ', 'PSI']); // WILL NEED TO CHANGE ONCE Subjects are implemented on BE
  const [posts, setPosts] = useState<PostData[]>([]);

  setSubjects;

  const [orderBy, setOrderBy] = useState('date');

  useEffect(() => {
    getPosts(0, true);
  }, [orderBy]);

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
          <Title order={1}>{t('admin.title')}</Title>
          <LangSwitch />
          <Menu position="bottom-end">
            <Menu.Target>
              <Button w="110px" h="40px">{t('admin.manage')}</Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => {navigate('/users')}}>
                <Button fullWidth>{t('admin.users')}</Button>
              </Menu.Item>
              <Menu.Item onClick={() => {}}>
                <Button fullWidth>YYY</Button>
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
              {posts.map((p) => <PostDisplay data={p} view='admin' />)}
            </Stack>
          </Stack>
        </Group>
      </Stack>
    </>
  );
}