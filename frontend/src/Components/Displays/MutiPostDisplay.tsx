import { Stack, MultiSelect, NativeSelect, Button, NumberInput, type StackProps } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState, useEffect } from "react";

import PostDisplay, { PRICE_MIN, PRICE_MAX, STATES, type PostData, type PostDisplayProps } from "./PostDisplay";
import type { SubjectData } from "./SubjectDisplay";
import { get } from "../../Util/http";
import { autoHttpResponseNotification } from "../../Util/notifications";

import { useTranslation } from "react-i18next";

/**
 * Wrapper function for whole post displaying functionality
 * 
 * @param filterFormProps Props to be passed down to FilterForm component
 * @param multiPostDisplayProps Props to be passed down to MultiPostDisplay component
 * @param postDisplayType Type to be passed down to individual PostDisplays
 * @returns 
 * FilterForm: Component of filter form  
 * MultiPostDisplay: Component of multi post display  
 * Subjects: State variable of all subjects  
 */
export default function useMultiPostDisplay(filterFormProps: StackProps, multiPostDisplayProps: StackProps, postDisplayType: PostDisplayProps['view'])
  : {
  FilterForm: React.ReactNode;
  MultiPostDisplay: React.ReactNode;
  Subjects: string[];
  }
  {

  async function getSubjects() {
    let res = await get('/subjects');
    if (res) {
      let newsubjects = ((await res.json()).slist as SubjectData[]).map((val) => val.Subject);
      setSubjects(newsubjects);
      filterForm.setFieldValue('subjects', newsubjects);
      await getPosts(0, true);
    }
  }
  
  async function getPosts(begin: number, overwrite: boolean) {
    if (filterForm.validate().hasErrors) {
      return
    }
    let values = filterForm.getValues();
    if (values.priceMax < values.priceMin) values.priceMax = values.priceMin;
    let res = await get('/posts', {begin: begin, orderBy: orderBy, filterState: values.state, filterYears: values.years, filterSubjects: values.subjects, priceMin: values.priceMin, priceMax: values.priceMax});
    if (res) {
      autoHttpResponseNotification(res);
      setPosts((overwrite) ? ((await res.json()).posts) : (posts.concat((await res.json()).posts)));
    }
  }

  const { t } = useTranslation('homepage');

  const [posts, setPosts] = useState<PostData[]>([]);
  const [orderBy, setOrderBy] = useState('date');
  const [subjects, setSubjects] = useState<string[]>([]);

  /**
   * Locally remove a post from the UI, exposed to PostDisplay
   * @param _id Id of the post
   */
  function UIremovePost(_id: string) {
    setPosts(posts.filter((val) => val._id !== _id));
  }
  
  useEffect(() => {
    getSubjects();
  }, [])

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

  return {
    FilterForm: (<>
      <Stack {...filterFormProps}>
        <MultiSelect label={t('form.title.subjects')} data={subjects} key={filterForm.key('subjects')} {...filterForm.getInputProps('subjects')} />
        <MultiSelect label={t('form.title.state')} data={STATES} key={filterForm.key('state')} {...filterForm.getInputProps('state')} />
        <MultiSelect label={t('form.title.years')} data={['1', '2', '3', '4']} key={filterForm.key('years')} {...filterForm.getInputProps('years')} />
        <NumberInput label={`Min. ${t('form.title.price')}`} min={PRICE_MIN} max={PRICE_MAX} key={filterForm.key('priceMin')} {...filterForm.getInputProps('priceMin')} />
        <NumberInput label={`Max. ${t('form.title.price')}`} min={PRICE_MIN} max={PRICE_MAX} key={filterForm.key('priceMax')} {...filterForm.getInputProps('priceMax')} />
        <Button m="md" onClick={() => {getPosts(0, true)}}>{t('filter')}</Button>
      </Stack>
    </>),

    MultiPostDisplay: (<>
      <Stack {...multiPostDisplayProps}>
        <NativeSelect data={[{label: t('orderDate'), value: 'date'}, {label: t('orderPrice'), value: 'price'}]} value={orderBy} onChange={(e) => setOrderBy(e.currentTarget.value)} />
        {posts.map((p) => <PostDisplay data={p} view={postDisplayType} removeSelf={() => UIremovePost(p._id)} />)}
        <Button m="md" onClick={() => {getPosts(posts.length, false)}}>{t('loadmore')}</Button>
      </Stack>
    </>),

    Subjects: subjects
  };
}
