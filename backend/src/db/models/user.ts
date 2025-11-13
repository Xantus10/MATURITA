import { Schema, model, Model, Types } from "mongoose";
import type { UserIF, UserModelIF } from "../interfaces/user.ts";


export const userSchema = new Schema<UserIF, Model<UserIF>, UserModelIF>({
  MicrosoftId: {type: String, required: true, unique: true},
  Name: {
    First: {type: String, required: true},
    Last: {type: String, required: true}
  },
  Role: {type: String, enum: ['user', 'admin'], default: 'user'},
  LastLogin: {type: Date, default: Date.now, expires: 86400 * 30 * 15},
  Bans: [{
    CreatedAt: {type: Date, default: Date.now},
    Until: {type: Date, required: true, set: (days: number | Date) => {
      if (typeof(days) === 'number') {
        return new Date(Date.now() + 86400 * 1000 * days);
      } else {
        return days;
      }
    }},
    IssuedBy: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    Reason: {type: String, default: ""}
  }],
  Socials: {
    Email: {type: String},
    Phone: {type: String},
    Instagram: {type: String},
    Discord: {type: String}
  }
});

userSchema.static('updateLastLogin', async function (id: Types.ObjectId) {
  await this.findByIdAndUpdate(id, { $set: { LastLogin: new Date() } });
});

userSchema.static('setRole', async function (id: Types.ObjectId, role: UserIF['Role']) {
  await this.findByIdAndUpdate(id, { $set: { Role: role } });
});

userSchema.static('ban', async function (id: Types.ObjectId, issuedBy: Types.ObjectId, days: number, reason: string) {
  await this.findByIdAndUpdate(id, { $push: { Bans: { Until: days, IssuedBy: issuedBy, Reason: reason } } });
})


/**
 * API to interact with the users collection
 */
const User = model<UserIF, UserModelIF>('User', userSchema);
export default User;
