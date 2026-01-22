import { Stack, Paper, Grid, Text, Code, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { UserCache, type PublicUserData } from '../../Util/cache';

/**
 * Data associated with a singular user ban
 */
export interface BanData {
  /**
   * When was the ban issued
   */
  CreatedAt: Date;

  /**
   * Date the ban is valid until
   */
  Until: Date;

  /**
   * User._id of the user who issued the ban
   */
  IssuedBy: string;

  /**
   * Reason for the ban
   */
  Reason: string;
}


/**
 * Ban data extended by a Valid field
 */
export interface LabeledBanData extends BanData {
  /**
   * Is the ban valid as of the current moment
   */
  Valid: boolean;
};

/**
 * Compare all the ban data and conclude if the user has an active ban
 * 
 * @param bans Ban data
 * @returns true if the user is banned, false otherwise
 */
export function isBanned(bans: BanData[]) {
  let now = new Date();
  for (let ban of bans) {
    if (now > ban.CreatedAt && now < ban.Until) {
      return true;
    }
  }
  return false;
}

/**
 * Turn bandata into LabeledBanData (Check validity of each ban)
 * 
 * @param bans Ban data
 * @returns Labeled ban data with Valid values, sorted by most recently active
 */
export function labelBans(bans: BanData[]) : LabeledBanData[] {
  let now = new Date();
  let lbans: LabeledBanData[] = bans.map((val) => {return {...val, Valid: (now > val.CreatedAt && now < val.Until)}});
  lbans.sort((a, b) => {return b.Until.getTime() - a.Until.getTime()});
  return lbans;
}

/**
 * A component to display a singular ban
 */
export function BanDisplay({CreatedAt, Until, IssuedBy, Reason, Valid}: LabeledBanData) {
  const [disc, discController] = useDisclosure(false);

  const { t } = useTranslation();

  const [by, setBy] = useState<PublicUserData>();

  useEffect(() => {
    UserCache.getUserData(IssuedBy).then((val) => {
      if (val) {
        setBy(val);
      }
    });
  }, [])

  return (
    <>
    <Paper bd={(Valid) ? 'solid 1px var(--mantine-color-red-7)' : ''} p={"sm"} onClick={discController.open} withBorder={Valid} >
      <Grid>
        <Grid.Col span={6}>
          <Text>
            {Reason}
          </Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Code>
            {Until.toLocaleString()}
          </Code>
        </Grid.Col>
      </Grid>
    </Paper>

    <Modal opened={disc} onClose={discController.close} withCloseButton centered>
      <Stack p={'sm'} gap={'md'}>
        <Text>{t('userDisplay.banReason')}: {Reason}</Text>
        <Code>
          {t('postdisplay.created')}: {CreatedAt.toLocaleString()}
        </Code>
        <Code>
          {t('postdisplay.until')}: {Until.toLocaleString()}
        </Code>
        <Text>{by?.Name.First} {by?.Name.Last}</Text>
      </Stack>
    </Modal>
    </>
  );
}

export default BanDisplay;