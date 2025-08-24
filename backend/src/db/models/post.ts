import { Schema, model, Model, Types } from "mongoose";
import type { PostIF, PostModelIF } from "../interfaces/post.js";

export const postSchema = new Schema<PostIF, Model<PostIF>, PostModelIF>({
  CreatorId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  Title: {type: String, required: true},
  CreatedAt: {type: Date, default: Date.now},
  RemoveAt: {type: Date, required: true, expires: 1},
  Subjects: {type: [String], validate: (v: string[]) => {return v.length > 0}},
  State: {type: String, enum: ['Like new', 'Good', 'Worn'], required: true},
  Years: {type: [Number], validate: (v: number[]) => {return v.length > 0}},
  Price: {
    Min: {type: Number, required: true},
    Max: {type: Number, required: true}
  },
  //Photos: {type: [String]} Later
});

postSchema.static('extendRemoveAt', function (id: Types.ObjectId, days: number) {
  this.findByIdAndUpdate(id, { $inc: { RemoveAt: 86400 * 1000 * days } });
});

const Post = model<PostIF, PostModelIF>('Post', postSchema);
export default Post;
