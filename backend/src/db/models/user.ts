import { Schema, model } from "mongoose";
import type userIF from "../interfaces/user.ts";

export const userSchema = new Schema<userIF>({
  /*username: {type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 20},
  email: {type: String, required: true, unique: true, match: /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/},
  password: {type: String, required: true, select: false},
  privilegeLevel: {type: Number, required: true, default: 0},
  deactivated: {type: Boolean, required: true, default: false},
  passwordRecovery: {
    code: {type: String, default: ''},
    expires: {type: Date, default: Date.now},
    select: false
  }*/
});

const User = model<userIF>('User', userSchema);
export default User;