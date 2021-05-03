import dotenv from 'dotenv';
// .env.* loading...
dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'dev';

if (NODE_ENV === 'prod') dotenv.config({ path: `${__dirname}/../../.env.prod` });
else if (NODE_ENV === 'dev') dotenv.config({ path: `${__dirname}/../../.env.dev` });
else if (NODE_ENV === 'test') dotenv.config({ path: `${__dirname}/../../.env.test` });

const env = process.env;

const GOOGLE = {
  CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  REDIRECT_URL: process.env.GOOGLE_REDIRECT_URL,
};

export default {
  NODE_ENV: NODE_ENV,
  HOST: env.HOST,
  PORT: Number(env.PORT),
  ETHNetwork: env.ETH_NETWORK,
  COOKIE_SECRET: env.COOKIE_SECRET,
  APPKEY: env.APPKEY,
  TOKEN: env.TOKEN,
  GOOGLE,
};
