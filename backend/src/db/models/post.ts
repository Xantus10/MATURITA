import { Schema, model, Model, Types } from "mongoose";
import type { PostIF, PostModelIF } from "../interfaces/post.js";

export const MIN_RANGE = 0;
export const MAX_RANGE = 1000;

export const postSchema = new Schema<PostIF, Model<PostIF>, PostModelIF>({
  CreatorId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  Title: {type: String, required: true},
  CreatedAt: {type: Date, default: Date.now},
  RemoveAt: {type: Date, required: true, expires: 1, set: (days: number | Date) => {
    if (typeof(days) === 'number') {
      return new Date(Date.now() + 86400 * 1000 * days);
    } else {
      return days;
    }
  }},
  Subjects: {type: [String], validate: (v: string[]) => {return v.length > 0}},
  State: {type: String, enum: ['Like new', 'Good', 'Worn'], required: true},
  Years: {type: [Number], validate: (v: number[]) => {return v.length > 0}},
  Price: {
    Min: {type: Number, required: true, min: MIN_RANGE, max: MAX_RANGE},
    Max: {type: Number, required: true, min: MIN_RANGE, max: MAX_RANGE}
  },
  Photos: {type: [String], required: true}
});

postSchema.static('extendRemoveAt', async function (id: Types.ObjectId, newDate: Date) {
  console.log(newDate.toISOString());
  await this.findByIdAndUpdate(id, { RemoveAt: newDate } );
});

const Post = model<PostIF, PostModelIF>('Post', postSchema);
export default Post;
