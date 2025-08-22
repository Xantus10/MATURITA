import mongoose from "mongoose";
import env from "../config/envconfig.js";

export default async function connect() {
  await mongoose.connect(env.DBURI);
}
