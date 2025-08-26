import mongoose from "mongoose";
import env from "../config/envconfig.js";


mongoose.set('bufferCommands', false);

export default async function connect() {
  try {
    await mongoose.connect(env.DBURI);
  } catch (error) {
    console.log(error);
  }
}
