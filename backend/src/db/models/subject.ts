import { Schema, model } from "mongoose";
import type { SubjectIF } from "../interfaces/subject.js";

export const subjectSchema = new Schema<SubjectIF>({
  Subject: {type: String, required: true, unique: true}
});

/**
 * API to interact with the subjects collection
 */
const Subject = model<SubjectIF>('Subject', subjectSchema);
export default Subject;
