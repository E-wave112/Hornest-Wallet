import path from 'path';
import dotenv from 'dotenv';

// Parsing the env file from the root of the project
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all

interface ENV {
  NODE_ENV: string | undefined;
  SECRET_KEY: string | undefined;
  ENCRYPTION_KEY: string | undefined;
  PORT: number | undefined;
  FLW_PUBLIC_KEY: string | undefined;
  FLW_SECRET_KEY: string | undefined;
}

interface Config {
  NODE_ENV: string;
  SECRET_KEY: string;
  ENCRYPTION_KEY: string;
  PORT: number;
  FLW_PUBLIC_KEY: string;
  FLW_SECRET_KEY: string;
}

// Loading process.env as ENV interface

const getConfig = (): ENV => {
  return {
    NODE_ENV: process.env.NODE_ENV,
    SECRET_KEY: process.env.SECRET_KEY,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
    FLW_PUBLIC_KEY: process.env.FLW_PUBLIC_KEY,
    FLW_SECRET_KEY: process.env.FLW_SECRET_KEY,
  };
};

// Throwing an Error if any field was undefined we don't
// want our app to run if it can't connect to DB and ensure
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type
// definition.

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;
