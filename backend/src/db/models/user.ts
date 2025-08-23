import { Schema, model, Model } from "mongoose";
import type { UserIF, UserModelIF } from "../interfaces/user.ts";

export const userSchema = new Schema<UserIF, Model<UserIF>, UserModelIF>({
  MicrosoftId: {type: String, required: true, unique: true},
  Name: {
    First: {type: String, required: true},
    Last: {type: String, required: true}
  },
  Role: {type: String, enum: ['user', 'admin'], default: 'user'},
  LastLogin: {type: Date, default: Date.now, expires: 86400 * 30 * 15}
});

userSchema.static('updateLastLogin', function (microsoftId: string) {
  this.findOneAndUpdate({ MicrosoftId: microsoftId }, { $set: { LastLogin: new Date() } });
})

const User = model<UserIF, UserModelIF>('User', userSchema);
export default User;
