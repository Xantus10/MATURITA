/**
 * File: envconfig.ts  
 * Purpose: Loading .env variables and providing typing for them
 */

import dotenv from 'dotenv';

dotenv.config();

/**
 * App .env config
 */
interface Config {
  /**
   * URI used for connecting to database
   */
  DBURI: string;

  /**
   * Issuer URL used for validating JWT tokens
   */
  MICROSOFT_ISSUER_URL: string;

  /**
   * Microsoft tenant app id used for validating JWT tokens
   */
  MICROSOFT_APP_ID: string;

  /**
   * Port to run the app on
   */
  PORT: number;

  /**
   * Secret for signing CSRF tokens
   */
  CSRF_SECRET: string;
};

const env: Config = {
  DBURI: process.env.DBURI || 'mongodb://127.0.0.1:27017',
  MICROSOFT_ISSUER_URL: process.env.MICROSOFT_ISSUER_URL || 'https://login.microsoftonline.com/tenantid/v2.0',
  MICROSOFT_APP_ID: process.env.MICROSOFT_APP_ID || 'appClientId',
  PORT: parseInt(process.env.PORT as string) || 5000,
  CSRF_SECRET: process.env.CSRF_SECRET || 'VNSE48*6U41OER/SGg4s5gs4`F|Hsg181-b0'
};

export default env;
