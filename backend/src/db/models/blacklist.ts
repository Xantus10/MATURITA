import { Schema, model } from "mongoose";
import type { BlacklistIF } from "../interfaces/blacklist.js";

export const blacklistSchema = new Schema<BlacklistIF>({
  MicrosoftId: {type: String, required: true, unique: true},
  CreatedAt: {type: Date, default: Date.now},
  Reason: {type: String, default: ""}
});

/**
 * API to interact with the blacklists collection
 */
const Blacklist = model<BlacklistIF>('Blacklist', blacklistSchema);
export default Blacklist;
