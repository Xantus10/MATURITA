import mongoose from "mongoose";
import env from "../config/envconfig.js";


mongoose.set('bufferCommands', false);

/**
 * Establish a connection to the database
 */
export default async function connect() {
  let connected = false;

  while (!connected) {
    try {
      console.log('Attempting to connect to MongoDB...');
      await mongoose.connect(env.DBURI);
      console.log('MongoDB connection successful!');
      connected = true;
    } catch (error) {
      console.log('MongoDB connection failed. Retrying in 10 seconds...', error);
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
}
