namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    SECRET_KEY: string;
    ENCRYPTION_KEY: string;
    PORT: number;
    FLW_PUBLIC_KEY: string;
    FLW_SECRET_KEY: string;
  }
}
