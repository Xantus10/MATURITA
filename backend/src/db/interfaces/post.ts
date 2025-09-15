import { Model, Types } from "mongoose";

export interface PostIF {
  CreatorId: Types.ObjectId;
  Title: string;
  CreatedAt: Date;
  RemoveAt: Date;
  Subjects: string[];
  State: 'Like new' | 'Good' | 'Worn';
  Years: number[];
  Price: {
    Min: number;
    Max: number;
  };
  Photos: string[];
};

export interface PostModelIF extends Model<PostIF> {
  extendRemoveAt(id: Types.ObjectId, newDate: Date): Promise<void>;
  removeByCreatorId(id: Types.ObjectId): Promise<void>;
};
