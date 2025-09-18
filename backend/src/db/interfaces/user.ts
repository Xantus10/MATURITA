import { Model, Types } from "mongoose";

export interface BanData {
  CreatedAt: Date;
  Until: Date;
  IssuedBy: Types.ObjectId;
  Reason: string;
}

export interface UserIF {
  MicrosoftId: string;
  Name: {
    First: string;
    Last: string;
  };
  Role: 'user' | 'admin';
  LastLogin: Date;
  Bans: BanData[];
};

export interface UserModelIF extends Model<UserIF> {
  updateLastLogin(id: Types.ObjectId): Promise<void>;
};
