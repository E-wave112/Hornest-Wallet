export default () => ({
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  SECRET_KEY: process.env.SECRET_KEY,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  FLW_PUBLIC_KEY: process.env.FLW_PUBLIC_KEY,
  FLW_SECRET_KEY: process.env.FLW_SECRET_KEY,
});
//     database: {
//       host: process.env.DATABASE_HOST,
//       port: parseInt(process.env.DATABASE_PORT, 10) || 5432
//     }
//   });
