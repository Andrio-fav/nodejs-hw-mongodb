import 'dotenv/config';

export const getEnvVar = (variable, defaultValue) => {
  if (process.env[variable] !== undefined || defaultValue !== undefined) {
    return process.env[variable] ?? defaultValue;
  }
  throw new Error(`Missing: process.env['${variable}'].`);
};