import { Model } from "mongoose";

export interface UserIF {
  MicrosoftId: string;
  Name: {
    First: string;
    Last: string;
  };
  Role: 'user' | 'admin';
  LastLogin: Date
};

export interface UserModelIF extends Model<UserIF> {
  updateLastLogin(microsoftId: string): void;
};
