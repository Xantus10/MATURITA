import { Stack, TextInput, Textarea, NativeSelect, Button } from '@mantine/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Header from '../../Components/Clickables/Header';
import { post } from '../../Util/http';
import { autoHttpResponseNotification } from '../../Util/notifications';
import { GROUPS, type MessageData } from '../../Components/Displays/MessageDisplay';

import classes from '../../styles/default.module.css';

/**
 * Admin page for blacklisting Microsoft Ids
 */
export default function ASendMessage() {
  async function sendMessage() {
    let res = await post('/messages/group', {target: groupInp, title: titleInp, content: contInp});
    if (res) {
      autoHttpResponseNotification(res);
    }
  }

  const { t } = useTranslation('admin');

  const [groupInp, setGroupInp] = useState<MessageData['TargetGroup']>('all');
  const [titleInp, setTitleInp] = useState<string>('');
  const [contInp, setContInp] = useState<string>('');

  return (
    <>
      <Stack className={classes.container}>
        <Header title={t('sendMsgPage.title')} view="admin" />
        <Stack p={"md"}>
          <NativeSelect label={t('sendMsgPage.group')} data={GROUPS} value={groupInp} onChange={(e) => setGroupInp(e.currentTarget.value as MessageData['TargetGroup'])} />
          <TextInput label={t('sendMsgPage.labeltitle')} value={titleInp} onChange={(e) => setTitleInp(e.currentTarget.value)} />
          <Textarea label={t('sendMsgPage.labelcont')} value={contInp} onChange={(e) => setContInp(e.currentTarget.value)} />
          <Button onClick={sendMessage}>{t('sendMsgPage.send')}</Button>
        </Stack>
      </Stack>
    </>
  );
}