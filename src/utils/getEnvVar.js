import 'dotenv/config';

export const getEnvVar = (key, defaultValue = null) => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    console.warn(`Environment variable ${key} is not set. Using default value.`);
  }
  return value;
};