import { Stack, Paper, Group, Text, Code, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { UserCache, type UserData } from '../Util/cache';


export interface BanData {
  CreatedAt: Date;
  Until: Date;
  IssuedBy: string;
  Reason: string;
};

export interface LabeledBanData extends BanData {
  Valid: boolean;
};

export function isBanned(bans: BanData[]) {
  let now = new Date();
  for (let ban of bans) {
    if (now > ban.CreatedAt && now < ban.Until) {
      return true;
    }
  }
  return false;
}

export function labelBans(bans: BanData[]) : LabeledBanData[] {
  let now = new Date();
  let lbans: LabeledBanData[] = bans.map((val) => {return {...val, Valid: (now > val.CreatedAt && now < val.Until)}});
  lbans.sort((a, b) => {return b.Until.getTime() - a.Until.getTime()});
  return lbans;
}

export function BanDisplay({CreatedAt, Until, IssuedBy, Reason, Valid}: LabeledBanData) {
  const [disc, discController] = useDisclosure(false);

  const t_comp = useTranslation().t;
  const t_adm = useTranslation('admin').t;

  const [by, setBy] = useState<UserData>({name: {first: '', last: ''}});

  useEffect(() => {
    UserCache.getUserData(IssuedBy).then((val) => {
      if (val) {
        setBy(val);
      }
    });
  }, [])

  return (
    <>
    <Paper bd={(Valid) ? 'solid 1px var(--mantine-color-red-7)' : ''} p={"sm"} onClick={discController.open} >
      <Group justify='space-between' >
        <Text>
          {Reason}
        </Text>
        <Code>
          {Until.toLocaleString()}
        </Code>
      </Group>
    </Paper>

    <Modal opened={disc} onClose={discController.close} withCloseButton centered>
      <Stack p={'sm'} gap={'md'}>
        <Text>{t_adm('userDisplay.banReason')}</Text>
        <Code>
          {t_comp('postdisplay.created')}: {CreatedAt.toLocaleString()}
        </Code>
        <Code>
          {t_comp('postdisplay.until')}: {Until.toLocaleString()}
        </Code>
        <Text>{by.name.first} {by.name.last}</Text>
      </Stack>
    </Modal>
    </>
  );
}

export default BanDisplay;