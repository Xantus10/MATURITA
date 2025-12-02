import { Drawer, TextInput, Button } from "@mantine/core";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { FaPlus } from "react-icons/fa";

import { post } from "../../Util/http";
import { autoHttpResponseNotification } from "../../Util/notifications";
import { showNotification } from "../../Util/notifications";

import { useTranslation } from "react-i18next";

export default function AddSubject() {
  const { t } = useTranslation('components')
  const [addBtnDisc, addBtnDiscController] = useDisclosure(false);
  const [inp, setInp] = useState("");

  async function addSubject() {
    if (inp.length === 3) {
      let res = await post('/subjects', {subject: inp});
      if (res) {
        autoHttpResponseNotification(res);
      }
    } else {
      showNotification({title: t('addsubject.err3let'), message: "", icon: 'INFO'})
    }
  }

  return (
    <>
      <Button onClick={addBtnDiscController.open} radius="50%" h="50px" w="50px" pos='fixed' bottom='50px' right='50px'><FaPlus /></Button>
      <Drawer opened={addBtnDisc} onClose={addBtnDiscController.close} title={t('addsubject.addsub')} position='right' offset={18} radius="md">
        <TextInput label={t('addsubject.subcode')} value={inp} onChange={(e) => {setInp(e.currentTarget.value)}} placeholder="MAT, INT, ..." />
        <Button m="md" onClick={addSubject}>{t('addsubject.addsub')}</Button>
      </Drawer>
    </>
  );
}
