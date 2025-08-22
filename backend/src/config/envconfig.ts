import dotenv from 'dotenv';

dotenv.config();

interface Config {
  DBURI: string;
  MICROSOFT_ISSUER_URL: string;
  PORT: number;
  CSRF_SECRET: string;
};

const env: Config = {
  DBURI: process.env.DBURI || 'mongodb://127.0.0.1:27017',
  MICROSOFT_ISSUER_URL: process.env.MICROSOFT_ISSUER_URL || 'https://login.microsoftonline.com/tenantid/v2.0',
  PORT: parseInt(process.env.PORT as string) || 5000,
  CSRF_SECRET: process.env.CSRF_SECRET || 'VNSE48*6U41OER/SGg4s5gs4`F|Hsg181-b0'
};

export default env;
