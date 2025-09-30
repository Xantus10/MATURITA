


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
  return lbans;
}

