import { Schema, model } from "mongoose";
import type { MessageIF } from "../interfaces/message.js";


export const messageSchema = new Schema<MessageIF>({
  Sender: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  TargetUser: {type: Schema.Types.ObjectId, ref: 'User'},
  TargetGroup: {type: String, enum: ['admin', 'all']},
  SentAt: {type: Date, default: Date.now},
  Title: {type: String, required: true},
  Content: {type: String, required: true}
});

const Message = model<MessageIF>('Message', messageSchema);
export default Message;
