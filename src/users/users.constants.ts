import * as crypto from 'crypto'
export const emailRegex: RegExp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
export const jwtConstants = {
  SECRET_KEY: 'nestwave',
  ENCRYPTION_KEY:Buffer.from("75d1d590b9def3b91b56d2afc12092e44aa94e202430b73d0af75accb634e5fd", "hex"),
};
