import { MultiSelect, NativeSelect, Button, NumberInput, Drawer, TextInput, Checkbox, FileInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

import { PRICE_MIN, PRICE_MAX, STATES } from "../Displays/PostDisplay";
import { postFormV } from "../../Util/http";
import { autoHttpResponseNotification } from "../../Util/notifications";

import { useTranslation } from "react-i18next";



export default function AddPost({ subjects }: {subjects?: string[]} = { subjects: undefined }) {
  async function createPost() {
    let values = postForm.getValues();
    if (values.priceMax < values.priceMin || !priceRange) values.priceMax = values.priceMin;
    let res = await postFormV('/posts', values);
    if (res) {
      autoHttpResponseNotification(res);
      if (res.status === 201) {
        addbtncontroller.close();
      }
    }
  }

  const { t } = useTranslation('homepage');

  const [addbtn, addbtncontroller] = useDisclosure(false);
  const [priceRange, setPriceRange] = useState(false);
  
  
  const [csubjects, setSubjects] = useState<string[]>([]);

  useEffect(() => {
    if (subjects) {
      setSubjects(subjects);
    } else {
      // Fetch subjects on your own
      setSubjects(['ANJ', 'CJK', 'PSI']);
    }
  }, [])

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

  return (<>
  <Button onClick={addbtncontroller.open} radius="50%" h="50px" w="50px"><FaPlus /></Button>
  <Drawer opened={addbtn} onClose={addbtncontroller.close} title={"Create post"} position='right' offset={18} radius="md">
    <TextInput label={t('form.title.title')} key={postForm.key('title')} {...postForm.getInputProps('title')} />
    <NumberInput label={t('form.title.remove')} key={postForm.key('remove')} min={1} max={90} {...postForm.getInputProps('remove')} />
    <MultiSelect label={t('form.title.subjects')} data={(subjects) ? subjects : csubjects} key={postForm.key('subjects')} {...postForm.getInputProps('subjects')} />
    <NativeSelect label={t('form.title.state')} data={STATES} key={postForm.key('state')} {...postForm.getInputProps('state')} />
    <MultiSelect label={t('form.title.years')} data={['1', '2', '3', '4']} key={postForm.key('years')} {...postForm.getInputProps('years')} />
    <NumberInput label={`${(priceRange) ? 'Min. ' : ''}${t('form.title.price')}`} min={PRICE_MIN} max={PRICE_MAX} key={postForm.key('priceMin')} {...postForm.getInputProps('priceMin')} />
    <Checkbox m="md" label={t('checkbox')} checked={priceRange} onChange={(e) => {setPriceRange(e.currentTarget.checked)}} />
    <NumberInput label={`Max. ${t('form.title.price')}`} min={PRICE_MIN} max={PRICE_MAX} key={postForm.key('priceMax')} {...postForm.getInputProps('priceMax')} disabled={!priceRange} display={(!priceRange) ? "none" : "initial"} />
    <FileInput label={t('form.title.photos')} description={t('form.desc.photos')} key={postForm.key('pictures')} {...postForm.getInputProps('pictures')} multiple />
    <Button m="md" onClick={createPost}>Post!</Button>
  </Drawer>
  </>);
}
