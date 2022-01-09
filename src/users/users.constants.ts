export const emailRegex: RegExp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
export const jwtConstants = {
  SECRET_KEY: 'nestwave',
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
};
