// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({
//   path: path.resolve(__dirname, '../.env'),
// });
// export const emailRegex =
//   /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
export const jwtConstants = {
  SECRET_KEY: process.env.SECRET_KEY,
  ENCRYPTION_KEY: Buffer.from(process.env.ENCRYPTION_KEY, 'hex'),
};
