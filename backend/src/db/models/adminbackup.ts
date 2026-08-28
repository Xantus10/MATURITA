import { Schema, model, Types } from "mongoose";
import type { AdminBackupIF } from "../interfaces/adminbackup.js";


export const adminBackupSchema = new Schema<AdminBackupIF>({
  MicrosoftId: {type: String, required: true, unique: true},
  Name: {
    First: {type: String, required: true},
    Last: {type: String, required: true}
  },
  SavedId: {type: Schema.Types.ObjectId, required: true}
});


/**
 * API to interact with the adminbackups collection
 */
const AdminBackup = model<AdminBackupIF>('AdminBackup', adminBackupSchema);
export default AdminBackup;
