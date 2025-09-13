import { Model, Types } from "mongoose";

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
  updateLastLogin(id: Types.ObjectId): Promise<void>;
};
